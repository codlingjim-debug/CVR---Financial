#!/usr/bin/env python3
"""Generate the CVR program-schedule dashboard from P6 XER exports.

Parses model/CVR_Master_Schedule.xer (delivery) and model/CVR_Pursuits_Schedule.xer
(estimating pipeline) — or any weekly P6 export dropped over them — and writes
reports/cvr_p6_dashboard.html: program timeline, bid deadlines with float,
long-lead procurement margins, upcoming milestones, and resource loading split
delivery-vs-pursuit. Same theming as the financial dashboard.

Usage: python3 scripts/build_p6_dashboard.py
"""
from datetime import date, datetime, timedelta
from pathlib import Path

DD = date(2026, 8, 12)
FILES = [("Delivery", "model/CVR_Master_Schedule.xer"),
         ("Pursuit", "model/CVR_Pursuits_Schedule.xer")]


# ------------------------------------------------------------- XER parsing --
def parse_xer(path):
    tables, cur, fields = {}, None, None
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        parts = line.split("\t")
        if parts[0] == "%T":
            cur = parts[1]
            tables[cur] = []
        elif parts[0] == "%F":
            fields = parts[1:]
        elif parts[0] == "%R" and cur:
            row = dict(zip(fields, parts[1:]))
            tables[cur].append(row)
    return tables


def pdate(s):
    if not s:
        return None
    return datetime.strptime(s[:10], "%Y-%m-%d").date()


def is_wd(d):
    return d.weekday() < 5


def wd_between(a, b):
    """Signed workdays from a to b (positive if b later)."""
    if a == b:
        return 0
    sign = 1 if b > a else -1
    lo, hi = (a, b) if b > a else (b, a)
    n, d = 0, lo
    while d < hi:
        d += timedelta(days=1)
        if is_wd(d):
            n += 1
    return n * sign


DATA = {}
for kind, path in FILES:
    t = parse_xer(path)
    tasks = {r["task_id"]: r for r in t["TASK"]}
    for r in tasks.values():
        r["_start"] = pdate(r["target_start_date"])
        r["_finish"] = pdate(r["target_end_date"])
        r["_cstr"] = pdate(r.get("cstr_date", ""))
    preds = {}
    for r in t.get("TASKPRED", []):
        preds.setdefault(r["task_id"], []).append(r["pred_task_id"])
    wbs = {r["wbs_id"]: r for r in t["PROJWBS"]}
    rsrc = {r["rsrc_id"]: r for r in t["RSRC"]}
    asgn = t.get("TASKRSRC", [])
    DATA[kind] = dict(tasks=tasks, preds=preds, wbs=wbs, rsrc=rsrc, asgn=asgn)

# ------------------------------------------------------------ derivations ---
# program bars: level-2 WBS spans
bars = []
for kind in ("Delivery", "Pursuit"):
    d = DATA[kind]
    root = next(w for w in d["wbs"].values() if w["proj_node_flag"] == "Y")
    kids = [w for w in d["wbs"].values() if w["parent_wbs_id"] == root["wbs_id"]]
    child_map = {}
    for w in d["wbs"].values():
        child_map.setdefault(w["parent_wbs_id"], []).append(w["wbs_id"])

    def descend(wid):
        out = [wid]
        for c in child_map.get(wid, []):
            out += descend(c)
        return out

    for w in sorted(kids, key=lambda x: int(x["seq_num"])):
        ids = set(descend(w["wbs_id"]))
        ts = [x for x in d["tasks"].values() if x["wbs_id"] in ids]
        if not ts:
            continue
        s = min(x["_start"] for x in ts)
        f = max(x["_finish"] for x in ts)
        if "Template" in w["wbs_name"] or "TEMPLATE" in w["wbs_name"]:
            continue
        bars.append((kind, w["wbs_name"], s, f, len(ts)))

# bid deadlines (pursuit FOB constraints)
bids = []
for r in DATA["Pursuit"]["tasks"].values():
    if r.get("cstr_type") == "CS_MEOB" and r["_cstr"]:
        fl = wd_between(r["_finish"], r["_cstr"])
        bids.append((r["task_name"].replace(" — SUBMIT BID", ""), r["_cstr"],
                     r["_finish"], fl))
bids.sort(key=lambda x: x[1])

# long-lead margins (delivery project: DLV milestones with SNE constraints)
longlead = []
dmap = DATA["Delivery"]
for r in dmap["tasks"].values():
    if r["task_type"] == "TT_Mile" and r["_cstr"] and "Delivery on site" in r["task_name"]:
        need = r["_cstr"]
        chain, cur, chain_wd = [], r, 0
        ok = True
        for _ in range(3):  # FAB, PO, TRN
            ps = dmap["preds"].get(cur["task_id"], [])
            if not ps:
                ok = False
                break
            cur = dmap["tasks"][ps[0]]
            chain_wd += int(float(cur["target_drtn_hr_cnt"]) / 8)
        if not ok:
            continue
        drv_ids = dmap["preds"].get(cur["task_id"], [])
        drv = dmap["tasks"][drv_ids[0]] if drv_ids else None
        # engineering must be complete by:
        d0, left = need, chain_wd
        while left:
            d0 -= timedelta(days=1)
            if is_wd(d0):
                left -= 1
        fc = drv["_finish"] if drv else None
        margin = wd_between(fc, d0) if fc else None
        item = r["task_name"].replace("Delivery on site — ", "")
        job = ""
        for kindname, wname, *_ in []:
            pass
        wnode = dmap["wbs"][r["wbs_id"]]
        longlead.append((item, wnode["wbs_name"], need, d0, fc, margin))
longlead.sort(key=lambda x: (x[5] if x[5] is not None else 999))

# upcoming milestones (both projects, next 150 days)
mst = []
for kind in ("Delivery", "Pursuit"):
    for r in DATA[kind]["tasks"].values():
        if r["task_type"] in ("TT_Mile", "TT_FinMile") and "TEMPLATE" not in r["task_name"]:
            f = r["_finish"]
            if DD <= f <= DD + timedelta(days=150):
                mst.append((f, kind, r["task_code"], r["task_name"]))
mst.sort()

# resource loading: monthly delivery vs pursuit + per-resource totals
months = []
m = date(2026, 8, 1)
while m <= date(2027, 12, 1):
    months.append(m)
    m = date(m.year + (m.month == 12), (m.month % 12) + 1, 1)


def month_span(s, f):
    """Return {month_first: workday_fraction} spread of a task."""
    total = max(wd_between(s, f), 1)
    out = {}
    for mm in months:
        me = date(mm.year + (mm.month == 12), (mm.month % 12) + 1, 1) - timedelta(days=1)
        lo, hi = max(s, mm), min(f, me)
        if lo > hi:
            continue
        out[mm] = wd_between(lo, hi) / total if total else 0
    return out


mload = {mm: {"Delivery": 0.0, "Pursuit": 0.0} for mm in months}
rtot = {}
for kind in ("Delivery", "Pursuit"):
    d = DATA[kind]
    for a in d["asgn"]:
        tk = d["tasks"][a["task_id"]]
        if "TEMPLATE" in tk["task_name"]:
            continue
        hrs = float(a["target_qty"] or 0)
        rname = d["rsrc"][a["rsrc_id"]]["rsrc_short_name"]
        rtot.setdefault(rname, [0.0, 0.0])
        rtot[rname][0 if kind == "Delivery" else 1] += hrs
        for mm, frac in month_span(tk["_start"], tk["_finish"]).items():
            mload[mm][kind] += hrs * frac

# ------------------------------------------------------------------- html ---
def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;")


def f_d(d):
    return d.strftime("%-m/%-d/%y") if d else "—"


TODAY = DD
span_lo, span_hi = date(2026, 8, 1), date(2028, 7, 1)


def xpct(d):
    return 100 * (d - span_lo).days / (span_hi - span_lo).days


# program timeline svg
rows_svg = []
H_ROW = 26
gh = len(bars) * H_ROW + 40
gsvg = [f'<svg viewBox="0 0 940 {gh}" class="main" role="img" aria-label="Program timeline by work area">']
for yr, mn in [(2026, 9), (2027, 1), (2027, 7), (2028, 1), (2028, 7)]:
    x = 220 + xpct(date(yr, mn, 1)) * 7.0
    gsvg.append(f'<line x1="{x:.0f}" x2="{x:.0f}" y1="6" y2="{gh-26}" stroke="var(--grid)"/>')
    gsvg.append(f'<text x="{x:.0f}" y="{gh-10}" font-size="11" fill="var(--muted)" text-anchor="middle">{mn}/{yr%100}</text>')
tx = 220 + xpct(TODAY) * 7.0
gsvg.append(f'<line x1="{tx:.0f}" x2="{tx:.0f}" y1="6" y2="{gh-26}" stroke="var(--neg)" stroke-width="1.5" stroke-dasharray="4 3"/>')
for i, (kind, name, s, f, n) in enumerate(bars):
    y = 8 + i * H_ROW
    x1 = 220 + xpct(s) * 7.0
    x2 = 220 + xpct(min(f, span_hi)) * 7.0
    color = "var(--accent)" if kind == "Delivery" else "var(--brand-green)"
    nm = name if len(name) <= 34 else name[:32] + "…"
    gsvg.append(f'<text x="212" y="{y+13}" font-size="11.5" fill="var(--ink-2)" text-anchor="end">{esc(nm)}</text>')
    gsvg.append(f'<rect x="{x1:.0f}" y="{y+3}" width="{max(x2-x1,3):.0f}" height="12" rx="3" fill="{color}" opacity="0.85"><title>{esc(name)}: {f_d(s)} – {f_d(f)} · {n} activities</title></rect>')
gsvg.append("</svg>")

# long-lead chart rows
ll_rows = []
for item, job, need, engby, fc, margin in longlead:
    cls = "neg" if (margin is not None and margin < 0) else "pos"
    ll_rows.append(
        f"<tr><td>{esc(item)}</td><td>{esc(job)}</td>"
        f"<td>{f_d(need)}</td><td>{f_d(engby)}</td><td>{f_d(fc)}</td>"
        f"<td class='{cls}'>{margin:+d} wd</td></tr>")

bid_rows = []
for name, due, fc, fl in bids:
    cls = "neg" if fl < 0 else "pos"
    bid_rows.append(f"<tr><td>{esc(name)}</td><td>{f_d(due)}</td>"
                    f"<td>{f_d(fc)}</td><td class='{cls}'>{fl:+d} wd</td></tr>")

ms_rows = []
for f, kind, code, name in mst[:16]:
    tag = "DLV" if kind == "Delivery" else "BID"
    ms_rows.append(f"<tr><td>{f_d(f)}</td><td><span class='chip {'b' if kind=='Pursuit' else ''}'>{tag}</span></td>"
                   f"<td>{esc(name)}</td></tr>")

# resource monthly stacked bars
maxh = max((v["Delivery"] + v["Pursuit"]) for v in mload.values()) or 1
rl = ['<svg viewBox="0 0 940 240" class="main" role="img" aria-label="Monthly resource loading">']
for i, gy in enumerate([0.25, 0.5, 0.75, 1.0]):
    y = 200 - gy * 180
    rl.append(f'<line x1="40" x2="920" y1="{y:.0f}" y2="{y:.0f}" stroke="var(--grid)"/>')
    rl.append(f'<text x="36" y="{y+4:.0f}" font-size="10" fill="var(--muted)" text-anchor="end">{int(maxh*gy):,}</text>')
bw = 880 / len(months)
for i, mm in enumerate(months):
    x = 42 + i * bw
    hd = mload[mm]["Delivery"] / maxh * 180
    hp = mload[mm]["Pursuit"] / maxh * 180
    rl.append(f'<rect x="{x:.0f}" y="{200-hd:.0f}" width="{bw-5:.0f}" height="{hd:.0f}" fill="var(--accent)" opacity="0.85"><title>{mm.strftime("%b %y")} delivery: {mload[mm]["Delivery"]:.0f} h</title></rect>')
    rl.append(f'<rect x="{x:.0f}" y="{200-hd-hp:.0f}" width="{bw-5:.0f}" height="{hp:.0f}" fill="var(--brand-green)" opacity="0.9"><title>{mm.strftime("%b %y")} pursuit: {mload[mm]["Pursuit"]:.0f} h</title></rect>')
    if mm.month in (1, 4, 7, 10) or i == 0:
        rl.append(f'<text x="{x+bw/2:.0f}" y="216" font-size="10" fill="var(--muted)" text-anchor="middle">{mm.strftime("%b %y")}</text>')
rl.append("</svg>")

rt_rows = []
for name, (dh, ph) in sorted(rtot.items(), key=lambda kv: -(kv[1][0] + kv[1][1])):
    tot = dh + ph
    if tot < 1:
        continue
    rt_rows.append(f"<tr><td>{esc(name)}</td><td>{dh:,.0f}</td><td>{ph:,.0f}</td>"
                   f"<td class='strong'>{tot:,.0f}</td><td>{tot/146:.1f}</td></tr>")

neg_ll = sum(1 for x in longlead if x[5] is not None and x[5] < 0)
neg_bid = sum(1 for b in bids if b[3] < 0)
n_acts = sum(len(DATA[k]["tasks"]) for k in DATA)

html = f"""<title>CVR Program Dashboard</title>
<style>
  :root {{
    --page: #f9f9f7; --surface: #fcfcfb; --ink: #0b0b0b; --ink-2: #52514e;
    --muted: #898781; --grid: #e1e0d9; --accent: #2a78d6; --neg: #e34948;
    --good: #006300; --ring: rgba(11,11,11,0.10); --brand-green: #86b332;
    color-scheme: light;
  }}
  @media (prefers-color-scheme: dark) {{
    :root:where(:not([data-theme="light"])) {{
      --page: #0d0d0d; --surface: #1a1a19; --ink: #ffffff; --ink-2: #c3c2b7;
      --muted: #898781; --grid: #2c2c2a; --accent: #3987e5; --neg: #e66767;
      --good: #0ca30c; --ring: rgba(255,255,255,0.10); color-scheme: dark;
    }}
  }}
  :root[data-theme="dark"] {{
    --page: #0d0d0d; --surface: #1a1a19; --ink: #ffffff; --ink-2: #c3c2b7;
    --muted: #898781; --grid: #2c2c2a; --accent: #3987e5; --neg: #e66767;
    --good: #0ca30c; --ring: rgba(255,255,255,0.10); color-scheme: dark;
  }}
  :root[data-theme="light"] {{
    --page: #f9f9f7; --surface: #fcfcfb; --ink: #0b0b0b; --ink-2: #52514e;
    --muted: #898781; --grid: #e1e0d9; --accent: #2a78d6; --neg: #e34948;
    --good: #006300; --ring: rgba(11,11,11,0.10); color-scheme: light;
  }}
  body {{ background: var(--page); color: var(--ink);
    font: 14.5px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif;
    margin: 0; padding: 28px 20px 56px; }}
  .wrap {{ max-width: 960px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }}
  .eyebrow {{ text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px;
    font-weight: 600; color: var(--ink-2); }}
  .eyebrow::before {{ content: ""; display: inline-block; width: 14px; height: 3px;
    background: var(--brand-green); margin-right: 8px; vertical-align: 3px; }}
  h1 {{ font-size: 23px; margin: 5px 0 2px; }}
  .sub {{ color: var(--ink-2); font-size: 13px; margin: 0; }}
  .kpis {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }}
  @media (min-width: 720px) {{ .kpis {{ grid-template-columns: repeat(6, 1fr); }} }}
  .tile {{ background: var(--surface); border: 1px solid var(--ring); border-radius: 8px; padding: 11px 14px; }}
  .tile .label {{ font-size: 11.5px; color: var(--ink-2); }}
  .tile .value {{ font-size: 21px; font-weight: 650; margin-top: 1px; }}
  .tile .delta {{ font-size: 11.5px; color: var(--ink-2); margin-top: 1px; }}
  .card {{ background: var(--surface); border: 1px solid var(--ring); border-radius: 10px; padding: 16px 18px 12px; }}
  .card h3 {{ font-size: 15px; margin: 0 0 1px; }}
  .card .cap {{ font-size: 12.5px; color: var(--ink-2); margin: 0 0 10px; }}
  svg.main {{ display: block; width: 100%; height: auto; }}
  table {{ border-collapse: collapse; width: 100%; font-size: 13px; }}
  th, td {{ text-align: left; padding: 6px 10px; border-bottom: 1px solid var(--grid);
    font-variant-numeric: tabular-nums; }}
  th {{ color: var(--ink-2); font-weight: 600; font-size: 12px; }}
  td.neg {{ color: var(--neg); font-weight: 650; }}
  td.pos {{ color: var(--good); font-weight: 650; }}
  td.strong {{ font-weight: 650; }}
  .chip {{ font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 9px;
    background: var(--accent); color: #fff; }}
  .chip.b {{ background: var(--brand-green); }}
  .legend {{ display: flex; gap: 16px; font-size: 12px; color: var(--ink-2); margin: 2px 0 8px; }}
  .key {{ display: inline-flex; align-items: center; gap: 6px; }}
  .sw {{ width: 13px; height: 11px; border-radius: 3px; display: inline-block; }}
  .duo {{ display: grid; gap: 16px; }}
  @media (min-width: 880px) {{ .duo {{ grid-template-columns: 1fr 1fr; }} }}
  .foot {{ font-size: 11.5px; color: var(--muted); margin-top: 6px; }}
</style>
<div class="wrap">
  <div>
    <div class="eyebrow">CVR Engineering · Program Controls</div>
    <h1>Program Schedule Dashboard</h1>
    <p class="sub">Generated from P6 XER exports · CVR-MASTER (delivery) + CVR-PURSUITS (estimating) · data date {f_d(DD)}</p>
  </div>

  <div class="kpis">
    <div class="tile"><div class="label">Activities</div><div class="value">{n_acts}</div><div class="delta">across 2 projects</div></div>
    <div class="tile"><div class="label">Bids due ≤45 days</div><div class="value">{sum(1 for b in bids if b[1] <= DD + timedelta(days=45))}</div><div class="delta">VanMeter 9/4 · Renaissance 9/15</div></div>
    <div class="tile"><div class="label">Bid float alerts</div><div class="value" style="color:var(--neg)">{neg_bid}</div><div class="delta">forecast past due date</div></div>
    <div class="tile"><div class="label">Long-lead alerts</div><div class="value" style="color:var(--neg)">{neg_ll}</div><div class="delta">eng-complete margin negative</div></div>
    <div class="tile"><div class="label">Delivery hours</div><div class="value">{sum(v[0] for v in rtot.values())/1000:.1f}K</div><div class="delta">resource-loaded</div></div>
    <div class="tile"><div class="label">Pursuit hours</div><div class="value">{sum(v[1] for v in rtot.values())/1000:.1f}K</div><div class="delta">estimating pipeline</div></div>
  </div>

  <div class="card">
    <h3>Program timeline — by work area</h3>
    <p class="cap">Bars span first activity start to last finish. Dashed line = data date.</p>
    <div class="legend"><span class="key"><span class="sw" style="background:var(--accent)"></span>Delivery (CVR-MASTER)</span>
    <span class="key"><span class="sw" style="background:var(--brand-green)"></span>Pursuits (CVR-PURSUITS)</span></div>
    {''.join(gsvg)}
  </div>

  <div class="duo">
    <div class="card">
      <h3>Bid deadlines — float to due date</h3>
      <p class="cap">Finish-on-or-before constraints vs forecast. Negative = forecast late; status actuals in P6 to correct.</p>
      <table><tr><th>Pursuit</th><th>Due</th><th>Forecast</th><th>Float</th></tr>{''.join(bid_rows)}</table>
    </div>
    <div class="card">
      <h3>Upcoming milestones (150 days)</h3>
      <p class="cap">Both projects, next {min(len(mst),16)} shown.</p>
      <table><tr><th>Date</th><th></th><th>Milestone</th></tr>{''.join(ms_rows)}</table>
    </div>
  </div>

  <div class="card">
    <h3>Long-lead procurement — engineering-complete margins</h3>
    <p class="cap">ENG BY = construction need − fabrication lead − PO cycle − transmittal. Negative margin: pull design left, release early, or move the need date.</p>
    <table><tr><th>Equipment</th><th>Job</th><th>Need</th><th>Eng by</th><th>IFC forecast</th><th>Margin</th></tr>{''.join(ll_rows)}</table>
  </div>

  <div class="card">
    <h3>Resource loading — delivery vs pursuit, hours per month</h3>
    <div class="legend"><span class="key"><span class="sw" style="background:var(--accent)"></span>Delivery</span>
    <span class="key"><span class="sw" style="background:var(--brand-green)"></span>Pursuit / estimating</span></div>
    {''.join(rl)}
  </div>

  <div class="card">
    <h3>Load by resource</h3>
    <p class="cap">Total assigned hours across both projects. TLE/SSE/STE rows are the open reqs — the hiring need, quantified.</p>
    <table><tr><th>Resource</th><th>Delivery h</th><th>Pursuit h</th><th>Total h</th><th>≈ FTE-mo</th></tr>{''.join(rt_rows)}</table>
    <p class="foot">Rebuild: drop fresh XER exports over model/*.xer and run scripts/build_p6_dashboard.py. Hours are planning-level until estimating/PM true them up in P6.</p>
  </div>
</div>
"""
Path("reports/cvr_p6_dashboard.html").write_text(html, encoding="utf-8")
print(f"wrote reports/cvr_p6_dashboard.html  ({len(bars)} program bars, "
      f"{len(bids)} bids, {len(longlead)} long-lead items, {len(rt_rows)} resources)")

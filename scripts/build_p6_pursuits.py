#!/usr/bin/env python3
"""Build CVR-PURSUITS: the estimating / pursuit-pipeline P6 project.

Companion project to CVR-MASTER (same resource pool, separate baseline churn):
  - Active estimates (VanMeter 9/4, Renaissance 9/15) on the full estimate
    template: bid/no-bid -> engineering basis -> takeoffs -> HWC constructability
    review -> pricing -> SVP gate -> submit (finish-on-or-before the due date).
  - Submitted bids pending award (Frontier, Jacksonburg, Rosehill, Lansing BWL)
    tracked to award-decision milestones.
  - Three copy-ready pursuit templates (EPC-paired / engineering-only / program)
    parked in 2027 for estimating to copy when the Excel backlog loads.
  - Estimating operations: transition-in, weekly pursuit review cadence.

Estimating resources are placeholders (FM + ES1..ES3) until the team transitions;
engineering/PM resources reuse the CVR-MASTER pool (same short names, so P6
matches them on import into the same database).

Outputs:
  model/CVR_Pursuits_Schedule.xer            (File > Import > XER, project CVR-PURSUITS)
  model/CVR_Pursuits_Register.xlsx           (register + Excel-paste intake sheet)
"""
from datetime import date, timedelta

DD = date(2026, 8, 12)  # data date


def is_wd(d):
    return d.weekday() < 5


def next_wd(d):
    while not is_wd(d):
        d += timedelta(days=1)
    return d


def add_wd(d, n):
    d = next_wd(d)
    if n <= 0:
        return d
    left = n - 1
    while left:
        d += timedelta(days=1)
        if is_wd(d):
            left -= 1
    return d


def sub_wd(d, n):
    d = next_wd(d)
    left = n
    while left:
        d -= timedelta(days=1)
        if is_wd(d):
            left -= 1
    return d


# --------------------------------------------------------------- resources --
# Shared pool (same ids/shorts as CVR-MASTER so P6 matches on import) + estimating
RSRC = [
    (1, "RP", "Roy Pierce — Principal Engineer"),
    (2, "HW", "Hayley Worthen — Senior Engineer"),
    (4, "BP", "Bhkti Patel — Engineer III"),
    (5, "FW", "Francis Wagner — Engineer III"),
    (7, "CP", "Craig Peterson — Engineer I"),
    (8, "KM", "Kevin Metts — Designer II"),
    (11, "SPM", "Senior PM (starts 8/24)"),
    (12, "TLE", "T-Line Engineer (open req)"),
    (13, "SSE", "Substation Engineer (open req)"),
    (14, "STE", "Structural Engineer (open req)"),
    (16, "PLS", "PLS Procurement"),
    (17, "HPM", "HWC Construction PM (coordination)"),
    (18, "FM", "Frank Miller — Director of Estimating"),
    (19, "ES1", "Estimator 1 (placeholder — name on transition)"),
    (20, "ES2", "Estimator 2 (placeholder — name on transition)"),
    (21, "ES3", "Estimator 3 (placeholder — name on transition)"),
]
RS = {s: i for i, s, _ in RSRC}

# --------------------------------------------------------------- WBS tree ---
WBS = [
    ("PUR", "CVR Pursuits — Estimating Pipeline", None),
    ("ACT", "Active Estimates (in development)", "PUR"),
    ("ACT.VM", "MEC VanMeter 161kV — EPC-paired (due 9/4)", "ACT"),
    ("ACT.RN", "DTE Renaissance 345kV — EPC-paired (due 9/15)", "ACT"),
    ("SUB", "Submitted — Pending Award", "PUR"),
    ("TMP", "Pursuit Templates (copy in P6 per new estimate)", "PUR"),
    ("TMP.EPC", "TEMPLATE — EPC-paired pursuit", "TMP"),
    ("TMP.ENG", "TEMPLATE — Engineering-only pursuit", "TMP"),
    ("TMP.PRG", "TEMPLATE — Program / audit pursuit", "TMP"),
    ("OPS", "Estimating Operations & Transition", "PUR"),
]

A = []


def act(code, wbs, name, typ="T", dur=5, preds=(), res=(), sne=None, fob=None):
    A.append(dict(code=code, wbs=wbs, name=name, typ=typ, dur=dur,
                  preds=list(preds), res=list(res), sne=sne, fob=fob))


def estimate_cycle(px, wbs, label, due, eng, eng_h, est, kind="EPC",
                   start=None):
    """Full estimate template ending in a submit milestone constrained FOB due."""
    act(f"{px}-GNG", wbs, f"{label} — bid/no-bid gate & scope review", "T", 2,
        [], [("FM", 8), ("RP", 4)], sne=start)
    act(f"{px}-ENG", wbs, f"{label} — engineering basis for estimate (~60% definition)",
        "T", 8, [(f"{px}-GNG", "FS", 0)], [(eng, eng_h), ("KM", int(eng_h * 0.4))])
    act(f"{px}-TKO", wbs, f"{label} — quantity takeoffs & material pricing", "T", 6,
        [(f"{px}-ENG", "SS", 3)], [(est, 40), ("PLS", 12)])
    if kind == "EPC":
        act(f"{px}-CON", wbs, f"{label} — HWC constructability & production-rate review",
            "T", 4, [(f"{px}-TKO", "FS", 0)], [("HPM", 16), (est, 12)])
        price_pred = f"{px}-CON"
    else:
        price_pred = f"{px}-TKO"
    act(f"{px}-PRC", wbs, f"{label} — pricing assembly & margin review", "T", 4,
        [(price_pred, "FS", 0), (f"{px}-ENG", "FS", 0)], [(est, 24), ("FM", 12)])
    act(f"{px}-GTE", wbs, f"{label} — SVP review gate", "T", 1,
        [(f"{px}-PRC", "FS", 0)], [("RP", 4), ("FM", 4)])
    act(f"{px}-SUB", wbs, f"{label} — SUBMIT BID", "F", 0,
        [(f"{px}-GTE", "FS", 0)], fob=due)


# ==== Active estimates ======================================================
estimate_cycle("VM", "ACT.VM", "VanMeter 161kV + 6mi line", date(2026, 9, 4),
               "SSE", 60, "ES1", kind="EPC")
estimate_cycle("RN", "ACT.RN", "Renaissance 345kV MOD switches", date(2026, 9, 15),
               "SSE", 40, "ES2", kind="EPC")

# ==== Submitted — pending award =============================================
PENDING = [
    ("FMR", "Steuben Frontier Make Ready ($100K CVR)", date(2026, 9, 30)),
    ("JG", "Hoosier Jacksonburg–Gateway ($160K CVR / $3.55M EPC)", date(2026, 11, 16)),
    ("RR", "Hoosier Rosehill–Rockport ($290K CVR / $5.59M EPC)", date(2026, 11, 16)),
    ("LBW", "Lansing BWL Joint Use Audit ($1,350K CVR)", date(2026, 11, 30)),
]
for px, label, exp in PENDING:
    act(f"{px}-FLW", "SUB", f"{label} — award follow-up & clarifications", "T", 3,
        [], [("FM", 8), ("RP", 4)], sne=sub_wd(exp, 10))
    act(f"{px}-AWD", "SUB", f"{label} — award decision (expected)", "M", 0,
        [(f"{px}-FLW", "FS", 0)], sne=exp)

# ==== Templates (parked 2027; copy per new estimate) ========================
estimate_cycle("TE", "TMP.EPC", "[TEMPLATE] EPC-paired estimate", None,
               "SSE", 60, "ES1", kind="EPC", start=date(2027, 12, 1))
estimate_cycle("TN", "TMP.ENG", "[TEMPLATE] engineering-only estimate", None,
               "TLE", 40, "ES2", kind="ENG", start=date(2027, 12, 1))
act("TP-GNG", "TMP.PRG", "[TEMPLATE] program pursuit — qualification & scope", "T", 5,
    [], [("FM", 12), ("RP", 8)], sne=date(2027, 12, 1))
act("TP-EST", "TMP.PRG", "[TEMPLATE] program pursuit — basis of estimate & unit rates", "T", 10,
    [("TP-GNG", "FS", 0)], [("ES3", 60), ("TLE", 24)])
act("TP-PRC", "TMP.PRG", "[TEMPLATE] program pursuit — pricing & terms", "T", 5,
    [("TP-EST", "FS", 0)], [("ES3", 24), ("FM", 12)])
act("TP-SUB", "TMP.PRG", "[TEMPLATE] program pursuit — SUBMIT", "F", 0,
    [("TP-PRC", "FS", 0)])

# ==== Operations & transition ===============================================
act("OP-TRN", "OPS", "Estimating transition into CVR (on Decision 2) — people, tools, files", "T", 45,
    [], [("FM", 80), ("RP", 40), ("SPM", 24)], sne=date(2026, 9, 1))
act("OP-LOG", "OPS", "Load estimating backlog from Excel into this project (intake sheet)", "T", 10,
    [("OP-TRN", "SS", 5)], [("FM", 24), ("SPM", 16)])
act("OP-WKL", "OPS", "Weekly pursuit review cadence (P6-driven, through 2027)", "T", 350,
    [], [("FM", 150), ("RP", 70), ("SPM", 70)], sne=date(2026, 8, 17))

# ------------------------------------------------------- forward-pass dates --
IDX = {a["code"]: a for a in A}
for a in A:
    a["start"] = None
    a["finish"] = None


def compute(a):
    if a["start"] is not None:
        return
    s = next_wd(DD)
    for (p, typ, lag) in a["preds"]:
        pa = IDX[p]
        compute(pa)
        if typ == "FS":
            cand = next_wd(pa["finish"] + timedelta(days=1))
            if lag > 0:
                cand = add_wd(cand, lag)
        elif typ == "SS":
            cand = add_wd(pa["start"], lag + 1) if lag > 0 else pa["start"]
        else:
            cand = pa["finish"]
        s = max(s, cand)
    if a["sne"]:
        s = max(s, next_wd(a["sne"]))
    a["start"] = next_wd(s)
    a["finish"] = a["start"] if a["dur"] == 0 else add_wd(a["start"], a["dur"])


for a in A:
    compute(a)

# -------------------------------------------------------------- write XER ---
def dt(d):
    return d.strftime("%Y-%m-%d") + " 08:00"


def dtf(d):
    return d.strftime("%Y-%m-%d") + " 17:00"


CAL_DATA = ("(0||CalendarData()((0||DaysOfWeek()((0||1()())"
            "(0||2()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||3()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||4()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||5()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||6()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||7()()))))(0||Exceptions()()))")

PROJ_ID, CAL_ID = 1001, 100
rows = []
rows.append("ERMHDR\t15.2\t" + DD.strftime("%Y-%m-%d") +
            "\tProject\tadmin\tadmin\tdbxDatabaseNoName\tProject Management\tUSD")
rows.append("%T\tCURRTYPE")
rows.append("%F\tcurr_id\tdecimal_digit_cnt\tcurr_symbol\tdecimal_symbol"
            "\tdigit_group_symbol\tpos_curr_fmt_type\tneg_curr_fmt_type"
            "\tcurr_type\tcurr_short_name\tgroup_digit_cnt\tbase_exch_rate")
rows.append("%R\t1\t2\t$\t.\t,\t#1.1\t(#1.1)\tUS Dollar\tUSD\t3\t1")

rows.append("%T\tCALENDAR")
rows.append("%F\tclndr_id\tdefault_flag\tclndr_name\tproj_id\tbase_clndr_id"
            "\tlast_chng_date\tclndr_type\tday_hr_cnt\tweek_hr_cnt"
            "\tmonth_hr_cnt\tyear_hr_cnt\trsrc_private\tclndr_data")
rows.append(f"%R\t{CAL_ID}\tY\tCVR Standard 5x8\t\t\t\tCA_Base\t8\t40\t172\t2000\tN\t{CAL_DATA}")

rows.append("%T\tPROJECT")
rows.append("%F\tproj_id\tfy_start_month_num\trsrc_self_add_flag\tallow_complete_flag"
            "\trsrc_multi_assign_flag\tcheckout_flag\tproject_flag\tstep_complete_flag"
            "\tcost_qty_recalc_flag\tbatch_sum_flag\tname_sep_char\tdef_complete_pct_type"
            "\tproj_short_name\tclndr_id\ttask_code_base\ttask_code_step\tpriority_num"
            "\twbs_max_sum_level\tstrgy_priority_num\tlast_checksum\tcritical_drtn_hr_cnt"
            "\tdef_cost_per_qty\tlast_recalc_date\tplan_start_date\tscd_end_date"
            "\tadd_date\tplan_end_date\tdef_duration_type\ttask_code_prefix\tguid"
            "\tdef_qty_type\tadd_by_name\tdef_rate_type\tadd_act_remain_flag"
            "\tact_this_per_link_flag\tdef_task_type\tact_pct_link_flag\tcritical_path_type"
            "\ttask_code_prefix_flag\tdef_rollup_dates_flag\tuse_project_baseline_flag"
            "\trem_target_link_flag\treset_planned_flag\tallow_neg_act_flag\tsum_assign_level"
            "\texport_flag")
pstart = min(x["start"] for x in A)
pend = max(x["finish"] for x in A)
rows.append("%R\t" + "\t".join(str(v) for v in [
    PROJ_ID, 1, "Y", "Y", "Y", "N", "Y", "N", "N", "N", ".", "CP_Drtn",
    "CVR-PURSUITS", CAL_ID, 1000, 10, 500, 2, 500, "", 0, 100,
    dt(DD), dt(pstart), dtf(pend), dt(DD), dtf(pend), "DT_FixedDrtn",
    "P", "", "QT_Hour", "admin", "COST_PER_QTY", "N", "N", "TT_Task", "N",
    "CT_TotFloat", "Y", "Y", "N", "Y", "N", "N", "SL_Taskrsrc", "Y"]))

rows.append("%T\tSCHEDOPTIONS")
rows.append("%F\tschedoptions_id\tproj_id\tsched_outer_depend_type"
            "\tsched_open_critical_flag\tsched_lag_early_start_flag"
            "\tsched_retained_logic\tsched_setplantoforecast\tsched_float_type"
            "\tsched_calendar_on_relationship_lag\tsched_use_expect_end_flag"
            "\tsched_progress_override")
rows.append(f"%R\t1\t{PROJ_ID}\tSD_Both\tN\tN\tY\tN\tFT_TotalFloat\tCCal_Task\tY\tN")

rows.append("%T\tPROJWBS")
rows.append("%F\twbs_id\tproj_id\tobs_id\tseq_num\tproj_node_flag\tsum_data_flag"
            "\tstatus_code\twbs_short_name\twbs_name\tparent_wbs_id"
            "\tev_user_pct\tev_etc_user_value\tev_compute_type\tev_etc_compute_type")
wbs_id = {}
for i, (short, name, parent) in enumerate(WBS, start=3000):
    wbs_id[short] = i
for short, name, parent in WBS:
    rows.append("%R\t" + "\t".join(str(v) for v in [
        wbs_id[short], PROJ_ID, "", (wbs_id[short] - 3000 + 1) * 10,
        "Y" if parent is None else "N", "Y", "WS_Open",
        ("CVR-PURSUITS" if parent is None else short), name,
        wbs_id[parent] if parent else "",
        6, 0.16, "EC_Cmp_pct", "EE_Rem_hr"]))

rows.append("%T\tRSRC")
rows.append("%F\trsrc_id\tparent_rsrc_id\tclndr_id\trsrc_seq_num\trsrc_name\trsrc_short_name"
            "\tdef_qty_per_hr\tcost_qty_type\tactive_flag\tauto_compute_act_flag"
            "\tdef_cost_qty_link_flag\tot_flag\tcurr_id\trsrc_type")
for rid, short, name in RSRC:
    rows.append("%R\t" + "\t".join(str(v) for v in [
        rid, "", CAL_ID, rid * 10, name, short, 1, "QT_Hour", "Y", "Y", "Y", "N",
        1, "RT_Labor"]))

rows.append("%T\tTASK")
rows.append("%F\ttask_id\tproj_id\twbs_id\tclndr_id\tphys_complete_pct"
            "\tcomplete_pct_type\ttask_type\tduration_type\tstatus_code"
            "\ttask_code\ttask_name\ttotal_float_hr_cnt\tfree_float_hr_cnt"
            "\tremain_drtn_hr_cnt\tact_work_qty\tremain_work_qty\ttarget_work_qty"
            "\ttarget_drtn_hr_cnt\ttarget_equip_qty\tact_equip_qty\tremain_equip_qty"
            "\tcstr_date\tact_start_date\tact_end_date\tlate_start_date\tlate_end_date"
            "\texpect_end_date\tearly_start_date\tearly_end_date\trestart_date\treend_date"
            "\ttarget_start_date\ttarget_end_date\trem_late_start_date\trem_late_end_date"
            "\tcstr_type\tpriority_type\tsuspend_date\tresume_date\tfloat_path"
            "\tfloat_path_order\tcstr_date2\tcstr_type2\tdriving_path_flag"
            "\tcreate_date\tupdate_date\tauto_compute_act_flag\trev_fdbk_flag\tlock_plan_flag")
task_id = {}
for i, a in enumerate(A, start=20000):
    task_id[a["code"]] = i
TT = {"T": "TT_Task", "M": "TT_Mile", "F": "TT_FinMile"}
for a in A:
    hrs = a["dur"] * 8
    if a["fob"]:
        cstr_type, cstr_date = "CS_MEOB", dtf(a["fob"])
    elif a["sne"]:
        cstr_type, cstr_date = "CS_MEO", dt(next_wd(a["sne"]))
    else:
        cstr_type, cstr_date = "", ""
    rows.append("%R\t" + "\t".join(str(v) for v in [
        task_id[a["code"]], PROJ_ID, wbs_id[a["wbs"]], CAL_ID, 0,
        "CP_Drtn", TT[a["typ"]], "DT_FixedDrtn", "TK_NotStart",
        a["code"], a["name"], 0, 0,
        hrs, 0, hrs, hrs,
        hrs, 0, 0, 0,
        cstr_date, "", "",
        dt(a["start"]), dtf(a["finish"]),
        "", dt(a["start"]), dtf(a["finish"]), "", "",
        dt(a["start"]), dtf(a["finish"]), dt(a["start"]), dtf(a["finish"]),
        cstr_type, "PT_Normal", "", "", "",
        "", "", "", "N",
        dt(DD), dt(DD), "Y", "N", "N"]))

rows.append("%T\tTASKPRED")
rows.append("%F\ttask_pred_id\ttask_id\tpred_task_id\tproj_id\tpred_proj_id"
            "\tpred_type\tlag_hr_cnt\tfloat_path\taref\tarls")
pid = 60000
PT = {"FS": "PR_FS", "SS": "PR_SS", "FF": "PR_FF"}
for a in A:
    for (p, typ, lag) in a["preds"]:
        rows.append("%R\t" + "\t".join(str(v) for v in [
            pid, task_id[a["code"]], task_id[p], PROJ_ID, PROJ_ID,
            PT[typ], lag * 8, "", "", ""]))
        pid += 1

rows.append("%T\tTASKRSRC")
rows.append("%F\ttaskrsrc_id\ttask_id\tproj_id\tcost_qty_link_flag\trsrc_id\tacct_id"
            "\tremain_qty\ttarget_qty\tremain_qty_per_hr\ttarget_qty_per_hr"
            "\tcost_per_qty\ttarget_cost\tremain_cost\tact_reg_qty\tact_ot_qty"
            "\tact_reg_cost\tact_ot_cost\tact_this_per_cost\tact_this_per_qty"
            "\tact_start_date\tact_end_date\trestart_date\treend_date"
            "\trem_late_start_date\trem_late_end_date\ttarget_lag_drtn_hr_cnt"
            "\ttarget_start_date\ttarget_end_date\trsrc_type\trate_type")
tr = 95000
for a in A:
    dur_h = max(a["dur"] * 8, 8)
    for (short, hours) in a["res"]:
        per_hr = round(hours / dur_h, 4)
        rows.append("%R\t" + "\t".join(str(v) for v in [
            tr, task_id[a["code"]], PROJ_ID, "Y", RS[short], "",
            hours, hours, per_hr, per_hr, 0, 0, 0, 0, 0,
            0, 0, 0, 0,
            "", "", "", "",
            dt(a["start"]), dtf(a["finish"]), 0,
            dt(a["start"]), dtf(a["finish"]), "RT_Labor", "COST_PER_QTY"]))
        tr += 1
rows.append("%E")

import os
os.makedirs("model", exist_ok=True)
with open("model/CVR_Pursuits_Schedule.xer", "w", newline="\r\n") as f:
    f.write("\n".join(rows))
print(f"wrote model/CVR_Pursuits_Schedule.xer  ({len(A)} activities, "
      f"{pid-60000} relationships, {tr-95000} assignments)")

# ---------------------------------------------------------------- register ---
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

NAVY = "1F3864"
FH = Font(bold=True, color="FFFFFF")
FILL = PatternFill("solid", fgColor=NAVY)
FS_ = Font(bold=True, color=NAVY)
FN = Font(italic=True, size=9, color="595959")
FIN = Font(color="0070C0")
THIN = Side(style="thin", color="BFBFBF")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

wb = Workbook()


def head(ws, row, labels, widths=None):
    for c, lab in enumerate(labels, 1):
        cell = ws.cell(row=row, column=c, value=lab)
        cell.font = FH
        cell.fill = FILL
        cell.alignment = Alignment(horizontal="center", wrap_text=True)
    if widths:
        for c, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(c)].width = w


ws = wb.active
ws.title = "READ ME"
ws["A1"] = "CVR-PURSUITS — estimating pipeline framework"
ws["A1"].font = Font(bold=True, size=14, color=NAVY)
notes = [
    "",
    "WHAT THIS IS",
    "  A separate P6 project for the pursuit/estimating pipeline, sharing the CVR-MASTER resource pool.",
    "  Pursuits churn weekly — keeping them out of CVR-MASTER protects the execution baseline while the",
    "  shared pool shows the bid-vs-billable resource contention in one histogram.",
    "",
    "IMPORT ORDER",
    "  1. Import CVR_Master_Schedule.xer first (creates the shared resources).",
    "  2. Import CVR_Pursuits_Schedule.xer; when prompted on resources, choose 'Keep existing' / match",
    "     by resource name so both projects load against the same pool.",
    "  3. Schedule both (F9) at data date 12-Aug-26.",
    "",
    "LOADING THE ESTIMATING BACKLOG (their Excel)",
    "  Paste the estimating spreadsheet into the 'Intake Sheet' tab (one row per estimate), then in P6",
    "  copy the matching TEMPLATE WBS (EPC-paired / engineering-only / program) once per row, rename the",
    "  activities with the pursuit name, set the SUBMIT milestone's finish-on-or-before constraint to the",
    "  bid due date, and assign the estimator. Or send the filled sheet back and the generator rebuilds",
    "  the XER with every pursuit included.",
    "",
    "ESTIMATE TEMPLATE (CVR-PROC-001 front end)",
    "  bid/no-bid gate -> engineering basis (~60% definition) -> takeoffs & material pricing ->",
    "  HWC constructability & production-rate review (EPC only) -> pricing & margin review ->",
    "  SVP gate -> SUBMIT (constrained to due date).",
    "",
    "PLACEHOLDERS TO REPLACE ON TRANSITION",
    "  ES1–ES3 estimator resources (name them), Frank Miller confirmed as FM, estimate hour budgets",
    "  (currently planning-level), award-decision dates on the four submitted bids.",
]
for i, t_ in enumerate(notes, start=3):
    c = ws.cell(row=i, column=1, value=t_)
    if t_ in ("WHAT THIS IS", "IMPORT ORDER", "LOADING THE ESTIMATING BACKLOG (their Excel)",
              "ESTIMATE TEMPLATE (CVR-PROC-001 front end)", "PLACEHOLDERS TO REPLACE ON TRANSITION"):
        c.font = FS_
ws.column_dimensions["A"].width = 108

# activities
ws = wb.create_sheet("Activities")
head(ws, 1, ["Code", "WBS", "Activity", "Type", "Dur (wd)", "Start", "Finish",
             "Predecessors", "Resources (hours)", "Constraint"],
     [10, 9, 56, 8, 8, 10, 10, 22, 30, 16])
for r, a in enumerate(A, start=2):
    ws.cell(row=r, column=1, value=a["code"]).border = BOX
    ws.cell(row=r, column=2, value=a["wbs"]).border = BOX
    ws.cell(row=r, column=3, value=a["name"]).border = BOX
    ws.cell(row=r, column=4, value={"T": "Task", "M": "Milestone", "F": "Finish MS"}[a["typ"]]).border = BOX
    ws.cell(row=r, column=5, value=a["dur"]).border = BOX
    ws.cell(row=r, column=6, value=a["start"].strftime("%m/%d/%y")).border = BOX
    ws.cell(row=r, column=7, value=a["finish"].strftime("%m/%d/%y")).border = BOX
    ws.cell(row=r, column=8, value="; ".join(f"{p} {t_}{'+'+str(l)+'d' if l else ''}" for p, t_, l in a["preds"])).border = BOX
    ws.cell(row=r, column=9, value="; ".join(f"{s} {h}h" for s, h in a["res"])).border = BOX
    con = f"finish ≤ {a['fob'].strftime('%m/%d/%y')}" if a["fob"] else (
        f"start ≥ {a['sne'].strftime('%m/%d/%y')}" if a["sne"] else "")
    ws.cell(row=r, column=10, value=con).border = BOX
ws.freeze_panes = "A2"

# intake sheet for the estimating Excel
ws = wb.create_sheet("Intake Sheet")
head(ws, 1, ["Pursuit / estimate name", "Customer", "Type (EPC / ENG / PROG)",
             "Bid due date", "Est. contract value ($K)", "CVR scope ($K)",
             "Estimator", "Engineering support (name)", "Eng hours", "Est hours",
             "Status (active / hold / submitted)", "Notes"],
     [34, 22, 14, 12, 14, 12, 14, 24, 9, 9, 16, 30])
ws.cell(row=2, column=1, value="⟵ paste the estimating backlog here, one row per estimate").font = FIN
for r in range(2, 42):
    for c in range(1, 13):
        ws.cell(row=r, column=c).border = BOX
ws.cell(row=44, column=1,
        value="Types map to the P6 templates: EPC = EPC-paired (with HWC constructability review) · "
              "ENG = engineering-only · PROG = program/audit. Send this sheet back filled and the "
              "generator rebuilds the XER with every row as a scheduled pursuit.").font = FN
ws.freeze_panes = "A2"

# resource pool
ws = wb.create_sheet("Resource Pool")
head(ws, 1, ["ID", "Short", "Resource", "Shared with CVR-MASTER?"], [6, 8, 44, 22])
for r, (rid, short, name) in enumerate(RSRC, start=2):
    ws.cell(row=r, column=1, value=rid).border = BOX
    ws.cell(row=r, column=2, value=short).border = BOX
    ws.cell(row=r, column=3, value=name).border = BOX
    ws.cell(row=r, column=4, value="shared" if rid <= 17 else "NEW — estimating").border = BOX
ws.cell(row=len(RSRC) + 3, column=1,
        value="Import CVR-MASTER first; match resources by name on this import so both projects "
              "load one pool and the combined histogram shows bid-vs-billable contention.").font = FN

wb.save("model/CVR_Pursuits_Register.xlsx")
print("wrote model/CVR_Pursuits_Register.xlsx")

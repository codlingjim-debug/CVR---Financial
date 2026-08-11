#!/usr/bin/env python3
"""Build the CVR master schedule: a P6-importable XER + an Excel register.

Covers all CVR work as of the 7/25/26 KPI package: CenterPoint direct
engineering (017 jobs), DTE (New Baltimore, Catalina, Renaissance re-bid),
Consumers (HVD sensors, 2026 Pole Replacement EPC), MEC EPC support with HWC
(Sub P GSU, Enterprise Way, VanMeter bid), Cloverland closeout, the pending
pipeline, and program governance. Resource-loaded on the CVR roster (plus the
Senior PM starting 8/24 and the open T-line/substation/structural reqs),
with engineer-verified procurement chains (IFC -> transmittal -> PO -> lead
time -> delivery) per CVR-PROC-001.

Outputs:
  model/CVR_Master_Schedule.xer            (import into P6: File > Import > XER)
  model/CVR_Master_Schedule_Register.xlsx  (activity/logic/resource/long-lead register)
"""
from datetime import date, timedelta

DD = date(2026, 8, 12)  # data date


# ---------------------------------------------------------------- workdays --
def is_wd(d):
    return d.weekday() < 5


def next_wd(d):
    while not is_wd(d):
        d += timedelta(days=1)
    return d


def add_wd(d, n):
    """Start date d counts as day 1 of n workdays; returns finish date."""
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


# ---------------------------------------------------------------- resources --
# id, short, name
RSRC = [
    (1, "RP", "Roy Pierce — Principal Engineer"),
    (2, "HW", "Hayley Worthen — Senior Engineer"),
    (3, "RD", "Randy Pynenberg — Engineer IV"),
    (4, "BP", "Bhkti Patel — Engineer III"),
    (5, "FW", "Francis Wagner — Engineer III"),
    (6, "TN", "Taylor Nelson — Engineer II"),
    (7, "CP", "Craig Peterson — Engineer I"),
    (8, "KM", "Kevin Metts — Designer II"),
    (9, "CA", "Collin Allen — Graphics Technician"),
    (10, "AH", "Auston Hopson — Graphics Technician"),
    (11, "SPM", "Senior PM (starts 8/24)"),
    (12, "TLE", "T-Line Engineer (open req)"),
    (13, "SSE", "Substation Engineer (open req)"),
    (14, "STE", "Structural Engineer (open req)"),
    (15, "EST", "CVR Estimating (per CVR-PROC-001)"),
    (16, "PLS", "PLS Procurement"),
    (17, "HPM", "HWC Construction PM (coordination)"),
]
RS = {s: i for i, s, _ in RSRC}

# ---------------------------------------------------------------- WBS tree --
# short, name, parent_short (None = project node)
WBS = [
    ("CVR", "CVR Master Program", None),
    ("CPE", "CenterPoint Energy — Direct Engineering", "CVR"),
    ("CPE.GW", "017-0003 Gateway 69kV", "CPE"),
    ("CPE.RK", "017-0004 Rockport 69kV", "CPE"),
    ("CPE.AM", "017-0005 Angel Mounds 69kV", "CPE"),
    ("CPE.NW", "017-0006 Northwest 69kV Cap Banks", "CPE"),
    ("CPE.LR", "017-0007 Leonard Rd 69kV Cap Banks", "CPE"),
    ("DTE", "DTE Energy", "CVR"),
    ("DTE.NB", "001-0003 New Baltimore Conversion (39-WO pilot)", "DTE"),
    ("DTE.CT", "001-0001 Catalina Ph 3 — Support Tail", "DTE"),
    ("DTE.RN", "Renaissance 345kV — 6 MOD Switches (bid)", "DTE"),
    ("CON", "Consumers Energy", "CVR"),
    ("CON.HVD", "005-0004 2026 HVD Line Sensors", "CON"),
    ("CON.PR", "2026 Pole Replacements — EPC w/ HWC (WON)", "CON"),
    ("MEC", "MEC — EPC Support with HWC", "CVR"),
    ("MEC.SP", "24000168 Sub P GSU & Substation", "MEC"),
    ("MEC.EW", "24000170 Enterprise Way South", "MEC"),
    ("MEC.VM", "VanMeter 161kV Substation + 6mi Line (bid)", "MEC"),
    ("CLV", "016-0001 Cloverland — Manistique Closeout", "CVR"),
    ("PIPE", "Pending Pipeline (contingent on award)", "CVR"),
    ("GOV", "Program Governance & Operating Rhythm", "CVR"),
]

# ------------------------------------------------------------- lead times ---
# equipment: (label, lead weeks)
LEADS = {
    "MOD345": ("345kV MOD switches (6)", 40),
    "XFMR161": ("161kV power transformer", 60),
    "BRKR": ("HV breakers (69–161kV)", 38),
    "CAPBANK": ("69kV capacitor banks", 30),
    "RELAY": ("relay & control panels", 26),
    "STEEL": ("substation steel structures", 24),
    "POLES": ("distribution/transmission poles", 16),
    "COND": ("conductor / OPGW / hardware", 16),
    "SENSOR": ("HVD line sensors (BOM)", 12),
}
PO_CYCLE_WD = 15      # transmittal review + PO placement, workdays
TRANSMITTAL_WD = 5    # EOR transmittal preparation, workdays

# ---------------------------------------------------------------- activities -
# (code, wbs, name, type, dur_wd, preds, resources, start_no_earlier)
#   type: T=task, M=milestone, F=finish milestone
#   preds: list of (code, "FS"/"SS"/"FF", lag_wd)
#   resources: list of (short, hours)
A = []


def act(code, wbs, name, typ="T", dur=5, preds=(), res=(), sne=None):
    A.append(dict(code=code, wbs=wbs, name=name, typ=typ, dur=dur,
                  preds=list(preds), res=list(res), sne=sne))


def proc_chain(prefix, wbs, ifc_pred, lead_key, need_sne, res_eng="SSE",
               support=True):
    """IFC -> transmittal -> PO -> fabrication lead -> delivery milestone."""
    label, wks = LEADS[lead_key]
    act(f"{prefix}-TRN", wbs, f"EOR transmittal to PLS — {label}", "T",
        TRANSMITTAL_WD, [(ifc_pred, "FS", 0)], [(res_eng, 16), ("PLS", 8)])
    act(f"{prefix}-PO", wbs, f"PO placed — {label}", "T", PO_CYCLE_WD,
        [(f"{prefix}-TRN", "FS", 0)], [("PLS", 24)])
    act(f"{prefix}-FAB", wbs, f"Fabrication & lead time — {label} ({wks} wks)",
        "T", wks * 5, [(f"{prefix}-PO", "FS", 0)], [("PLS", 8)])
    act(f"{prefix}-DLV", wbs, f"Delivery on site — {label}", "M", 0,
        [(f"{prefix}-FAB", "FS", 0)], [], sne=need_sne)


# ==== CenterPoint direct (017) ==============================================
act("GW-CLO", "CPE.GW", "Gateway 69kV — final billing & record prints", "T", 15,
    [], [("BP", 40), ("CA", 24)])
act("GW-FIN", "CPE.GW", "Gateway 69kV complete", "F", 0, [("GW-CLO", "FS", 0)])
act("RK-CLO", "CPE.RK", "Rockport 69kV — closeout & record prints", "T", 15,
    [], [("BP", 24), ("CA", 16)])
act("RK-FIN", "CPE.RK", "Rockport 69kV complete", "F", 0, [("RK-CLO", "FS", 0)])
act("AM-CLO", "CPE.AM", "Angel Mounds — record prints & closeout", "T", 20,
    [], [("TN", 24), ("CA", 16)])
act("AM-FIN", "CPE.AM", "Angel Mounds complete", "F", 0, [("AM-CLO", "FS", 0)])

# Northwest cap banks — 24% complete, finish 8/6/27
act("NW-60", "CPE.NW", "Northwest — 60% design (cap banks + protection)", "T", 45,
    [], [("BP", 220), ("KM", 160), ("CA", 60)])
act("NW-90", "CPE.NW", "Northwest — 90% design & CenterPoint review", "T", 40,
    [("NW-60", "FS", 0)], [("BP", 160), ("KM", 120)])
act("NW-IFC", "CPE.NW", "Northwest — IFC issued (engineering complete)", "M", 0,
    [("NW-90", "FS", 10)])
proc_chain("NW-CB", "CPE.NW", "NW-IFC", "CAPBANK",
           date(2027, 5, 3), res_eng="BP")
act("NW-SUP", "CPE.NW", "Northwest — construction support & energization", "T", 60,
    [("NW-CB-DLV", "FS", 0)], [("BP", 80), ("SPM", 60)])
act("NW-FIN", "CPE.NW", "Northwest 69kV complete", "F", 0, [("NW-SUP", "FS", 0)])

# Leonard Rd — 25% complete, finish 10/28/27
act("LR-60", "CPE.LR", "Leonard Rd — 60% design (2 cap banks + breaker-and-a-half)", "T", 50,
    [], [("FW", 240), ("KM", 160), ("CA", 60)])
act("LR-90", "CPE.LR", "Leonard Rd — 90% design & CenterPoint review", "T", 40,
    [("LR-60", "FS", 0)], [("FW", 160), ("KM", 120)])
act("LR-IFC", "CPE.LR", "Leonard Rd — IFC issued (engineering complete)", "M", 0,
    [("LR-90", "FS", 10)])
proc_chain("LR-CB", "CPE.LR", "LR-IFC", "CAPBANK",
           date(2027, 7, 6), res_eng="FW")
act("LR-SUP", "CPE.LR", "Leonard Rd — construction support & energization", "T", 60,
    [("LR-CB-DLV", "FS", 0)], [("FW", 80), ("SPM", 60)])
act("LR-FIN", "CPE.LR", "Leonard Rd 69kV complete", "F", 0, [("LR-SUP", "FS", 0)])

# ==== DTE ===================================================================
# New Baltimore — 64% complete; 39-WO program; spring 2027 construction start
act("NB-PIL", "DTE.NB", "CVR-PROC-001 pilot kickoff (one schedule, one cost picture)", "T", 10,
    [], [("SPM", 40), ("RP", 16), ("HPM", 16)])
act("NB-WO1", "DTE.NB", "WO packages — batch 1 (12 WOs) engineering complete", "T", 55,
    [("NB-PIL", "SS", 5)], [("HW", 300), ("KM", 200), ("CA", 120)])
act("NB-WO2", "DTE.NB", "WO packages — batch 2 (14 WOs) engineering complete", "T", 55,
    [("NB-WO1", "FS", 0)], [("HW", 300), ("KM", 200), ("CA", 120)])
act("NB-WO3", "DTE.NB", "WO packages — batch 3 (13 WOs) engineering complete", "T", 50,
    [("NB-WO2", "FS", 0)], [("HW", 260), ("KM", 180), ("CA", 100)])
act("NB-IFC", "DTE.NB", "New Baltimore — all 39 WOs IFC (engineering complete)", "M", 0,
    [("NB-WO3", "FS", 0)])
# rolling material release: transmittals begin off batch-1 IFC, not all 39 WOs
proc_chain("NB-PL", "DTE.NB", "NB-WO1", "POLES", date(2027, 3, 15), res_eng="HW")
proc_chain("NB-CD", "DTE.NB", "NB-WO1", "COND", date(2027, 3, 15), res_eng="HW")
act("NB-SRP", "DTE.NB", "Material surplus triage & BOM-vs-actual reconciliation", "T", 30,
    [("NB-PIL", "SS", 0)], [("HW", 60), ("PLS", 60), ("EST", 40)])
act("NB-OBK", "DTE.NB", "DTE open-book response & cost-per-mile benchmark", "T", 25,
    [("NB-SRP", "SS", 10)], [("SPM", 60), ("EST", 60), ("RP", 20)])
act("NB-CON", "DTE.NB", "Spring 2027 construction start (HWC)", "M", 0,
    [("NB-PL-DLV", "FS", 0), ("NB-CD-DLV", "FS", 0)], sne=date(2027, 4, 1))
act("NB-SUP", "DTE.NB", "Construction support — 2027 season", "T", 175,
    [("NB-CON", "FS", 0)], [("HW", 300), ("SPM", 350), ("KM", 120)])
act("NB-FIN", "DTE.NB", "New Baltimore complete", "F", 0, [("NB-SUP", "FS", 0)])

act("CT-SUP", "DTE.CT", "Catalina Ph 3 — construction support tail", "T", 95,
    [], [("HW", 120)])
act("CT-FIN", "DTE.CT", "Catalina Ph 3 complete", "F", 0, [("CT-SUP", "FS", 0)])

# Renaissance — bid 9/15, assume award Nov-26, outage fall 2027
act("RN-BID", "DTE.RN", "Renaissance 345kV — bid preparation & submittal", "T", 24,
    [], [("RP", 60), ("EST", 80), ("SSE", 40)])
act("RN-AWD", "DTE.RN", "Award (assumed)", "M", 0, [("RN-BID", "FS", 0)],
    sne=date(2026, 11, 2))
act("RN-DSN", "DTE.RN", "MOD switch replacement design — 60/90/IFC", "T", 65,
    [("RN-AWD", "FS", 0)], [("SSE", 320), ("KM", 160), ("RP", 40)])
act("RN-IFC", "DTE.RN", "Renaissance — IFC issued (engineering complete)", "M", 0,
    [("RN-DSN", "FS", 0)])
proc_chain("RN-MS", "DTE.RN", "RN-IFC", "MOD345", date(2027, 9, 1))
act("RN-OUT", "DTE.RN", "Fall 2027 outage — switch replacement support", "T", 45,
    [("RN-MS-DLV", "FS", 0)], [("SSE", 120), ("SPM", 80)], sne=date(2027, 10, 1))
act("RN-FIN", "DTE.RN", "Renaissance complete", "F", 0, [("RN-OUT", "FS", 0)])

# ==== Consumers =============================================================
act("HV-DEV", "CON.HVD", "HVD sensors — record prints & BOM closeout", "T", 55,
    [], [("CP", 160), ("CA", 60)])
act("HV-FIN", "CON.HVD", "HVD Line Sensors complete", "F", 0, [("HV-DEV", "FS", 0)])

act("PR-KO", "CON.PR", "Pole program kickoff with HWC (EPC-paired)", "T", 5,
    [], [("SPM", 24), ("RP", 8), ("HPM", 16)], sne=date(2026, 9, 8))
act("PR-DSN", "CON.PR", "Design packages — 168 poles (staking, framing, guying)", "T", 70,
    [("PR-KO", "FS", 0)], [("TLE", 400), ("CP", 300), ("KM", 200), ("CA", 100)])
act("PR-IFC", "CON.PR", "Pole program — IFC issued (engineering complete)", "M", 0,
    [("PR-DSN", "FS", 0)])
proc_chain("PR-PL", "CON.PR", "PR-IFC", "POLES", date(2027, 3, 1), res_eng="TLE")
act("PR-CON", "CON.PR", "HWC construction — 2027 season", "M", 0,
    [("PR-PL-DLV", "FS", 0)], sne=date(2027, 3, 1))
act("PR-SUP", "CON.PR", "Construction support & closeout documentation", "T", 180,
    [("PR-CON", "FS", 0)], [("TLE", 200), ("CP", 160), ("SPM", 200)])
act("PR-FIN", "CON.PR", "Pole Replacement program complete", "F", 0,
    [("PR-SUP", "FS", 0)])

# ==== MEC EPC support =======================================================
act("SP-IFC2", "MEC.SP", "Sub P — Phase 2 IFC comments & final issue", "T", 20,
    [], [("SSE", 80), ("KM", 40)])
act("SP-SUP", "MEC.SP", "Sub P — construction & energization support", "T", 55,
    [("SP-IFC2", "SS", 0)], [("SSE", 100), ("RD", 40)])
act("SP-FIN", "MEC.SP", "Sub P GSU complete", "F", 0, [("SP-SUP", "FS", 0)])
act("EW-ASB", "MEC.EW", "Enterprise Way — as-builts & punch list", "T", 30,
    [], [("RD", 60), ("CA", 30)])
act("EW-FIN", "MEC.EW", "Enterprise Way complete", "F", 0, [("EW-ASB", "FS", 0)])

# VanMeter — bid 9/4; assume award Oct-26; construction summer 2027+
act("VM-BID", "MEC.VM", "VanMeter — bid preparation & submittal (with HWC)", "T", 17,
    [], [("RP", 60), ("EST", 100), ("SSE", 60), ("TLE", 40)])
act("VM-AWD", "MEC.VM", "Award (assumed)", "M", 0, [("VM-BID", "FS", 0)],
    sne=date(2026, 10, 15))
act("VM-30", "MEC.VM", "VanMeter — 30% design (substation + 6mi 161kV line)", "T", 45,
    [("VM-AWD", "FS", 0)], [("SSE", 240), ("TLE", 240), ("KM", 120), ("STE", 80)])
act("VM-60", "MEC.VM", "VanMeter — 60% design", "T", 45,
    [("VM-30", "FS", 0)], [("SSE", 240), ("TLE", 240), ("KM", 160), ("STE", 120)])
act("VM-90", "MEC.VM", "VanMeter — 90% design & MEC review", "T", 40,
    [("VM-60", "FS", 0)], [("SSE", 200), ("TLE", 200), ("KM", 120)])
act("VM-IFC", "MEC.VM", "VanMeter — IFC issued (engineering complete)", "M", 0,
    [("VM-90", "FS", 10)])
# long-lead: transformer + breakers off 60%; steel + relays off IFC
act("VM-XF-TRN", "MEC.VM", "EOR transmittal — 161kV transformer (early release at 60%)",
    "T", TRANSMITTAL_WD, [("VM-60", "FS", 0)], [("SSE", 16), ("PLS", 8)])
act("VM-XF-PO", "MEC.VM", "PO placed — 161kV transformer", "T", PO_CYCLE_WD,
    [("VM-XF-TRN", "FS", 0)], [("PLS", 24)])
act("VM-XF-FAB", "MEC.VM", "Fabrication & lead — 161kV transformer (60 wks)", "T", 300,
    [("VM-XF-PO", "FS", 0)], [("PLS", 8)])
act("VM-XF-DLV", "MEC.VM", "Delivery on site — 161kV transformer", "M", 0,
    [("VM-XF-FAB", "FS", 0)], sne=date(2028, 3, 1))
act("VM-BK-TRN", "MEC.VM", "EOR transmittal — HV breakers (early release at 60%)",
    "T", TRANSMITTAL_WD, [("VM-60", "FS", 0)], [("SSE", 12), ("PLS", 8)])
act("VM-BK-PO", "MEC.VM", "PO placed — HV breakers", "T", PO_CYCLE_WD,
    [("VM-BK-TRN", "FS", 0)], [("PLS", 16)])
act("VM-BK-FAB", "MEC.VM", "Fabrication & lead — HV breakers (38 wks)", "T", 190,
    [("VM-BK-PO", "FS", 0)], [("PLS", 8)])
act("VM-BK-DLV", "MEC.VM", "Delivery on site — HV breakers", "M", 0,
    [("VM-BK-FAB", "FS", 0)])
proc_chain("VM-ST", "MEC.VM", "VM-IFC", "STEEL", date(2027, 10, 1))
proc_chain("VM-RL", "MEC.VM", "VM-IFC", "RELAY", date(2027, 12, 1))
act("VM-CON", "MEC.VM", "HWC construction start (site/civil)", "M", 0,
    [("VM-IFC", "FS", 0)], sne=date(2027, 6, 1))
act("VM-SUP", "MEC.VM", "Construction support through energization", "T", 250,
    [("VM-CON", "FS", 0)], [("SSE", 300), ("TLE", 200), ("SPM", 300)])
act("VM-FIN", "MEC.VM", "VanMeter complete", "F", 0,
    [("VM-SUP", "FS", 0), ("VM-XF-DLV", "FS", 0)])

# ==== Cloverland ============================================================
act("CL-CLO", "CLV", "Manistique — record prints & final closeout", "T", 30,
    [], [("TN", 60), ("CA", 24)])
act("CL-FIN", "CLV", "Manistique complete", "F", 0, [("CL-CLO", "FS", 0)])

# ==== Pending pipeline (contingent) =========================================
act("PP-LBW", "PIPE", "Lansing BWL Joint Use Audit — execution (on award, assumed Q4-26)",
    "T", 260, [], [("TLE", 800), ("CP", 600), ("AH", 400)], sne=date(2026, 11, 16))
act("PP-JG", "PIPE", "Hoosier Jacksonburg–Gateway — engineering (on award)",
    "T", 120, [], [("TLE", 300), ("KM", 160)], sne=date(2026, 12, 1))
act("PP-RR", "PIPE", "Hoosier Rosehill–Rockport — engineering (on award)",
    "T", 140, [], [("TLE", 360), ("KM", 200)], sne=date(2027, 1, 4))
act("PP-FMR", "PIPE", "Steuben Frontier Make Ready — 10 packages (on award)",
    "T", 90, [], [("CP", 300), ("AH", 200)], sne=date(2026, 10, 1))

# ==== Governance ============================================================
act("GV-QAQ", "GOV", "Stand up design QA/QC review gates", "T", 15,
    [], [("RP", 40), ("HW", 24)], sne=date(2026, 8, 17))
act("GV-EST", "GOV", "Estimating transition into CVR (on Decision 2)", "T", 45,
    [], [("RP", 60), ("EST", 120), ("SPM", 40)], sne=date(2026, 9, 1))
act("GV-P6", "GOV", "P6 master schedule live — baseline set, weekly update cadence",
    "T", 10, [], [("SPM", 60)], sne=date(2026, 8, 24))
act("GV-MO", "GOV", "Monthly close / KPI / forecast cadence (through 2027)", "T", 355,
    [], [("SPM", 200), ("RP", 100)], sne=date(2026, 8, 17))


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
            cand = add_wd(pa["finish"] + timedelta(days=1), max(lag, 0) or 1) \
                if lag > 0 else next_wd(pa["finish"] + timedelta(days=1))
            if lag > 0:
                cand = add_wd(next_wd(pa["finish"] + timedelta(days=1)), lag)
        elif typ == "SS":
            cand = add_wd(pa["start"], lag + 1) if lag > 0 else pa["start"]
        else:  # FF
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
    return d.strftime("%Y-%m-%d") + (" 17:00" if False else " 08:00")


def dtf(d):
    return d.strftime("%Y-%m-%d") + " 17:00"


CAL_DATA = ("(0||CalendarData()((0||DaysOfWeek()((0||1()())"
            "(0||2()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||3()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||4()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||5()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||6()((0||0(s|08:00|f|12:00)())(0||1(s|13:00|f|17:00)())))"
            "(0||7()()))))(0||Exceptions()()))")

PROJ_ID, CAL_ID = 1000, 100
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
            "\trem_target_link_flag\treset_planned_flag\tallow_neg_act_flag\tsum_assign_level\texport_flag")
pstart = min(x["start"] for x in A)
pend = max(x["finish"] for x in A)
rows.append("%R\t" + "\t".join(str(v) for v in [
    PROJ_ID, 1, "Y", "Y", "Y", "N", "Y", "N", "N", "N", ".", "CP_Drtn",
    "CVR-MASTER", CAL_ID, 1000, 10, 500, 2, 500, "", 0, 100,
    dt(DD), dt(pstart), dtf(pend), dt(DD), dtf(pend), "DT_FixedDrtn",
    "A", "", "QT_Hour", "admin", "COST_PER_QTY", "N", "N", "TT_Task", "N",
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
for i, (short, name, parent) in enumerate(WBS, start=2000):
    wbs_id[short] = i
for short, name, parent in WBS:
    rows.append("%R\t" + "\t".join(str(v) for v in [
        wbs_id[short], PROJ_ID, "", (wbs_id[short] - 2000 + 1) * 10,
        "Y" if parent is None else "N", "Y", "WS_Open",
        ("CVR-MASTER" if parent is None else short), name, wbs_id[parent] if parent else "",
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
for i, a in enumerate(A, start=10000):
    task_id[a["code"]] = i
TT = {"T": "TT_Task", "M": "TT_Mile", "F": "TT_FinMile"}
for a in A:
    hrs = a["dur"] * 8
    rows.append("%R\t" + "\t".join(str(v) for v in [
        task_id[a["code"]], PROJ_ID, wbs_id[a["wbs"]], CAL_ID, 0,
        "CP_Drtn", TT[a["typ"]], "DT_FixedDrtn", "TK_NotStart",
        a["code"], a["name"], 0, 0,
        hrs, 0, hrs, hrs,
        hrs, 0, 0, 0,
        dt(next_wd(a["sne"])) if a["sne"] else "", "", "",
        dt(a["start"]), dtf(a["finish"]),
        "", dt(a["start"]), dtf(a["finish"]), "", "",
        dt(a["start"]), dtf(a["finish"]), dt(a["start"]), dtf(a["finish"]),
        "CS_MEO" if a["sne"] else "", "PT_Normal", "", "", "",
        "", "", "", "N",
        dt(DD), dt(DD), "Y", "N", "N"]))

rows.append("%T\tTASKPRED")
rows.append("%F\ttask_pred_id\ttask_id\tpred_task_id\tproj_id\tpred_proj_id"
            "\tpred_type\tlag_hr_cnt\tfloat_path\taref\tarls")
pid = 50000
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
tr = 90000
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
with open("model/CVR_Master_Schedule.xer", "w", newline="\r\n") as f:
    f.write("\n".join(rows))
print(f"wrote model/CVR_Master_Schedule.xer  ({len(A)} activities, "
      f"{pid-50000} relationships, {tr-90000} assignments)")

# ---------------------------------------------------------------- register ---
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

NAVY, GREY = "1F3864", "F2F2F2"
FH = Font(bold=True, color="FFFFFF")
FILL = PatternFill("solid", fgColor=NAVY)
FS = Font(bold=True, color=NAVY)
FN = Font(italic=True, size=9, color="595959")
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
        from openpyxl.utils import get_column_letter
        for c, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(c)].width = w


ws = wb.active
ws.title = "READ ME"
ws["A1"] = "CVR Master Schedule — P6 import package"
ws["A1"].font = Font(bold=True, size=14, color=NAVY)
notes = [
    "",
    "FILES",
    "  CVR_Master_Schedule.xer — import into P6: File > Import > Primavera XER, project CVR-MASTER.",
    "  This workbook — the human-readable register of everything in the XER.",
    "",
    "WHAT'S IN THE SCHEDULE",
    f"  {len(A)} activities across CenterPoint direct (017 jobs), DTE (New Baltimore 39-WO pilot, Catalina,",
    "  Renaissance), Consumers (HVD sensors, Pole Replacement EPC), MEC EPC support (Sub P, Enterprise Way,",
    "  VanMeter), Cloverland closeout, the pending pipeline (constrained to assumed award dates), and governance.",
    "  Every procurement chain follows CVR-PROC-001: IFC -> EOR transmittal -> PLS PO -> lead time -> delivery,",
    "  so the 'engineering complete' milestones are wired to construction need dates through real lead times.",
    "",
    "RESOURCE LOADING",
    "  Loaded with the current 13-person roster plus: Senior PM (starts 8/24), and the three open reqs",
    "  (T-Line, Substation, Structural) as placeholder resources — their assignments show the hiring need.",
    "  Hours are planning-level estimates; refine per job as the PM team baselines.",
    "",
    "AFTER IMPORT (P6)",
    "  1. Schedule (F9) at data date 12-Aug-26 — P6 recomputes the network from the logic.",
    "  2. Review constraint dates (assumed award dates on Renaissance/VanMeter/pipeline; construction need dates).",
    "  3. Set the baseline, then run weekly updates per the operating cadence.",
    "",
    "ASSUMED DATES TO CONFIRM",
    "  VanMeter award 10/15/26 · Renaissance award 11/2/26 · NB construction 4/1/27 · Pole program construction",
    "  3/1/27 · pipeline awards Q4-26. Adjust the milestones and re-schedule.",
]
for i, t in enumerate(notes, start=3):
    c = ws.cell(row=i, column=1, value=t)
    if t in ("FILES", "WHAT'S IN THE SCHEDULE", "RESOURCE LOADING", "AFTER IMPORT (P6)",
             "ASSUMED DATES TO CONFIRM"):
        c.font = FS
ws.column_dimensions["A"].width = 110

# activities
ws = wb.create_sheet("Activities")
head(ws, 1, ["Code", "WBS", "Activity", "Type", "Dur (wd)", "Start", "Finish",
             "Predecessors", "Resources (hours)", "Constraint"],
     [12, 10, 52, 7, 9, 11, 11, 26, 34, 12])
wbsname = {s: n for s, n, _ in WBS}
for r, a in enumerate(A, start=2):
    ws.cell(row=r, column=1, value=a["code"]).border = BOX
    ws.cell(row=r, column=2, value=a["wbs"]).border = BOX
    ws.cell(row=r, column=3, value=a["name"]).border = BOX
    ws.cell(row=r, column=4, value={"T": "Task", "M": "Milestone", "F": "Finish MS"}[a["typ"]]).border = BOX
    ws.cell(row=r, column=5, value=a["dur"]).border = BOX
    ws.cell(row=r, column=6, value=a["start"].strftime("%m/%d/%y")).border = BOX
    ws.cell(row=r, column=7, value=a["finish"].strftime("%m/%d/%y")).border = BOX
    ws.cell(row=r, column=8, value="; ".join(f"{p} {t}{'+'+str(l)+'d' if l else ''}" for p, t, l in a["preds"])).border = BOX
    ws.cell(row=r, column=9, value="; ".join(f"{s} {h}h" for s, h in a["res"])).border = BOX
    ws.cell(row=r, column=10, value=a["sne"].strftime("%m/%d/%y") if a["sne"] else "").border = BOX
ws.freeze_panes = "A2"

# long-lead register
ws = wb.create_sheet("Long-Lead Register")
head(ws, 1, ["Equipment", "Job / element", "Lead (wks)", "Construction need",
             "PO must be placed by", "Transmittal by", "ENGINEERING COMPLETE BY",
             "IFC forecast (schedule)", "Margin (wd)"],
     [30, 34, 9, 13, 13, 13, 10, 10, 9])
LL = [
    ("CAPBANK", "CenterPoint Northwest 69kV", date(2027, 5, 3), "NW-IFC"),
    ("CAPBANK", "CenterPoint Leonard Rd 69kV", date(2027, 7, 6), "LR-IFC"),
    ("POLES", "DTE New Baltimore (rolling, batch 1)", date(2027, 3, 15), "NB-WO1"),
    ("COND", "DTE New Baltimore (rolling, batch 1)", date(2027, 3, 15), "NB-WO1"),
    ("MOD345", "DTE Renaissance 345kV", date(2027, 9, 1), "RN-IFC"),
    ("POLES", "Consumers Pole Replacements", date(2027, 3, 1), "PR-IFC"),
    ("XFMR161", "MEC VanMeter (early release @60%)", date(2028, 3, 1), "VM-60"),
    ("BRKR", "MEC VanMeter (early release @60%)", date(2027, 11, 1), "VM-60"),
    ("STEEL", "MEC VanMeter", date(2027, 10, 1), "VM-IFC"),
    ("RELAY", "MEC VanMeter", date(2027, 12, 1), "VM-IFC"),
]
for r, (key, job, need, ifc_code) in enumerate(LL, start=2):
    label, wks = LEADS[key]
    po_by = sub_wd(need, wks * 5)
    trn_by = sub_wd(po_by, PO_CYCLE_WD)
    eng_by = sub_wd(trn_by, TRANSMITTAL_WD)
    ifc_fc = IDX[ifc_code]["finish"]
    margin = 0
    d = min(ifc_fc, eng_by)
    while d < max(ifc_fc, eng_by):
        d += timedelta(days=1)
        if is_wd(d):
            margin += 1
    if ifc_fc > eng_by:
        margin = -margin
    ws.cell(row=r, column=1, value=label).border = BOX
    ws.cell(row=r, column=2, value=job).border = BOX
    ws.cell(row=r, column=3, value=wks).border = BOX
    for c, v in ((4, need), (5, po_by), (6, trn_by), (7, eng_by), (8, ifc_fc)):
        ws.cell(row=r, column=c, value=v.strftime("%m/%d/%y")).border = BOX
    m = ws.cell(row=r, column=9, value=margin)
    m.border = BOX
    if margin < 0:
        m.font = Font(bold=True, color="C00000")
ws.cell(row=len(LL) + 3, column=1,
        value="ENGINEERING COMPLETE BY = construction need − fabrication lead − PO cycle (3 wks) − transmittal (1 wk). "
              "Negative margin = the schedule's forecast IFC is later than procurement requires — pull design left or expedite.").font = FN
ws.freeze_panes = "A2"

# resource loading summary
ws = wb.create_sheet("Resource Loading")
head(ws, 1, ["Resource", "Role / note", "Total hours", "≈ FTE-months (146 h/mo @ 84%)"],
     [10, 40, 12, 24])
tot = {s: 0 for _, s, _ in RSRC}
for a in A:
    for s, h in a["res"]:
        tot[s] += h
for r, (rid, short, name) in enumerate(RSRC, start=2):
    ws.cell(row=r, column=1, value=short).border = BOX
    ws.cell(row=r, column=2, value=name).border = BOX
    ws.cell(row=r, column=3, value=tot[short]).border = BOX
    ws.cell(row=r, column=4, value=round(tot[short] / 146, 1)).border = BOX
ws.cell(row=len(RSRC) + 3, column=1,
        value="Assignments spread evenly across each activity in P6; open-req rows (TLE/SSE/STE) quantify the hiring "
              "need — reassign to named staff as they start.").font = FN

wb.save("model/CVR_Master_Schedule_Register.xlsx")
print("wrote model/CVR_Master_Schedule_Register.xlsx")

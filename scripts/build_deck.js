// CVR Engineering — Financial Review & Forecast deck (June 2026)
// Generates reports/CVR_Deck_Jun2026.pptx. Data sourced from the Phase 1/2
// workbooks (GL 6/30/26, KPI report 7/11/26, Phase 2 Base scenario).
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");
const MAN = require(path.join(__dirname, "..", "reports", "assets", "manifest.json"));

function chartImg(s, name, x, y, w) {
  const m = MAN[name];
  const h = w * m.h / m.w;
  s.addImage({ path: path.join(__dirname, "..", "reports", "assets", name + ".png"), x, y, w, h });
  return h;
}

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5

// palette (matches the HTML dashboard)
const INK = "0B0B0B", INK2 = "52514E", MUTED = "898781", GRID = "E1E0D9";
const BLUE = "2A78D6", BLUE2 = "9EC5F4", BLUE3 = "CDE2FB", RED = "E34948";
const GOOD = "006300", GREEN = "86B332", CARD = "F7F7F5", DARK = "1A1A19", DARKINK = "C3C2B7";
const W = 13.3, H = 7.5, M = 0.6;

const SANS = "Calibri";

function eyebrow(s, text, dark) {
  s.addText([
    { text: "— ", options: { color: GREEN, bold: true } },
    { text: text.toUpperCase(), options: { color: dark ? DARKINK : INK2, bold: true, charSpacing: 2 } },
  ], { x: M, y: 0.32, w: W - 2 * M, h: 0.3, fontSize: 11, fontFace: SANS, margin: 0 });
}
function slideTitle(s, text, dark) {
  s.addText(text, { x: M, y: 0.6, w: W - 2 * M, h: 0.55, fontSize: 27, bold: true,
    color: dark ? "FFFFFF" : INK, fontFace: SANS, margin: 0 });
}
function foot(s, text) {
  s.addText(text, { x: M, y: H - 0.48, w: W - 2 * M, h: 0.35, fontSize: 9.5,
    color: MUTED, fontFace: SANS, margin: 0 });
}
function tile(s, x, y, w, label, value, delta, valColor) {
  s.addShape("roundRect", { x, y, w, h: 1.12, fill: { color: CARD }, rectRadius: 0.06,
    line: { color: GRID, width: 0.75 } });
  s.addText(label, { x: x + 0.14, y: y + 0.08, w: w - 0.28, h: 0.26, fontSize: 10.5, color: INK2, fontFace: SANS, margin: 0 });
  s.addText(value, { x: x + 0.14, y: y + 0.3, w: w - 0.28, h: 0.5, fontSize: 25, bold: true,
    color: valColor || INK, fontFace: SANS, margin: 0 });
  s.addText(delta, { x: x + 0.14, y: y + 0.78, w: w - 0.28, h: 0.28, fontSize: 9.5, color: INK2, fontFace: SANS, margin: 0 });
}
const axisQuiet = {
  catAxisLabelColor: MUTED, valAxisLabelColor: MUTED,
  catAxisLabelFontSize: 10, valAxisLabelFontSize: 10,
  catAxisLineColor: GRID, valAxisLineColor: GRID,
  valGridLine: { color: GRID, size: 0.5 }, catGridLine: { style: "none" },
  fontFace: SANS,
};

/* ============================== 1 · TITLE ============================== */
let s = pres.addSlide();
s.background = { color: DARK };
s.addText([
  { text: "— ", options: { color: GREEN, bold: true } },
  { text: "CVR ENGINEERING · UTILITY SUPPLY & CONSTRUCTION", options: { color: DARKINK, bold: true, charSpacing: 2 } },
], { x: M, y: 2.35, w: W - 2 * M, h: 0.35, fontSize: 13, fontFace: SANS, margin: 0 });
s.addText("Financial Review & Forecast", { x: M, y: 2.75, w: W - 2 * M, h: 0.9,
  fontSize: 48, bold: true, color: "FFFFFF", fontFace: SANS, margin: 0 });
s.addText("Baseline through June 2026  ·  Forecast through December 2027",
  { x: M, y: 3.72, w: W - 2 * M, h: 0.4, fontSize: 18, color: DARKINK, fontFace: SANS, margin: 0 });
s.addText("Sources: GL financial statements 6/30/26 · CVR & EPC KPI report 7/11/26 · 2026 rate sheet · Phase 1 & 2 model workbooks",
  { x: M, y: 6.7, w: W - 2 * M, h: 0.35, fontSize: 10.5, color: MUTED, fontFace: SANS, margin: 0 });

/* ================================ 2 · AGENDA ================================ */
s = pres.addSlide();
eyebrow(s, "Agenda");
slideTitle(s, "What we'll cover");
const agenda = [
  ["1", "Where we stand", "Executive summary · revenue vs plan & prior year · gross margin vs budget · the rate ladder"],
  ["2", "Operating drivers", "Staff & headcount · utilization by person · sales by customer"],
  ["3", "Work in hand & work to win", "Backlog on active jobs · known pipeline opportunities"],
  ["4", "Strategy", "One pursuit engine with HWC Estimating · the consolidated EPC offering · the addressable market · national expansion targets · BD account ownership"],
  ["5", "Forward view", "Forecast & coverage · FY2026 landing and FY2027 scenarios · EPC accounting alignment"],
  ["6", "Next 90 days", "Priorities: realization, utilization, the Q4 pipeline, and the monthly rhythm"],
];
agenda.forEach((a, i) => {
  const y = 1.6 + i * 0.86;
  s.addShape("ellipse", { x: M, y: y + 0.02, w: 0.44, h: 0.44, fill: { color: BLUE } });
  s.addText(a[0], { x: M, y: y + 0.02, w: 0.44, h: 0.44, fontSize: 15, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", fontFace: SANS, margin: 0 });
  s.addText(a[1], { x: M + 0.7, y, w: 3.7, h: 0.45, fontSize: 16.5, bold: true, color: INK,
    valign: "middle", fontFace: SANS, margin: 0 });
  s.addText(a[2], { x: M + 4.6, y, w: W - 2 * M - 4.6, h: 0.45, fontSize: 12, color: INK2,
    valign: "middle", fontFace: SANS, margin: 0 });
});
foot(s, "CVR Engineering financial review & forecast · June 2026");

/* ========================= 3 · EXECUTIVE SUMMARY ========================= */
s = pres.addSlide();
eyebrow(s, "Executive summary");
slideTitle(s, "June 2026 — where CVR Engineering stands");
const tw = (W - 2 * M - 5 * 0.18) / 6;
[["YTD revenue", "$551K", "June $124K — best month", INK],
 ["vs plan", "54.3%", "$464K behind budget", RED],
 ["vs prior year", "+38.1%", "PY YTD $399K", GOOD],
 ["Gross margin YTD", "22.2%", "budget assumes 61.6%", RED],
 ["Utilization", "59.0%", "vs 75% median target", INK],
 ["Realization", "79%", "$122 realized vs $154 card", INK],
].forEach((t, i) => tile(s, M + i * (tw + 0.18), 1.45, tw, t[0], t[1], t[2], t[3]));
s.addText([
  { text: "Revenue is growing but under plan.  ", options: { bold: true } },
  { text: "Every month ran below the flat $169K/month budget, yet YTD is 38% ahead of last year and June was the strongest month on record.", options: {} },
], { x: M, y: 3.0, w: W - 2 * M, h: 0.6, fontSize: 15, color: INK, fontFace: SANS, margin: 0 });
s.addText([
  { text: "The margin problem is throughput, not cost.  ", options: { bold: true } },
  { text: "The team realizes ~$122/hr against a $154/hr rate card at 59% utilization. Closing those two gaps roughly doubles revenue on the current roster.", options: {} },
], { x: M, y: 3.7, w: W - 2 * M, h: 0.6, fontSize: 15, color: INK, fontFace: SANS, margin: 0 });
s.addText([
  { text: "The path forward is quantified.  ", options: { bold: true } },
  { text: "The Base forecast (reconciled to finance's fully-loaded cost) turns FY2027 net income positive at +$123K — with the $6M / 20% OILI target requiring a deliberate capacity build beyond it.", options: {} },
], { x: M, y: 4.4, w: W - 2 * M, h: 0.6, fontSize: 15, color: INK, fontFace: SANS, margin: 0 });
s.addShape("roundRect", { x: M, y: 5.35, w: W - 2 * M, h: 1.15, fill: { color: CARD }, rectRadius: 0.06, line: { color: GRID, width: 0.75 } });
const stripW = (W - 2 * M - 0.4) / 3;
[["H1 2026 net result", "−$320.5K", RED],
 ["Forecast FY2026 landing", "$1.42M rev · −$482K", INK],
 ["FY2027 (Base)", "$2.50M rev · +$123K", GOOD],
].forEach((t, i) => {
  const x0 = M + 0.2 + i * stripW;
  s.addText(t[0], { x: x0, y: 5.5, w: stripW - 0.2, h: 0.3, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: x0, y: 5.8, w: stripW - 0.2, h: 0.5, fontSize: 21, bold: true, color: t[2], fontFace: SANS, margin: 0 });
});

/* ==================== 3 · REVENUE VS PLAN VS PRIOR YEAR ==================== */
s = pres.addSlide();
eyebrow(s, "Where we stand");
slideTitle(s, "Cumulative revenue — Actual vs Plan vs Prior Year");
chartImg(s, "rev", M, 1.9, 8.6);
let rx = M + 8.9, rw = W - M - rx;
[["$551K", "actual YTD — 54.3% of the $1,014.6K plan"],
 ["+38.1%", "ahead of prior-year pace ($399K)"],
 ["$124.4K", "June revenue — best month YTD"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.35, w: rw, h: 0.5, fontSize: 30, bold: true, color: BLUE, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.35, w: rw, h: 0.7, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "Prior-year line is a constant-pace approximation to the actual June YTD of $399.1K — monthly 2025 detail pending from GL history.");

/* ========================== 4 · GROSS MARGIN ========================== */
s = pres.addSlide();
eyebrow(s, "Where we stand");
slideTitle(s, "Gross margin by month vs the 61.6% budget assumption");
chartImg(s, "gm", M, 2.3, 8.6);
[["22.2%", "gross margin YTD — vs 61.6% budgeted"],
 ["2 months", "negative gross profit (Mar, May) on write-downs and thin billing"],
 ["36.8%", "June margin, near-breakeven operating month (−$9.8K before interest)"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.35, w: rw, h: 0.5, fontSize: 30, bold: true, color: i === 0 ? RED : INK, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.35, w: rw, h: 0.75, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "GL income statements, Jan–Jun 2026. Budget gross margin implied by the 2026 budget: labor at 38.4% of revenue.");

/* ========================== 5 · RATE ECONOMICS ========================== */
s = pres.addSlide();
eyebrow(s, "Operating drivers");
slideTitle(s, "The rate ladder — where the card rate goes");
chartImg(s, "ladder", M, 2.4, 8.0);
s.addShape("roundRect", { x: M, y: 4.3, w: 8.0, h: 1.25, fill: { color: CARD }, rectRadius: 0.06, line: { color: GRID, width: 0.75 } });
s.addText([
  { text: "Labor multiplier:  ", options: { color: INK2 } },
  { text: "1.29×", options: { bold: true, fontSize: 22, color: RED } },
  { text: " actual  vs  ", options: { color: INK2 } },
  { text: "2.60×", options: { bold: true, fontSize: 22 } },
  { text: " budgeted revenue per direct-labor dollar (healthy firms run 2.5–3.0×)", options: { color: INK2 } },
], { x: M + 0.2, y: 4.5, w: 7.6, h: 0.85, fontSize: 13, fontFace: SANS, margin: 0 });
rx = M + 8.0; rw = W - M - rx;
[["79%", "realization — $32/hr of card rate not reaching revenue (~$145K in H1)"],
 ["Lead suspect", "intercompany pricing on HWC work (20% of sales); billing lag and write-offs also in scope"],
 ["Now sourced", "per-person cost confirmed from finance's 2026 budget — every role clears its rate (next slide)"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.6, w: rw, h: 0.5, fontSize: 26, bold: true, color: i === 0 ? RED : INK, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.6, w: rw, h: 1.0, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "H1 2026: 4,747 billable hours (through 7/11) · blended card rate mix-weighted from actual billable hours by classification.");

/* ===================== 6 · MARGIN BY ROLE (RATE CARD) ===================== */
s = pres.addSlide();
eyebrow(s, "Operating drivers");
slideTitle(s, "Margin by role — the rate card holds");
chartImg(s, "margin", M, 1.5, 8.3);
rx = M + 8.6; rw = W - M - rx;
[["1.7×–2.2×", "every role clears its bill rate at a healthy labor multiplier on finance's loaded-cost basis", GOOD],
 ["Not a pricing problem", "the rate card is adequate — no classification bills below its cost", INK],
 ["So where's the gap?", "budget blends to 2.6× revenue-per-labor-dollar; H1 actual ran 1.29× — that gap is realization and utilization, not the card", RED],
 ["Focus the fix there", "close the realization gap and lift utilization — the two levers that move margin", BLUE],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.55 + i * 1.32, w: rw, h: 0.33, fontSize: 16, bold: true, color: t[2], fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 1.9 + i * 1.32, w: rw, h: 1.0, fontSize: 11.5, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "Loaded cost = base + 25% benefits + bonus per hour. Source: 2026 CVR Budget V5 (finance), tab Labor Rates-DP.");

/* ========================== 7 · STAFF & HEADCOUNT ========================== */
s = pres.addSlide();
eyebrow(s, "Operating drivers");
slideTitle(s, "Staff & headcount");
const rosterRows = [
  [{ text: "Name", options: { bold: true } }, { text: "Classification", options: { bold: true } },
   { text: "Hours YTD", options: { bold: true } }, { text: "Billable %", options: { bold: true } },
   { text: "Target", options: { bold: true } }],
  ["Roy Pierce", "VP Engineering (Principal Eng.)", "847", "32.7%", "42.4%"],
  ["Hayley Worthen", "Senior Engineer", "952", "66.9%", "61.3%"],
  ["Randy Pynenberg", "Engineer IV", "68", "89.7%", "95.0%"],
  ["Tom Little", "Engineer IV", "— *", "—", "—"],
  ["Erin Bryden", "Engineer IV", "— *", "—", "—"],
  ["Bhkti Patel", "Engineer III", "1,045", "74.4%", "70.7%"],
  ["Francis Wagner", "Engineer III", "992", "62.5%", "70.7%"],
  ["Taylor Nelson", "Engineer II †", "1,045", "61.0%", "80.1%"],
  ["Craig Peterson", "Engineer I", "1,017", "79.6%", "75.4%"],
  ["Kevin Metts", "Designer II †", "890", "38.4%", "75.4%"],
  ["Patrick Nicholson", "Senior Designer", "— *", "—", "—"],
  ["Collin Allen", "Graphics Technician", "985", "57.6%", "80.1%"],
  ["Auston Hopson", "Graphics Technician", "18", "100.0%", "100.0%"],
];
s.addTable(rosterRows, { x: M, y: 1.5, w: 7.9, colW: [1.9, 2.9, 1.1, 1.0, 1.0],
  fontFace: SANS, fontSize: 10, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 },
  fill: { color: "FFFFFF" }, rowH: 0.32,
  align: "left",
});
rx = M + 8.3; rw = W - M - rx;
[["13", "people on the engineering roster"],
 ["10", "active billable staff with recorded hours"],
 ["+3", "hires in the Base hiring plan (Oct-26, Jan-27, Jun-27 → 13 FTE)"],
 ["~27", "billable FTEs needed at target utilization to support the $6M revenue goal"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.55 + i * 1.3, w: rw, h: 0.55, fontSize: 32, bold: true, color: BLUE, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.1 + i * 1.3, w: rw, h: 0.7, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "* No hours on the KPI utilization page — time booking to be confirmed.  † Classification assumed (not on org chart) — pending confirmation.");

/* ========================== 7 · UTILIZATION BY STAFF ========================== */
s = pres.addSlide();
eyebrow(s, "Operating drivers");
slideTitle(s, "Billable utilization vs target, by person");
chartImg(s, "ut", M, 2.2, 8.6);
rx = M + 8.9; rw = W - M - rx;
[["59.0%", "team billable utilization vs 75% median target"],
 ["3 people", "more than 15 points under their individual target (Kevin, Collin, Taylor)"],
 ["+16 pts", "reaching targets adds ~27% billable capacity with zero hires"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.5, w: rw, h: 0.5, fontSize: 28, bold: true, color: i === 0 ? RED : INK, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.5, w: rw, h: 0.9, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "Hours through 7/11/26. Randy Pynenberg (68 hrs) and Auston Hopson (18 hrs) have small YTD bases. Bids/BD time is tracked separately (405 hrs).");

/* ========================== 8 · SALES BY CUSTOMER ========================== */
s = pres.addSlide();
eyebrow(s, "Operating drivers");
slideTitle(s, "Sales by customer — YTD June 2026");
chartImg(s, "cu", M, 2.6, 8.6);
rx = M + 8.9; rw = W - M - rx;
[["69.7%", "of revenue is CenterPoint — matching its ~70% share of billable hours", RED],
 ["20.2%", "intercompany work for Hydaker-Wheatlake (rate treatment under review)", INK],
 ["~10%", "all other external customers combined — diversification is the growth agenda", INK],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.5, w: rw, h: 0.5, fontSize: 28, bold: true, color: t[2], fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.5, w: rw, h: 0.95, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "GL sales-by-customer schedule, 6/30/26. Total $551.0K.");

/* ========================== 9 · BACKLOG ========================== */
s = pres.addSlide();
eyebrow(s, "Work in hand");
slideTitle(s, "Backlog — remaining value on active jobs");
const bkRows = [
  [{ text: "Job", options: { bold: true } }, { text: "Customer / project", options: { bold: true } },
   { text: "PO value", options: { bold: true } }, { text: "Billed", options: { bold: true } },
   { text: "Remaining", options: { bold: true } }, { text: "Finish", options: { bold: true } }],
  ["001-0003", "DTE — New Baltimore Conversion", "$1,428.8K", "$1,216.3K", "$212.5K", "Dec-27"],
  [{ text: "NEW", options: { bold: true, color: GOOD } }, { text: "Consumers — 2026 Pole Replacements (WON)", options: { bold: true } },
   "$300.0K", "$0.0K", { text: "$300.0K", options: { bold: true } }, "Dec-27"],
  ["017-0007", "CenterPoint — Leonard Rd 69kV", "$200.0K", "$6.7K", "$193.3K", "Oct-27"],
  ["017-0006", "CenterPoint — Northwest 69kV", "$110.6K", "$4.4K", "$106.2K", "Aug-27"],
  ["017-0003", "CenterPoint — Gateway 69kV", "$203.0K", "$131.2K", "$71.8K", "Aug-26"],
  ["005-0004", "Consumers — HVD Line Sensors", "$130.5K", "$71.3K", "$59.2K", "Oct-26"],
  ["001-0001", "DTE — Catalina Ph 3 (support tail)", "$838.5K", "$806.3K", "$32.1K", "2026"],
  ["017-0004", "CenterPoint — Rockport 69kV", "$96.7K", "$81.7K", "$15.0K", "Aug-26"],
  ["016-0001", "Cloverland — Manistique Pump Stn", "$111.5K", "$106.6K", "$4.9K", "Sep-26"],
  ["017-0005", "CenterPoint — Angel Mounds 69kV", "$97.0K", "$95.1K", "$1.8K", "Oct-26"],
  [{ text: "", options: {} }, { text: "Total backlog remaining", options: { bold: true } },
   { text: "", options: {} }, { text: "", options: {} }, { text: "$996.8K", options: { bold: true } }, ""],
];
s.addTable(bkRows, { x: M, y: 1.5, w: 8.9, colW: [0.95, 3.4, 1.25, 1.25, 1.25, 0.8],
  fontFace: SANS, fontSize: 10.5, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.36, align: "left" });
rx = M + 9.2; rw = W - M - rx;
[["$997K", "booked work remaining — up $300K on the new Consumers pole win"],
 ["2 jobs", "carry over half of it (New Baltimore, Leonard Rd), both finishing late 2027"],
 ["3 close-outs", "Gateway, Rockport, Manistique wrap by Oct-26 — replacement work needed now"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.5, w: rw, h: 0.5, fontSize: 28, bold: true, color: BLUE, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.5, w: rw, h: 0.95, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "KPI project scorecard, week ending 7/11/26. Remaining = PO value − billed to date; excludes cost-overrun exposure tracked on the scorecard.");

/* ========================== 10 · PIPELINE ========================== */
s = pres.addSlide();
eyebrow(s, "Work to win");
slideTitle(s, "Known pipeline opportunities");
const ppRows = [
  [{ text: "Opportunity", options: { bold: true } }, { text: "Customer", options: { bold: true } },
   { text: "CVR scope", options: { bold: true } }, { text: "Paired EPC", options: { bold: true } },
   { text: "Win prob.", options: { bold: true } }, { text: "Weighted", options: { bold: true } },
   { text: "Award", options: { bold: true } }],
  [{ text: "2026 Pole Replacements", options: { color: GOOD } }, { text: "Consumers Energy", options: { color: GOOD } },
   { text: "$300.0K", options: { color: GOOD } }, { text: "$3,451.1K", options: { color: GOOD } },
   { text: "WON", options: { bold: true, color: GOOD } }, { text: "→ backlog", options: { color: GOOD } }, "Q3-26"],
  ["Joint Use Audit", "Lansing Board of Water & Light", "$1,350.0K", "—", "50%", "$675.0K", "Q4-26"],
  ["Rosehill–Rockport 69kV", "Hoosier Energy REC", "$290.0K", "$5,590.9K", "50%", "$145.0K", "Q4-26"],
  ["Jacksonburg–Gateway 69kV", "Hoosier Energy REC", "$160.0K", "$3,548.5K", "50%", "$80.0K", "Q4-26"],
  ["Frontier Make Ready", "Steuben County REMC", "$100.0K", "—", "50%", "$50.0K", "Q3-26"],
  ["Renaissance 345kV Substation", "DTE Energy", "TBD", "—", "on hold", "—", "hold"],
  [{ text: "", options: {} }, { text: "Pending total (ex-won)", options: { bold: true } },
   { text: "$1,900.0K", options: { bold: true } }, { text: "$9,139.4K", options: { bold: true } },
   { text: "", options: {} }, { text: "$950.0K", options: { bold: true } }, ""],
];
s.addTable(ppRows, { x: M, y: 1.5, w: 9.6, colW: [2.15, 2.15, 1.15, 1.25, 0.95, 1.1, 0.85],
  fontFace: SANS, fontSize: 10.5, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.4, align: "left" });
rx = M + 9.9; rw = W - M - rx;
[["WON", "Consumers pole replacements — $300K CVR scope now booked to backlog", GOOD],
 ["4–5%", "engineering share of paired EPC contract value — every EPC win pulls CVR scope with it", BLUE],
 ["$1.6M", "origination gap beyond this list to fully cover the 18-month Base forecast", RED],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.5, w: rw, h: 0.5, fontSize: 28, bold: true, color: t[2], fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.5, w: rw, h: 0.95, fontSize: 11.5, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "KPI current-bids page, 7/11/26. Win probabilities are planning placeholders (2026 win rate or 50%) — Estimating to own final numbers and award dates.");

/* ==================== 11 · INTEGRATION WITH HWC ESTIMATING ==================== */
s = pres.addSlide();
eyebrow(s, "Strategy — one delivery organization");
slideTitle(s, "One pursuit engine: Engineering + Estimating");
s.addText("Today: two linked groups, one funnel forming", { x: M, y: 1.55, w: 6.2, h: 0.35,
  fontSize: 16, bold: true, color: INK, fontFace: SANS, margin: 0 });
s.addText([
  { text: "A ~10-person estimating organization (Director of Estimating plus senior estimators) sits beside the 13-person engineering roster — same leadership, same customers.", options: { bullet: true, breakLine: true } },
  { text: "Engineering already invests 405 hours YTD in bids and proposals — 20% of its non-billable time — but informally, after the estimate is framed.", options: { bullet: true, breakLine: true } },
  { text: "EPC-paired pursuits (Hoosier, Consumers) are already priced with engineering scope inside them — the consolidated model exists in embryo.", options: { bullet: true } },
], { x: M, y: 2.0, w: 6.2, h: 2.9, fontSize: 13, color: INK2, fontFace: SANS, margin: 0, paraSpaceAfter: 10 });
const integ = [
  ["1", "Single pursuit funnel", "One bid list owned jointly; engineering hours planned into every estimate from day one, not volunteered afterward."],
  ["2", "Design-to-estimate loop", "Standard design packages and unit-hour norms feed estimating's cost baselines, so bids carry engineering reality."],
  ["3", "Estimate-to-execution handoff", "The winning estimate becomes the project budget the weekly scorecard tracks — one number from bid to closeout."],
];
integ.forEach((p, i) => {
  const y = 1.6 + i * 1.15;
  s.addShape("ellipse", { x: M + 6.7, y: y + 0.02, w: 0.44, h: 0.44, fill: { color: BLUE } });
  s.addText(p[0], { x: M + 6.7, y: y + 0.02, w: 0.44, h: 0.44, fontSize: 16, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", fontFace: SANS, margin: 0 });
  s.addText(p[1], { x: M + 7.35, y, w: 5.2, h: 0.3, fontSize: 14.5, bold: true, color: INK, fontFace: SANS, margin: 0 });
  s.addText(p[2], { x: M + 7.35, y: y + 0.32, w: 5.2, h: 0.75, fontSize: 11.5, color: INK2, fontFace: SANS, margin: 0 });
});
s.addShape("roundRect", { x: M, y: 5.25, w: W - 2 * M, h: 1.25, fill: { color: CARD }, rectRadius: 0.06, line: { color: GRID, width: 0.75 } });
s.addText([
  { text: "Why it matters:  ", options: { bold: true, color: INK } },
  { text: "cost variance is the biggest margin leak on the scorecard (individual jobs overran to −92% and −206%). Early engineering input into estimates is the structural fix — and it converts estimating support from overhead into billable pursuit capacity.", options: { color: INK2 } },
], { x: M + 0.2, y: 5.45, w: W - 2 * M - 0.4, h: 0.9, fontSize: 13, fontFace: SANS, margin: 0 });

/* ==================== 12 · CONSOLIDATED EPC OFFERING ==================== */
s = pres.addSlide();
eyebrow(s, "Strategy — the consolidated offering");
slideTitle(s, "Refocus: pursue EPC with new clients as one offering");
const chev = [
  ["TODAY", "Support function", "Engineering supports HWC construction and bills hours", BLUE3, INK],
  ["TRANSITION", "Prime engineer", "Early design control; engineering priced into every EPC bid", BLUE2, INK],
  ["TARGET", "Engineer of Record", "Turnkey EPC — supply, engineering, construction sold and delivered together", BLUE, "FFFFFF"],
];
chev.forEach((c, i) => {
  const x0 = M + i * 4.08, cw = 3.88, tx = x0 + (i === 0 ? 0.3 : 0.62), tw = cw - (i === 0 ? 0.95 : 1.25);
  s.addShape("chevron", { x: x0, y: 1.55, w: cw, h: 1.6, fill: { color: c[3] }, line: { color: c[3] } });
  s.addText(c[0], { x: tx, y: 1.72, w: tw, h: 0.24, fontSize: 9.5, bold: true, charSpacing: 2,
    color: c[4] === "FFFFFF" ? "E8F0FB" : INK2, fontFace: SANS, margin: 0 });
  s.addText(c[1], { x: tx, y: 1.97, w: tw, h: 0.32, fontSize: 14.5, bold: true, color: c[4], fontFace: SANS, margin: 0 });
  s.addText(c[2], { x: tx, y: 2.3, w: tw, h: 0.78, fontSize: 10, color: c[4] === "FFFFFF" ? "E8F0FB" : INK2, fontFace: SANS, margin: 0 });
});
s.addText("What changes", { x: M, y: 3.45, w: 6.4, h: 0.35, fontSize: 16, bold: true, color: INK, fontFace: SANS, margin: 0 });
s.addText([
  { text: "Lead with one accountable offer — material supply, engineering, and construction priced and sold together, with single-point delivery risk the utility doesn't have to manage.", options: { bullet: true, breakLine: true } },
  { text: "Aim it at new clients — the co-op and municipal pattern already responding (Hoosier, Steuben, Lansing BWL) — to grow revenue while cutting the 70% CenterPoint concentration.", options: { bullet: true, breakLine: true } },
  { text: "Every EPC win feeds both P&Ls: construction margin to HWC, and 4–5% of contract value as engineering scope to CVR — the revenue that funds the capacity build toward $6M.", options: { bullet: true } },
], { x: M, y: 3.9, w: 6.4, h: 2.6, fontSize: 13, color: INK2, fontFace: SANS, margin: 0, paraSpaceAfter: 10 });
rx = M + 6.9; rw = W - M - rx;
[["$9.1M", "of EPC-paired bids still in market with Hoosier (Consumers pole program now won)", BLUE],
 ["4–5%", "engineering pull-through on every EPC contract won", BLUE],
 ["67%", "2026 win rate — the consolidated offer is landing", GOOD],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 3.55 + i * 1.05, w: rw, h: 0.5, fontSize: 27, bold: true, color: t[2], fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 4.03 + i * 1.05, w: rw, h: 0.6, fontSize: 11.5, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "Integration path per the CVR strategy roadmap: support function → prime engineer → Engineer of Record / turnkey program support.");

/* ==================== 13 · ADDRESSABLE EPC MARKET ==================== */
s = pres.addSlide();
eyebrow(s, "Strategy — the consolidated offering");
slideTitle(s, "The addressable EPC market in our current client base");
// Uses official logo art from reports/assets/logos/<file> when present;
// falls back to a brand-colored wordmark otherwise.
function brandMark(slide, x, y, name, sub, color, file) {
  const p = path.join(__dirname, "..", "reports", "assets", "logos", file);
  if (fs.existsSync(p)) {
    slide.addImage({ path: p, x, y, w: 2.3, h: 0.55, sizing: { type: "contain", w: 2.3, h: 0.55 } });
    slide.addText(sub, { x: x + 2.45, y: y + 0.12, w: 2.6, h: 0.3, fontSize: 10, color: INK2, fontFace: SANS, margin: 0 });
  } else {
    slide.addText(name, { x, y, w: 3.9, h: 0.34, fontSize: 17, bold: true, color, fontFace: SANS, margin: 0 });
    slide.addText(sub, { x, y: y + 0.33, w: 4.6, h: 0.26, fontSize: 10, color: INK2, fontFace: SANS, margin: 0 });
  }
}
const MKT = [
  ["Consumers Energy", "Michigan — electric & gas", "0057B8", "consumers.png",
   ">$17B", "5-year capital plan; $8.5B of distribution reliability & resilience through 2029",
   "Foothold: HVD line-sensor program live; 2026 pole replacements WON ($300K CVR scope, $3.45M EPC-paired)"],
  ["DTE Energy", "Michigan — electric & gas", "16376C", "dte.png",
   "$36.5B", "5-year plan 2026–30 — up 20% on data-center load and grid reliability spend",
   "Foothold: New Baltimore & Catalina conversions ($2.3M PO); Renaissance 345kV bid on hold"],
  ["CenterPoint Energy", "Indiana Electric + Houston Electric", "E31937", "centerpoint.png",
   "$65B", "10-year plan 2026–35; Houston Electric $46.3B; Indiana transmission & data-center upside",
   "Foothold: 7 active Indiana substation jobs; Houston presence = the expansion runway"],
  ["MidAmerican Energy (MEC)", "Iowa — Berkshire Hathaway Energy", "14477D", "midamerican.png",
   "$3.9B", "Wind PRIME program, on top of ~$14B invested in Iowa energy infrastructure since 2004",
   "Foothold: 4 active EPC substation projects with HWC ($21.7M PO value)"],
];
MKT.forEach((m, i) => {
  const cx = M + (i % 2) * 6.28, cy = 1.5 + Math.floor(i / 2) * 2.42, cw = 6.08, ch = 2.28;
  s.addShape("roundRect", { x: cx, y: cy, w: cw, h: ch, fill: { color: CARD }, rectRadius: 0.06,
    line: { color: GRID, width: 0.75 } });
  brandMark(s, cx + 0.24, cy + 0.18, m[0], m[1], m[2], m[3]);
  s.addText([
    { text: m[4] + "  ", options: { bold: true, fontSize: 24, color: INK } },
    { text: m[5], options: { fontSize: 10.5, color: INK2 } },
  ], { x: cx + 0.24, y: cy + 0.86, w: cw - 0.48, h: 0.78, fontFace: SANS, margin: 0 });
  s.addText(m[6], { x: cx + 0.24, y: cy + 1.72, w: cw - 0.48, h: 0.5, fontSize: 10, italic: true,
    color: INK2, fontFace: SANS, margin: 0 });
});
s.addShape("roundRect", { x: M, y: 6.42, w: W - 2 * M, h: 0.52, fill: { color: "EAF1FA" }, rectRadius: 0.05,
  line: { color: GRID, width: 0.75 } });
s.addText([
  { text: "≈$120B in disclosed capital plans across this client base.  ", options: { bold: true, color: INK } },
  { text: "0.005% captured as engineering = the $6M Year-2 goal.", options: { color: INK2 } },
], { x: M + 0.2, y: 6.5, w: W - 2 * M - 0.4, h: 0.36, fontSize: 12.5, fontFace: SANS, margin: 0 });
foot(s, "Public sources: company capital-plan announcements and filings (Utility Dive, SEC 8-K, company releases), July 2026. Logos are the property of their respective owners; shown for internal reference only.");

/* ==================== 13b · NEW-LOGO EXPANSION TARGETS ==================== */
s = pres.addSlide();
eyebrow(s, "Strategy — beyond the current footprint");
slideTitle(s, "Target “new logos” — the national expansion list");
const TGT = [
  ["AEP", "American Electric Power · 11-state footprint", "F58025", "aep.png",
   "$78B", "Five-year capital plan raised to ~$78B (May 2026) on signed data-center load; largest transmission owner in the U.S.",
   "Where we stand: new leadership post-BHE takeover; strong Director/PM and procurement relationships (JimC + potential BD)."],
  ["FirstEnergy", "OH · PA · NJ · WV · MD · ~6M customers", "1C3F94", "firstenergy.png",
   "$36B", "“Energize365” grid plan, 2026–30 — up ~30% vs. prior; transmission & distribution modernization and reliability",
   "Where we stand: key C-suite relationships to leverage — an open door to EPC."],
  ["PG&E", "Pacific Gas & Electric · N. & Central California", "0033A0", "pge.png",
   "$73B", "$73B 2026–30 capital plan — wildfire undergrounding, grid hardening, and data-center-driven load growth",
   "Where we stand: BD-led — a potential long-term EPC relationship to build."],
  ["Southern Company", "Georgia · Alabama · Mississippi · electric + gas", "00539B", "southern.png",
   "$81B", "Five-year plan raised to $81B (Feb 2026) — data-center & manufacturing load; Georgia Power system growth",
   "Where we stand: relationally weaker, but a major EPC distribution program at Georgia Power."],
];
TGT.forEach((m, i) => {
  const cx = M + (i % 2) * 6.28, cy = 1.5 + Math.floor(i / 2) * 2.42, cw = 6.08, ch = 2.28;
  s.addShape("roundRect", { x: cx, y: cy, w: cw, h: ch, fill: { color: CARD }, rectRadius: 0.06,
    line: { color: GRID, width: 0.75 } });
  brandMark(s, cx + 0.24, cy + 0.18, m[0], m[1], m[2], m[3]);
  s.addText([
    { text: m[4] + "  ", options: { bold: true, fontSize: 24, color: INK } },
    { text: m[5], options: { fontSize: 10.5, color: INK2 } },
  ], { x: cx + 0.24, y: cy + 0.86, w: cw - 0.48, h: 0.78, fontFace: SANS, margin: 0 });
  s.addText(m[6], { x: cx + 0.24, y: cy + 1.72, w: cw - 0.48, h: 0.5, fontSize: 10, italic: true,
    color: BLUE, fontFace: SANS, margin: 0 });
});
s.addShape("roundRect", { x: M, y: 6.42, w: W - 2 * M, h: 0.52, fill: { color: "EAF1FA" }, rectRadius: 0.05,
  line: { color: GRID, width: 0.75 } });
s.addText([
  { text: "≈$268B in disclosed five-year capital plans across these four targets.  ", options: { bold: true, color: INK } },
  { text: "The BD Lead's national pursuit list — beyond the current Michigan / Indiana / Iowa base.", options: { color: INK2 } },
], { x: M + 0.2, y: 6.5, w: W - 2 * M - 0.4, h: 0.36, fontSize: 12.5, fontFace: SANS, margin: 0 });
foot(s, "Public sources: latest company capital-plan disclosures (Q1 2025–Q1 2026 earnings / SEC filings); plan windows vary (2025–29 to 2026–30) — confirm current guidance. Relationship notes are CVR-internal account intel. Logos are the property of their respective owners.");

/* ==================== 14 · BUSINESS DEVELOPMENT — ACCOUNT OWNERS ==================== */
s = pres.addSlide();
eyebrow(s, "Strategy — business development");
slideTitle(s, "An owner on every EPC account");
const HL = { fill: { color: "EAF1FA" } };
const bdRows = [
  [{ text: "Account", options: { bold: true } }, { text: "EPC pursuit focus", options: { bold: true } },
   { text: "Proposed owner *", options: { bold: true } }],
  [{ text: "Outside current footprint", options: Object.assign({ bold: true }, HL) },
   { text: "New utilities & regions beyond MI/IN/IA — Gulf Coast & Texas, MISO/PJM neighbors, data-center-driven grid build-out", options: HL },
   { text: "BD Lead (new hire) — owns the map, coordinates all account managers", options: Object.assign({ bold: true }, HL) }],
  ["CenterPoint — Indiana", "Substation program continuity; move from job-by-job to a program-level agreement", "Roy Pierce (VP Engineering — current PM)"],
  ["CenterPoint — Houston", "Entry into the $46.3B Houston Electric resiliency build — new territory", "SVP Engineering (Houston-based)"],
  ["DTE Energy", "Conversion program follow-on; revive the Renaissance 345kV pursuit", "Assign — VP Engineering or new AM"],
  ["Consumers Energy", "Convert pole/sensor programs into EPC-paired awards", "Frank Miller (Director of Estimating)"],
  ["MidAmerican (MEC)", "Extend the 4-project EPC substation program", "Ethan McDaniel (EPC PM — current)"],
  ["Co-op & municipal cluster", "Hoosier, Steuben, Lansing BWL, Great Lakes — the consolidated-offer beachhead", "New EPC Account Manager (hire)"],
  ["Prospects in motion", "NIPSCO, AES Ohio, AES Indiana, Duke — BD hours already flowing, no owner yet", "New EPC Account Manager (hire)"],
];
s.addTable(bdRows, { x: M, y: 1.5, w: 7.9, colW: [1.75, 3.7, 2.45],
  fontFace: SANS, fontSize: 10, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.52, align: "left" });
rx = M + 8.25; rw = W - M - rx;
[["Assign today — $0", "Incumbent accounts get named owners from existing leadership. The 590 hours of BD & proposal time already spent YTD becomes a managed funnel instead of volunteer work."],
 ["Add two seats — BD Lead + AM", "The BD Lead hunts outside the footprint and owns the consolidated-offer story to new logos; the Account Manager works the co-op/municipal cluster and prospects. One EPC win repays both seats — 4–5% engineering pull-through to CVR plus construction margin to HWC."],
 ["Run the cadence", "Monthly account reviews against the pipeline tab, chaired by the BD Lead. Owners set win probabilities and award dates; BD hours tracked per account."],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.5 + i * 1.85, w: rw, h: 0.35, fontSize: 15, bold: true,
    color: i === 1 ? BLUE : INK, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 1.87 + i * 1.85, w: rw, h: 1.45, fontSize: 10.5, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "* Proposed from current relationships on the KPI scorecards — to be confirmed with the team. YTD BD hours by account (KPI report): Great Lakes 56 · CenterPoint 35.5 · Consumers 26.5 · DTE 19.5 · NIPSCO 10 · AES 10 — plus 408 proposal hours.");

/* ==================== 15 · FORECAST & COVERAGE ==================== */
s = pres.addSlide();
eyebrow(s, "Forward view — Phase 2 model, Base scenario");
slideTitle(s, "Forecast revenue & work coverage, Jul 2026 – Dec 2027");
chartImg(s, "cov", M, 2.2, 8.6);
rx = M + 8.9; rw = W - M - rx;
[["52%", "of the 18-month forecast covered by backlog + weighted pipeline", BLUE],
 ["30%", "covered by booked backlog alone — up with the Consumers pole win", INK],
 ["$1,609K", "gap to originate — the BD target; thinnest coverage is H2-2027", RED],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.5, w: rw, h: 0.5, fontSize: 30, bold: true, color: t[2], fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.5, w: rw, h: 0.95, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "Forecast = FTE × hours × utilization × card rate × realization (Base path: 59→70% utilization, 79→90% realization, 10→13 FTE).");

/* ==================== 12 · FY LANDING & SCENARIOS ==================== */
s = pres.addSlide();
eyebrow(s, "Forward view");
slideTitle(s, "FY2026 landing, FY2027 outlook, and scenarios");
const fyRows = [
  [{ text: "FY2026 ($K)", options: { bold: true } }, { text: "H1 actual", options: { bold: true } },
   { text: "H2 forecast", options: { bold: true } }, { text: "FY landing", options: { bold: true } },
   { text: "Budget", options: { bold: true } }],
  ["Revenue", "551.0", "872.0", { text: "1,423.0", options: { bold: true } }, "2,029.1"],
  ["Gross profit", "122.5", "496.9", { text: "619.4", options: { bold: true } }, "1,249.4"],
  ["Operating income", { text: "−290.5", options: { color: RED } }, "−129.9",
   { text: "−420.4", options: { bold: true, color: RED } }, "139.4"],
  ["Net income", { text: "−320.5", options: { color: RED } }, "−161.2",
   { text: "−481.7", options: { bold: true, color: RED } }, "139.4"],
];
s.addTable(fyRows, { x: M, y: 1.5, w: 6.0, colW: [1.7, 1.05, 1.15, 1.1, 1.0],
  fontFace: SANS, fontSize: 11, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.38, align: "left" });
const fy27Rows = [
  [{ text: "FY2027 (Base)", options: { bold: true } }, { text: "Forecast", options: { bold: true } },
   { text: "Goal", options: { bold: true } }],
  ["Revenue", { text: "2,496.6", options: { bold: true } }, "6,000 (42%)"],
  ["Net income", { text: "+122.7", options: { bold: true, color: GOOD } }, "—"],
  ["OILI return", { text: "4.9%", options: { bold: true } }, "20%"],
];
s.addTable(fy27Rows, { x: M, y: 4.0, w: 6.0, colW: [1.9, 2.0, 2.1],
  fontFace: SANS, fontSize: 11, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.38, align: "left" });
const scRows = [
  [{ text: "Scenario", options: { bold: true } }, { text: "FY26 NI", options: { bold: true } },
   { text: "FY27 rev", options: { bold: true } }, { text: "FY27 NI", options: { bold: true } },
   { text: "OILI %", options: { bold: true } }],
  ["Upside (75% · 95% · 16 FTE)", { text: "−346", options: { color: RED } }, "3,436",
   { text: "+689", options: { color: GOOD } }, "20.0%"],
  [{ text: "Base (70% · 90% · 13 FTE)", options: { bold: true } }, { text: "−482", options: { color: RED } },
   { text: "2,497", options: { bold: true } }, { text: "+123", options: { bold: true, color: GOOD } },
   { text: "4.9%", options: { bold: true } }],
  ["Downside (no change)", { text: "−568", options: { color: RED } }, "1,542",
   { text: "−458", options: { color: RED } }, "−29.7%"],
];
s.addTable(scRows, { x: M + 6.4, y: 1.5, w: 6.1, colW: [2.5, 0.85, 0.95, 0.9, 0.9],
  fontFace: SANS, fontSize: 10.5, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.4, align: "left" });
s.addShape("roundRect", { x: M + 6.4, y: 3.55, w: 6.1, h: 3.0, fill: { color: CARD }, rectRadius: 0.06, line: { color: GRID, width: 0.75 } });
s.addText("What the numbers say", { x: M + 6.6, y: 3.75, w: 5.7, h: 0.35, fontSize: 14, bold: true, color: INK, fontFace: SANS, margin: 0 });
s.addText([
  { text: "Cost is now finance's fully-loaded basis — the forecast reconciles to the budget dollar-for-dollar.", options: { bullet: true, breakLine: true } },
  { text: "The 2026 budget is out of reach; the honest FY26 landing is ~$1.42M revenue and a $480K loss.", options: { bullet: true, breakLine: true } },
  { text: "FY27 turns positive in the Base case (+$123K); the Upside path reaches the 20% OILI aspiration.", options: { bullet: true, breakLine: true } },
  { text: "Utilization and realization are the levers — the $6M / 20% target is a capacity build (~27 FTEs).", options: { bullet: true } },
], { x: M + 6.6, y: 4.15, w: 5.7, h: 2.3, fontSize: 12, color: INK2, fontFace: SANS, margin: 0, paraSpaceAfter: 8 });
foot(s, "Phase 2 forecast model — scenarios switchable in CVR_Model_Phase2_Forecast.xlsx (Drivers tab).");

/* ==================== 19 · BID ENGINEERING ACCOUNTING ==================== */
s = pres.addSlide();
eyebrow(s, "Forward view — accounting alignment");
slideTitle(s, "EPC bid engineering: an item to clean up, not a crisis");
s.addText("The facts", { x: M, y: 1.5, w: 5.0, h: 0.35, fontSize: 16, bold: true, color: INK, fontFace: SANS, margin: 0 });
[["405 hrs", "of bid engineering YTD — ≈$62.6K at card rates ($38.5K at cost), unbilled"],
 ["~60% design", "required before a fixed-price EPC bid can even be submitted — $200–300K of pre-award exposure on the $9.1M bid slate still in market"],
 ["Absorbed today", "these hours land in CVR's overhead with no offsetting credit — immaterial now, but it compounds as EPC pursuit volume grows"],
 ["The misalignment", "bid hours are non-billable, so every EPC pursuit CVR supports drags the metrics CVR is judged on — utilization, realization, OILI"],
].forEach((t, i) => {
  s.addText(t[0], { x: M, y: 1.95 + i * 1.12, w: 5.0, h: 0.36, fontSize: 17, bold: true,
    color: i === 3 ? RED : BLUE, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: M, y: 2.31 + i * 1.12, w: 5.0, h: 0.72, fontSize: 10.5, color: INK2, fontFace: SANS, margin: 0 });
});
const opts = [
  ["1", "Intercompany bid-support billing", "HWC pays CVR for pre-award engineering on EPC pursuits (cost or card). Hours become billable; cost lands where the benefit lands. Standard EPC practice.", true],
  ["2", "Win / loss allocation", "Bid engineering capitalizes to the pursuit — charged to the job on a win, absorbed by HWC as a BD expense on a loss.", false],
  ["3", "Carve it out of the metrics", "Track bid-support hours in a separate BD cost pool so CVR's utilization and realization aren't penalized for pursuit work — a reporting fix, not a cash fix.", false],
];
opts.forEach((o, i) => {
  const oy = 1.5 + i * 1.62, ox = M + 5.5, ow = W - M - ox;
  s.addShape("roundRect", { x: ox, y: oy, w: ow, h: 1.48, fill: { color: o[3] ? "EAF1FA" : CARD },
    rectRadius: 0.06, line: { color: o[3] ? BLUE : GRID, width: o[3] ? 1.25 : 0.75 } });
  s.addShape("ellipse", { x: ox + 0.2, y: oy + 0.18, w: 0.42, h: 0.42, fill: { color: BLUE } });
  s.addText(o[0], { x: ox + 0.2, y: oy + 0.18, w: 0.42, h: 0.42, fontSize: 15, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", fontFace: SANS, margin: 0 });
  s.addText([
    { text: o[1], options: { bold: true, fontSize: 14, color: INK } },
    { text: o[3] ? "   RECOMMENDED" : "", options: { bold: true, fontSize: 9.5, color: BLUE, charSpacing: 1.5 } },
  ], { x: ox + 0.78, y: oy + 0.14, w: ow - 1.0, h: 0.32, fontFace: SANS, margin: 0 });
  s.addText(o[2], { x: ox + 0.78, y: oy + 0.5, w: ow - 1.0, h: 0.9, fontSize: 10.5, color: INK2, fontFace: SANS, margin: 0 });
});
s.addShape("roundRect", { x: M, y: 6.45, w: W - 2 * M, h: 0.5, fill: { color: "EAF1FA" }, rectRadius: 0.05,
  line: { color: GRID, width: 0.75 } });
s.addText([
  { text: "The ask is alignment, not subsidy.  ", options: { bold: true, color: INK } },
  { text: "The dollars are small today — but as EPC volume scales, the accounting should reward the pursuit behavior the strategy demands.", options: { color: INK2 } },
], { x: M + 0.2, y: 6.51, w: W - 2 * M - 0.4, h: 0.38, fontSize: 12, fontFace: SANS, margin: 0 });
foot(s, "Bid hours per the KPI report (through 7/11/26). Raise with the CFO as an EPC accounting-alignment item.");

/* ==================== 20 · PRIORITIES ==================== */
s = pres.addSlide();
s.background = { color: DARK };
s.addText([
  { text: "— ", options: { color: GREEN, bold: true } },
  { text: "NEXT 90 DAYS", options: { color: DARKINK, bold: true, charSpacing: 2 } },
], { x: M, y: 0.5, w: W - 2 * M, h: 0.3, fontSize: 11, fontFace: SANS, margin: 0 });
s.addText("Priorities", { x: M, y: 0.85, w: W - 2 * M, h: 0.6, fontSize: 30, bold: true, color: "FFFFFF", fontFace: SANS, margin: 0 });
const pris = [
  ["1", "Close the realization gap", "Decompose the $145K H1 gap: confirm intercompany rate treatment for HWC work, chase billing lag, stop write-offs. Worth up to $32 more per billable hour."],
  ["2", "Lift utilization toward targets", "Focused plans for the three largest gaps; fill non-billable time with the bid backlog. Reaching targets adds ~27% capacity with zero hires."],
  ["3", "Win the Q4 pipeline", "Lansing BWL audit is the single biggest swing ($1,350K). Land the Hoosier/Consumers EPC-paired work — each EPC win pulls 4–5% engineering scope with it."],
  ["4", "Start the monthly rhythm", "July close goes into the actuals-vs-forecast cadence; the monthly cash draw on USC is the early-warning gauge for reporting."],
];
pris.forEach((p, i) => {
  const y = 1.75 + i * 1.32;
  s.addShape("ellipse", { x: M, y: y + 0.05, w: 0.5, h: 0.5, fill: { color: BLUE } });
  s.addText(p[0], { x: M, y: y + 0.05, w: 0.5, h: 0.5, fontSize: 18, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", fontFace: SANS, margin: 0 });
  s.addText(p[1], { x: M + 0.75, y, w: W - 2 * M - 0.75, h: 0.35, fontSize: 16, bold: true, color: "FFFFFF", fontFace: SANS, margin: 0 });
  s.addText(p[2], { x: M + 0.75, y: y + 0.36, w: W - 2 * M - 0.75, h: 0.75, fontSize: 12, color: DARKINK, fontFace: SANS, margin: 0 });
});
s.addText("CVR Engineering · prepared July 2026 · model workbooks and data in the CVR---Financial repository",
  { x: M, y: H - 0.45, w: W - 2 * M, h: 0.3, fontSize: 9.5, color: MUTED, fontFace: SANS, margin: 0 });

pres.writeFile({ fileName: "reports/CVR_Deck_Jun2026.pptx" }).then(() => console.log("wrote reports/CVR_Deck_Jun2026.pptx"));

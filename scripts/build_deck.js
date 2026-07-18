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

/* ========================= 2 · EXECUTIVE SUMMARY ========================= */
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
  { text: "The Base forecast turns monthly net income positive in November 2026 and delivers a 17.3% OILI return in 2027 — with the $6M revenue goal requiring a deliberate capacity build beyond it.", options: {} },
], { x: M, y: 4.4, w: W - 2 * M, h: 0.6, fontSize: 15, color: INK, fontFace: SANS, margin: 0 });
s.addShape("roundRect", { x: M, y: 5.35, w: W - 2 * M, h: 1.15, fill: { color: CARD }, rectRadius: 0.06, line: { color: GRID, width: 0.75 } });
const stripW = (W - 2 * M - 0.4) / 3;
[["H1 2026 net result", "−$320.5K", RED],
 ["Forecast FY2026 landing", "$1.42M rev · −$352K", INK],
 ["FY2027 (Base)", "$2.50M rev · +$432K", GOOD],
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
 ["Fix in flight", "gap decomposition block is built into the Phase 1 workbook, pending salary detail from finance"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.6, w: rw, h: 0.5, fontSize: 26, bold: true, color: i === 0 ? RED : INK, fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.6, w: rw, h: 1.0, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "H1 2026: 4,747 billable hours (through 7/11) · blended card rate mix-weighted from actual billable hours by classification.");

/* ========================== 6 · STAFF & HEADCOUNT ========================== */
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
  ["017-0007", "CenterPoint — Leonard Rd 69kV", "$200.0K", "$6.7K", "$193.3K", "Oct-27"],
  ["017-0006", "CenterPoint — Northwest 69kV", "$110.6K", "$4.4K", "$106.2K", "Aug-27"],
  ["017-0003", "CenterPoint — Gateway 69kV", "$203.0K", "$131.2K", "$71.8K", "Aug-26"],
  ["005-0004", "Consumers — HVD Line Sensors", "$130.5K", "$71.3K", "$59.2K", "Oct-26"],
  ["001-0001", "DTE — Catalina Ph 3 (support tail)", "$838.5K", "$806.3K", "$32.1K", "2026"],
  ["017-0004", "CenterPoint — Rockport 69kV", "$96.7K", "$81.7K", "$15.0K", "Aug-26"],
  ["016-0001", "Cloverland — Manistique Pump Stn", "$111.5K", "$106.6K", "$4.9K", "Sep-26"],
  ["017-0005", "CenterPoint — Angel Mounds 69kV", "$97.0K", "$95.1K", "$1.8K", "Oct-26"],
  [{ text: "", options: {} }, { text: "Total backlog remaining", options: { bold: true } },
   { text: "", options: {} }, { text: "", options: {} }, { text: "$696.8K", options: { bold: true } }, ""],
];
s.addTable(bkRows, { x: M, y: 1.5, w: 8.9, colW: [0.95, 3.4, 1.25, 1.25, 1.25, 0.8],
  fontFace: SANS, fontSize: 10.5, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.36, align: "left" });
rx = M + 9.2; rw = W - M - rx;
[["$697K", "booked work remaining — about 5 months of Base-forecast revenue"],
 ["2 jobs", "carry 57% of it (New Baltimore, Leonard Rd), both finishing late 2027"],
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
  ["Joint Use Audit", "Lansing Board of Water & Light", "$1,350.0K", "—", "50%", "$675.0K", "Q4-26"],
  ["Rosehill–Rockport 69kV", "Hoosier Energy REC", "$290.0K", "$5,590.9K", "50%", "$145.0K", "Q4-26"],
  ["2026 Pole Replacements", "Consumers Energy", "$276.5K", "$3,451.1K", "67%", "$185.2K", "Q4-26"],
  ["Jacksonburg–Gateway 69kV", "Hoosier Energy REC", "$160.0K", "$3,548.5K", "50%", "$80.0K", "Q4-26"],
  ["Frontier Make Ready", "Steuben County REMC", "$100.0K", "—", "50%", "$50.0K", "Q3-26"],
  ["Renaissance 345kV Substation", "DTE Energy", "TBD", "—", "on hold", "—", "hold"],
  [{ text: "", options: {} }, { text: "Total", options: { bold: true } },
   { text: "$2,176.5K", options: { bold: true } }, { text: "$12,590.5K", options: { bold: true } },
   { text: "", options: {} }, { text: "$1,135.2K", options: { bold: true } }, ""],
];
s.addTable(ppRows, { x: M, y: 1.5, w: 9.6, colW: [2.15, 2.15, 1.15, 1.25, 0.95, 1.1, 0.85],
  fontFace: SANS, fontSize: 10.5, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.4, align: "left" });
rx = M + 9.9; rw = W - M - rx;
[["67%", "2026 win rate to date (up from 50% in 2025)"],
 ["4–5%", "engineering share of paired EPC contract value — every EPC win pulls CVR scope with it"],
 ["$1.5M", "origination gap beyond this list to fully cover the 18-month Base forecast"],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.5, w: rw, h: 0.5, fontSize: 28, bold: true, color: i === 2 ? RED : BLUE, fontFace: SANS, margin: 0 });
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
[["$12.6M", "of EPC-paired bids already in market with Hoosier and Consumers", BLUE],
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
   "Foothold: HVD line-sensor & pole programs live; $3.5M EPC-paired pole-replacement bid pending"],
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
foot(s, "Public sources: company capital-plan announcements and filings (Utility Dive, SEC 8-K, company releases), July 2026. Wordmarks shown; drop official logo files into reports/assets/logos/ and rebuild to swap them in.");

/* ==================== 14 · FORECAST & COVERAGE ==================== */
s = pres.addSlide();
eyebrow(s, "Forward view — Phase 2 model, Base scenario");
slideTitle(s, "Forecast revenue & work coverage, Jul 2026 – Dec 2027");
chartImg(s, "cov", M, 2.2, 8.6);
rx = M + 8.9; rw = W - M - rx;
[["49%", "of the 18-month forecast covered by backlog + weighted pipeline", BLUE],
 ["21%", "covered by booked backlog alone", INK],
 ["$1,724K", "gap to originate — the BD target; thinnest coverage is H2-2027", RED],
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
  ["Gross profit", "122.5", "422.4", { text: "544.9", options: { bold: true } }, "1,249.4"],
  ["Operating income", { text: "−290.5", options: { color: RED } }, "−0.5",
   { text: "−291.0", options: { bold: true, color: RED } }, "139.4"],
  ["Net income", { text: "−320.5", options: { color: RED } }, "−31.3",
   { text: "−351.8", options: { bold: true, color: RED } }, "139.4"],
];
s.addTable(fyRows, { x: M, y: 1.5, w: 6.0, colW: [1.7, 1.05, 1.15, 1.1, 1.0],
  fontFace: SANS, fontSize: 11, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.38, align: "left" });
const fy27Rows = [
  [{ text: "FY2027 (Base)", options: { bold: true } }, { text: "Forecast", options: { bold: true } },
   { text: "Goal", options: { bold: true } }],
  ["Revenue", { text: "2,496.6", options: { bold: true } }, "6,000 (42%)"],
  ["Net income", { text: "+431.6", options: { bold: true, color: GOOD } }, "—"],
  ["OILI return", { text: "17.3%", options: { bold: true } }, "20%"],
];
s.addTable(fy27Rows, { x: M, y: 4.0, w: 6.0, colW: [1.9, 2.0, 2.1],
  fontFace: SANS, fontSize: 11, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.38, align: "left" });
const scRows = [
  [{ text: "Scenario", options: { bold: true } }, { text: "FY26 NI", options: { bold: true } },
   { text: "FY27 rev", options: { bold: true } }, { text: "FY27 NI", options: { bold: true } },
   { text: "OILI %", options: { bold: true } }],
  ["Upside (75% · 95% · 16 FTE)", { text: "−205", options: { color: RED } }, "3,436",
   { text: "+1,054", options: { color: GOOD } }, "30.7%"],
  [{ text: "Base (70% · 90% · 13 FTE)", options: { bold: true } }, { text: "−352", options: { color: RED } },
   { text: "2,497", options: { bold: true } }, { text: "+432", options: { bold: true, color: GOOD } },
   { text: "17.3%", options: { bold: true } }],
  ["Downside (no change)", { text: "−444", options: { color: RED } }, "1,542",
   { text: "−205", options: { color: RED } }, "−13.3%"],
];
s.addTable(scRows, { x: M + 6.4, y: 1.5, w: 6.1, colW: [2.5, 0.85, 0.95, 0.9, 0.9],
  fontFace: SANS, fontSize: 10.5, color: INK, valign: "middle",
  border: { type: "solid", color: GRID, pt: 0.5 }, fill: { color: "FFFFFF" }, rowH: 0.4, align: "left" });
s.addShape("roundRect", { x: M + 6.4, y: 3.55, w: 6.1, h: 3.0, fill: { color: CARD }, rectRadius: 0.06, line: { color: GRID, width: 0.75 } });
s.addText("What the numbers say", { x: M + 6.6, y: 3.75, w: 5.7, h: 0.35, fontSize: 14, bold: true, color: INK, fontFace: SANS, margin: 0 });
s.addText([
  { text: "The 2026 budget is out of reach — socialize the re-forecast rather than track to a 2.7× H2 run-rate.", options: { bullet: true, breakLine: true } },
  { text: "Monthly net income turns positive in November 2026 in the Base case.", options: { bullet: true, breakLine: true } },
  { text: "The 20% OILI return is a performance goal — reachable. The $6M revenue is a capacity goal (~27 billable FTEs).", options: { bullet: true, breakLine: true } },
  { text: "Utilization and realization are the two levers that double revenue on the current roster.", options: { bullet: true } },
], { x: M + 6.6, y: 4.15, w: 5.7, h: 2.3, fontSize: 12, color: INK2, fontFace: SANS, margin: 0, paraSpaceAfter: 8 });
foot(s, "Phase 2 forecast model — scenarios switchable in CVR_Model_Phase2_Forecast.xlsx (Drivers tab).");

/* ==================== 13 · CASH & PARENT NOTE ==================== */
s = pres.addSlide();
eyebrow(s, "Forward view");
slideTitle(s, "Cash & the USC parent note — the early-warning gauge");
chartImg(s, "note", M, 2.0, 8.0);
rx = M + 8.9; rw = W - M - rx;
[["$3.44M", "note balance at 6/30/26 — CVR's entire funding runs through this account", INK],
 ["$3.59M", "Base-case peak in Jan-27, then a steady decline", INK],
 ["−$209K", "paydown by Dec-27 in the Base case; Downside grows it to $3.82M", GOOD],
].forEach((t, i) => {
  s.addText(t[0], { x: rx, y: 1.7 + i * 1.5, w: rw, h: 0.5, fontSize: 30, bold: true, color: t[2], fontFace: SANS, margin: 0 });
  s.addText(t[1], { x: rx, y: 2.2 + i * 1.5, w: rw, h: 0.95, fontSize: 12, color: INK2, fontFace: SANS, margin: 0 });
});
foot(s, "CVR holds no cash: deficits draw the note, surpluses repay it (~$5K/mo interest accrues). If the balance isn't flattening by Q1-27, the drivers aren't moving.");

/* ==================== 14 · PRIORITIES ==================== */
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
  ["4", "Start the monthly rhythm", "July close goes into the actuals-vs-forecast cadence; note-balance trajectory is the early-warning gauge for USC reporting."],
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

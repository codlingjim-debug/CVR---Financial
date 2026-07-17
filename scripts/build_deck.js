// CVR Engineering — Financial Review & Forecast deck (June 2026)
// Generates reports/CVR_Deck_Jun2026.pptx. Data sourced from the Phase 1/2
// workbooks (GL 6/30/26, KPI report 7/11/26, Phase 2 Base scenario).
const pptxgen = require("pptxgenjs");

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
const MO6 = ["Jan 26", "Feb 26", "Mar 26", "Apr 26", "May 26", "Jun 26"];
s.addChart("line", [
  { name: "Actual", labels: MO6, values: [110.5, 207.3, 246.6, 341.1, 426.7, 551.0] },
  { name: "Plan (budget)", labels: MO6, values: [169.1, 338.2, 507.3, 676.4, 845.5, 1014.6] },
  { name: "Prior year (pace)", labels: MO6, values: [66.5, 133.0, 199.6, 266.1, 332.6, 399.1] },
], Object.assign({ x: M, y: 1.5, w: 8.6, h: 5.1,
  chartColors: [BLUE, MUTED, "B8B6AF"], lineSize: 3, lineSmooth: false,
  lineDataSymbol: "circle", lineDataSymbolSize: 6,
  showLegend: true, legendPos: "b", legendColor: INK2, legendFontSize: 11,
  valAxisTitle: "$K cumulative", showValAxisTitle: true, valAxisTitleColor: INK2, valAxisTitleFontSize: 11,
}, axisQuiet));
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
s.addChart([
  { type: "bar", data: [{ name: "Gross margin %", labels: MO6, values: [47.6, 25.0, -39.9, 35.6, -21.1, 36.8] }],
    options: { chartColors: [BLUE], barGapWidthPct: 120, showValue: true, dataLabelPosition: "outEnd",
      dataLabelColor: INK, dataLabelFontSize: 10, dataLabelFormatCode: '0.0"%"' } },
  { type: "line", data: [{ name: "Budget 61.6%", labels: MO6, values: [61.6, 61.6, 61.6, 61.6, 61.6, 61.6] }],
    options: { chartColors: [MUTED], lineSize: 2, lineDash: "dash", lineDataSymbol: "none" } },
], Object.assign({ x: M, y: 1.5, w: 8.6, h: 5.1,
  showLegend: true, legendPos: "b", legendColor: INK2, legendFontSize: 11,
  valAxisMinVal: -60, valAxisMaxVal: 80, valAxisLabelFormatCode: '0"%"',
}, axisQuiet));
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
s.addChart("bar", [
  { name: "$/billable hour", labels: ["Direct labor cost", "Realized rate", "Blended card rate"],
    values: [95.13, 122.32, 154.47] },
], Object.assign({ x: M, y: 1.6, w: 7.6, h: 3.4, barDir: "bar",
  chartColors: [BLUE], barGapWidthPct: 80,
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontSize: 12,
  dataLabelFormatCode: '"$"0.00', showLegend: false,
  valAxisMinVal: 0, valAxisMaxVal: 170, valAxisLabelFormatCode: '"$"0',
}, axisQuiet));
s.addShape("roundRect", { x: M, y: 5.3, w: 7.6, h: 1.25, fill: { color: CARD }, rectRadius: 0.06, line: { color: GRID, width: 0.75 } });
s.addText([
  { text: "Labor multiplier:  ", options: { color: INK2 } },
  { text: "1.29×", options: { bold: true, fontSize: 22, color: RED } },
  { text: " actual  vs  ", options: { color: INK2 } },
  { text: "2.60×", options: { bold: true, fontSize: 22 } },
  { text: " budgeted revenue per direct-labor dollar (healthy firms run 2.5–3.0×)", options: { color: INK2 } },
], { x: M + 0.2, y: 5.5, w: 7.2, h: 0.85, fontSize: 13, fontFace: SANS, margin: 0 });
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
const uNames = ["Roy Pierce", "Kevin Metts", "Collin Allen", "Taylor Nelson", "Francis Wagner",
  "Hayley Worthen", "Bhkti Patel", "Craig Peterson", "Randy Pynenberg", "Auston Hopson"];
const uAct = [32.7, 38.4, 57.6, 61.0, 62.5, 66.9, 74.4, 79.6, 89.7, 100.0];
const uTgt = [42.4, 75.4, 80.1, 80.1, 70.7, 61.3, 70.7, 75.4, 95.0, 100.0];
s.addChart("bar", [
  { name: "Actual billable %", labels: uNames, values: uAct },
  { name: "Target", labels: uNames, values: uTgt },
], Object.assign({ x: M, y: 1.5, w: 8.6, h: 5.1, barDir: "bar",
  chartColors: [BLUE, GRID], barGapWidthPct: 60, barOverlapPct: -20,
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK2, dataLabelFontSize: 9,
  dataLabelFormatCode: '0.0"%"',
  showLegend: true, legendPos: "b", legendColor: INK2, legendFontSize: 11,
  valAxisMinVal: 0, valAxisMaxVal: 110, valAxisLabelFormatCode: '0"%"',
}, axisQuiet));
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
const cNames = ["Kokosing Industrial", "Great Lakes Energy", "Steuben County REMC", "Ambor Structures",
  "Hydaker-Wheatlake (intercompany)", "CenterPoint Energy"];
s.addChart("bar", [
  { name: "Sales $K", labels: cNames, values: [7.7, 13.4, 15.3, 19.2, 111.5, 384.0] },
], Object.assign({ x: M, y: 1.5, w: 8.6, h: 5.1, barDir: "bar",
  chartColors: [BLUE], barGapWidthPct: 80,
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: INK, dataLabelFontSize: 10,
  dataLabelFormatCode: '"$"0.0"K"', showLegend: false,
  valAxisLabelFormatCode: '"$"0"K"',
}, axisQuiet));
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

/* ==================== 11 · FORECAST & COVERAGE ==================== */
s = pres.addSlide();
eyebrow(s, "Forward view — Phase 2 model, Base scenario");
slideTitle(s, "Forecast revenue & work coverage, Jul 2026 – Dec 2027");
const M18 = ["Jul 26", "Aug 26", "Sep 26", "Oct 26", "Nov 26", "Dec 26", "Jan 27", "Feb 27", "Mar 27",
  "Apr 27", "May 27", "Jun 27", "Jul 27", "Aug 27", "Sep 27", "Oct 27", "Nov 27", "Dec 27"];
const FCST = [128.5, 132.3, 136.1, 154.0, 158.3, 162.7, 182.4, 187.3, 192.3, 197.3, 202.4, 219.3,
  219.3, 219.3, 219.3, 219.3, 219.3, 219.3];
const JOBS = [[32.1, 5], [212.5, 17], [59.2, 3], [4.9, 2], [71.8, 1], [15.0, 1], [1.8, 3], [106.2, 13], [193.3, 15]];
const BIDS = [[100, 0.50, 2, 6], [160, 0.50, 4, 12], [290, 0.50, 4, 12], [1350, 0.50, 5, 18], [276, 0.67, 4, 12]];
const backlog = new Array(18).fill(0);
JOBS.forEach(([rem, end]) => { const m = rem / (end + 1); for (let i = 0; i <= end && i < 18; i++) backlog[i] += m; });
const pipe = new Array(18).fill(0);
BIDS.forEach(([val, p, st, dur]) => { const m = val * p / dur; for (let i = st; i < Math.min(st + dur, 18); i++) pipe[i] += m; });
const r1 = v => Math.round(v * 10) / 10;
s.addChart([
  { type: "area", data: [
      { name: "Booked backlog", labels: M18, values: backlog.map(r1) },
      { name: "Weighted pipeline", labels: M18, values: pipe.map(r1) },
    ], options: { chartColors: [BLUE2, BLUE3], barGrouping: "stacked" } },
  { type: "line", data: [{ name: "Forecast (Base)", labels: M18, values: FCST }],
    options: { chartColors: [BLUE], lineSize: 3, lineDataSymbol: "none" } },
], Object.assign({ x: M, y: 1.5, w: 8.6, h: 5.1,
  showLegend: true, legendPos: "b", legendColor: INK2, legendFontSize: 11,
  valAxisMinVal: 0, valAxisMaxVal: 250, valAxisLabelFormatCode: '"$"0"K"',
  catAxisLabelFrequency: 3,
}, axisQuiet));
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
const NOTE = [3436.6, 3508.0, 3526.7, 3541.8, 3570.6, 3574.6, 3574.3, 3587.9, 3574.2, 3555.7,
  3532.2, 3503.6, 3486.3, 3443.5, 3400.6, 3357.6, 3314.6, 3271.5, 3228.3];
const NM19 = ["Jun 26"].concat(M18);
s.addChart("line", [
  { name: "Parent-note balance ($K)", labels: NM19, values: NOTE },
], Object.assign({ x: M, y: 1.5, w: 8.6, h: 5.1,
  chartColors: [BLUE], lineSize: 3, lineDataSymbol: "none", lineSmooth: false,
  showLegend: false, valAxisMinVal: 3100, valAxisMaxVal: 3700,
  valAxisLabelFormatCode: '"$"#,##0"K"', catAxisLabelFrequency: 3,
}, axisQuiet));
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

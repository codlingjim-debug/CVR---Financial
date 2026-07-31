// Hiring one-pager — John Opsatnic, VP of EPC Project Development
// Output: hiring/CVR_Hire_OnePager_Opsatnic.docx  (single page)
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, VerticalAlign, ShadingType,
  convertInchesToTwip,
} = require("docx");
const fs = require("fs");

const INK = "0B0B0B", INK2 = "52514E", BLUE = "1F5FA8", GREEN = "6E9A28",
  MUTED = "898781", GRID = "D9D8D2", WASH = "EAF1FA", CARD = "F5F5F2";
const FONT = "Calibri";

const t = (text, o = {}) => new TextRun(Object.assign({ text, font: FONT, size: 18, color: INK }, o));
const para = (children, o = {}) => new Paragraph(Object.assign({ children }, o));

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const hairline = { style: BorderStyle.SINGLE, size: 4, color: GRID };
const cellBorders = { top: hairline, bottom: hairline, left: noBorder, right: noBorder };

const cell = (children, o = {}) => new TableCell({
  children, verticalAlign: VerticalAlign.CENTER,
  borders: cellBorders,
  shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill } : undefined,
  margins: { top: 50, bottom: 50, left: 90, right: 90 },
  width: o.width ? { size: o.width, type: WidthType.PERCENTAGE } : undefined,
});

const hcell = (text, width) => cell(
  [para([t(text, { bold: true, size: 17, color: INK2 })])], { width, fill: CARD });

// Account | Capital program | Relationship & entry
const ACCOUNTS = [
  ["AEP", "~$78B 5-yr plan (raised May-26)",
   "Long-standing relationship — John and Jim — directly with AEP's EPC group."],
  ["Duke Energy", "$103B 5-yr — largest regulated-utility plan in the U.S.",
   "Strong relationship with the Director of Transmission Asset Management and procurement. John led the recent EOC 5-year pursuit / MSA."],
  ["Southern Company", "$81B 5-yr plan (raised Feb-26)",
   "John and Jim both carry long delivery history with Alabama Power and Georgia Power."],
  ["PG&E", "$73B 2026–30 plan",
   "VP-level relationships. Pursue pure engineering or EPCM / engineering mix — no short-term self-perform construction exposure."],
  ["Xcel Energy", "$70B+ through 2030 (raised Jul-26)",
   "Xcel's VP of Procurement delivered EPC alongside Jim at Arcadis and knows John and Jim well."],
  ["Dominion Energy", "$65B 2026–30 — 45% transmission & distribution",
   "Deep working ties across Dominion's transmission PM organization."],
  ["NextEra / FPL", "FPL $12–13B capex in 2026 alone",
   "John lives a mile from NextEra HQ — deep, local, executive relationships."],
  ["Arizona Public Service", "$10B+ 2025–28; $6B transmission through 2035",
   "Key Director-level relationships."],
  ["Santee Cooper", "State-owned; major generation + transmission build ahead",
   "Scott Smith (ex-AEP) is a board advisor — a 30+ year friendship with John."],
];

const doc = new Document({
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 620, bottom: 560, left: 900, right: 900 },
      },
    },
    children: [
      // masthead
      para([
        t("— ", { bold: true, size: 17, color: GREEN }),
        t("CVR ENGINEERING · CONFIDENTIAL HIRING RECOMMENDATION · JULY 2026", { bold: true, size: 17, color: INK2 }),
      ], { spacing: { after: 60 } }),
      para([t("John Opsatnic — VP, EPC Project Development", { bold: true, size: 40 })],
        { spacing: { after: 40 } }),
      para([
        t("One senior hire to convert a national, executive-level relationship network into EPC awards for the consolidated CVR + HWC offering.", { size: 20, color: INK2 }),
      ], { spacing: { after: 130 } }),

      // why now — three tight lines
      para([t("WHY THIS ROLE, NOW", { bold: true, size: 17, color: BLUE })], { spacing: { after: 50 } }),
      para([
        t("The model pays CVR twice.  ", { bold: true }),
        t("Every EPC dollar won returns ~12.5% to CVR — 8% pull-through engineering plus 4.6% captured material margin. At a $150M/yr run-rate that is ~$18.8M of managed revenue and ~$7.6M of operating income."),
      ], { spacing: { after: 60 } }),
      para([
        t("The ladder is relationship-limited, not capability-limited.  ", { bold: true }),
        t("CVR and HWC can engineer, procure, and build the work today. Winning it is the gate — and the accounts below are already warm."),
      ], { spacing: { after: 60 } }),
      para([
        t("Project development, not sales.  ", { bold: true }),
        t("The title matches the job: qualifying pursuits, shaping programs with owners, and carrying them to award — accountable for booked EPC wins."),
      ], { spacing: { after: 130 } }),

      // account table
      para([t("THE TARGET ACCOUNTS — WHERE JOHN'S NETWORK LANDS", { bold: true, size: 17, color: BLUE })],
        { spacing: { after: 60 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [hcell("Account", 16), hcell("Capital program", 27), hcell("Relationship & entry", 57)], tableHeader: true }),
          ...ACCOUNTS.map(([a, c, r]) => new TableRow({
            children: [
              cell([para([t(a, { bold: true })])]),
              cell([para([t(c, { size: 17, color: INK2 })])]),
              cell([para([t(r, { size: 17 })])]),
            ],
          })),
        ],
      }),
      para([
        t("≈$475B in disclosed capital programs across these nine accounts (FPL counted at 2026 capex only). ", { size: 16, color: MUTED }),
        t("Sources: latest company capital-plan disclosures, Q4-2025 – Q2-2026 earnings and filings.", { size: 16, color: MUTED, italics: true }),
      ], { spacing: { before: 60, after: 130 } }),

      // the ask band
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [new TableRow({
          children: [new TableCell({
            children: [
              para([
                t("The ask:  ", { bold: true, color: BLUE, size: 20 }),
                t("approve the hire at ~$400K/yr all-in (base + incentive + travel). ", { bold: true, size: 20 }),
                t("One mid-size EPC award (~$3.45M) returns ~$0.43M to CVR — the role pays back in year one. Full economics: CVR_Model_Phase2_Forecast.xlsx, 'EPC At-Scale Model' tab.", { size: 19, color: INK2 }),
              ], { spacing: { after: 0 } }),
            ],
            borders: { top: { style: BorderStyle.SINGLE, size: 8, color: BLUE }, bottom: { style: BorderStyle.SINGLE, size: 8, color: BLUE },
              left: { style: BorderStyle.SINGLE, size: 8, color: BLUE }, right: { style: BorderStyle.SINGLE, size: 8, color: BLUE } },
            shading: { type: ShadingType.CLEAR, fill: WASH },
            margins: { top: 110, bottom: 110, left: 160, right: 160 },
          })],
        })],
      }),
      para([
        t("Prepared by Jim Codling, SVP Engineering · relationship notes are CVR-internal account intel — not for external distribution.", { size: 15, color: MUTED }),
      ], { spacing: { before: 90, after: 0 } }),
    ],
  }],
});

fs.mkdirSync("hiring", { recursive: true });
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("hiring/CVR_Hire_OnePager_Opsatnic.docx", buf);
  console.log("wrote hiring/CVR_Hire_OnePager_Opsatnic.docx");
});

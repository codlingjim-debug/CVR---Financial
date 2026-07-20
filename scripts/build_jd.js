// Senior Project Manager job description — CVR Engineering
// Output: hiring/CVR_Senior_PM_Job_Description.docx
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  LevelFormat, convertInchesToTwip, BorderStyle,
} = require("docx");
const fs = require("fs");

const INK = "0B0B0B", INK2 = "52514E", BLUE = "1F5FA8", GREEN = "6E9A28", MUTED = "898781";
const FONT = "Calibri";

const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: FONT, size: opts.size || 22, color: opts.color || INK,
    bold: opts.bold, italics: opts.italics })],
  spacing: { after: opts.after == null ? 120 : opts.after, before: opts.before || 0 },
  alignment: opts.align,
});
const runs = (parts, opts = {}) => new Paragraph({
  children: parts.map(([text, o]) => new TextRun(Object.assign({ text, font: FONT, size: 22, color: INK }, o))),
  spacing: { after: opts.after == null ? 120 : opts.after },
});
const h = (text) => new Paragraph({
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: BLUE })],
  spacing: { before: 280, after: 120 },
});
const bullet = (text, ref = "jd-bullets") => new Paragraph({
  children: [new TextRun({ text, font: FONT, size: 22, color: INK })],
  numbering: { reference: ref, level: 0 },
  spacing: { after: 80 },
});

const doc = new Document({
  numbering: {
    config: [{
      reference: "jd-bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: convertInchesToTwip(0.32), hanging: convertInchesToTwip(0.18) } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, bottom: 1080, left: 1260, right: 1260 },
      },
    },
    children: [
      // masthead
      new Paragraph({
        children: [
          new TextRun({ text: "— ", font: FONT, size: 20, bold: true, color: GREEN }),
          new TextRun({ text: "CVR ENGINEERING · UTILITY SUPPLY & CONSTRUCTION", font: FONT, size: 20,
            bold: true, color: INK2 }),
        ],
        spacing: { after: 60 },
      }),
      new Paragraph({
        children: [new TextRun({ text: "Senior Project Manager", font: FONT, size: 48, bold: true, color: INK })],
        spacing: { after: 80 },
      }),
      p("Full-time · Reports to the VP of Engineering · Michigan (Reed City / Grand Rapids area) preferred; remote candidates in the Midwest considered, with regular travel to project sites and client offices.",
        { color: INK2, after: 40 }),
      new Paragraph({
        children: [new TextRun({ text: "", size: 2 })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D9D8D2" } },
        spacing: { after: 160 },
      }),

      h("About CVR Engineering"),
      p("CVR Engineering is the engineering arm of the Utility Supply & Construction / Hydaker-Wheatlake family of companies — builders of power lines since 1924. We deliver substation, distribution, and transmission engineering for investor-owned utilities, cooperatives, and municipals across the Midwest, and we increasingly deliver it as part of a consolidated EPC offering: engineering, material supply, and construction sold and executed together, with single-point accountability to the utility. We are a small, senior team in a growth phase, and the work is expanding faster than our project-management capacity."),

      h("The role"),
      p("You will own project delivery across CVR's engineering portfolio — currently a dozen-plus active projects spanning substation protection and control, distribution conversions, line-sensor and pole programs, joint-use assessments, and the engineering scope inside multi-million-dollar EPC projects executed with our construction affiliate. Today that portfolio is managed by our VP of Engineering on top of his leadership role; you will take it over, professionalize it, and free our technical leadership to focus on clients and growth. This is a hands-on senior role: you will run projects yourself, install the project-management discipline the portfolio needs, and be the delivery backbone for our EPC pursuits — including the bid-phase schedules and estimates that fixed-price EPC work demands."),

      h("What you'll do"),
      bullet("Own scope, schedule, budget, and margin across the active CVR project portfolio, from purchase order through closeout."),
      bullet("Run the weekly project scorecard: percent complete, cost variance, plan margin, billing status — and act on what it shows."),
      bullet("Serve as the day-to-day client interface for project delivery with utility project managers, engineers, and construction coordinators."),
      bullet("Build and maintain project schedules (Primavera P6 / MS Project / Smartsheet) for both engineering-only and EPC-integrated projects."),
      bullet("Support EPC pursuits: bid schedules, engineering level-of-effort estimates, and constructability-aligned execution plans developed jointly with Estimating."),
      bullet("Protect margin: catch scope creep, drive change orders, keep rework and cost variance visible early rather than at closeout."),
      bullet("Own billing hygiene with accounting — timely invoicing against milestones, unbilled work surfaced monthly, receivables followed up."),
      bullet("Coordinate engineering, design, estimating, and construction handoffs so the winning estimate becomes the budget the project actually runs on."),
      bullet("Mentor engineers and designers in project-management fundamentals, and raise the team's forecasting and reporting quality."),
      bullet("Feed the monthly operating rhythm: actuals versus forecast, backlog burn, and pipeline coverage reporting to leadership."),

      h("What you'll bring — required"),
      bullet("7+ years of progressive project management and/or project controls experience on utility transmission, distribution, or substation programs."),
      bullet("PMP certification (or equivalent demonstrated mastery with certification within 12 months)."),
      bullet("Hands-on scheduling depth in Primavera P6 and at least one of MS Project or Smartsheet — you build and maintain schedules yourself."),
      bullet("Experience managing a multi-project portfolio in the millions of dollars, including budget ownership, forecasting, and variance reporting."),
      bullet("A client-facing track record with utility organizations — you are comfortable being the accountable face of delivery."),
      bullet("Financial fluency: earned value, cost-to-complete, margin analysis, and change management."),

      h("What you'll bring — preferred"),
      bullet("Joint-use program experience (attachment review, make-ready, audits) — a live and growing part of our portfolio."),
      bullet("EPC or design-build delivery experience, especially where engineering and construction sit under one roof."),
      bullet("Distribution program experience: conversions, reconductoring, pole programs, grid hardening."),
      bullet("Project controls background — you have been the scheduler and analyst, not just consumed their output."),
      bullet("Process-improvement experience: standing up PM tools, SOPs, and reporting across an organization (ISO-aligned a plus)."),
      bullet("Exposure to generation, startup/commissioning, or outage environments."),

      h("How success is measured"),
      bullet("On-time engineering deliverables against construction-driven schedules."),
      bullet("Plan margin held at closeout — cost variance caught early and managed, not discovered."),
      bullet("Billing timeliness and reduced unbilled work in progress."),
      bullet("A scorecard and forecast leadership trusts without re-checking."),
      bullet("VP-level engineering time measurably redirected from project administration to clients and growth."),

      h("Compensation & benefits"),
      p("Salary range: [$___,___ – $___,___] depending on experience, plus participation in the company bonus program. Benefits include medical, dental, vision, and prescription coverage; 401(k) and company retirement programs; paid vacation and holidays; company-paid life insurance; voluntary disability and accident coverage; tuition reimbursement; and a mileage reimbursement program."),

      h("How to apply"),
      p("Send a resume to [contact email]. We review every application and respond to all candidates."),

      new Paragraph({
        children: [new TextRun({
          text: "Utility Supply & Construction Company is an equal opportunity employer. All qualified applicants will receive consideration for employment without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, disability, or protected veteran status.",
          font: FONT, size: 18, color: MUTED, italics: true })],
        spacing: { before: 200, after: 0 },
      }),
    ],
  }],
});

fs.mkdirSync("hiring", { recursive: true });
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("hiring/CVR_Senior_PM_Job_Description.docx", buf);
  console.log("wrote hiring/CVR_Senior_PM_Job_Description.docx");
});

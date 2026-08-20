// Classification job descriptions — CVR Engineering (USC/CVR house format,
// matching build_jd.js / the Senior PM JD).
// Output: hiring/JDs/CVR_JD_<Role>.docx  (one per classification)
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat,
  convertInchesToTwip,
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
const h = (text) => new Paragraph({
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: BLUE })],
  spacing: { before: 260, after: 110 },
});
const bullet = (text) => new Paragraph({
  children: [new TextRun({ text, font: FONT, size: 22, color: INK })],
  numbering: { reference: "jd-bullets", level: 0 },
  spacing: { after: 70 },
});

const ABOUT =
  "CVR Engineering is the utility engineering division of Utility Supply and Construction Company " +
  "(USC) and The Hydaker-Wheatlake Company (HWC) — Builders of Power Lines since 1924. We deliver " +
  "substation, transmission, and distribution engineering for investor-owned and cooperative " +
  "utilities across the Midwest, and we pair our engineering with HWC construction and Power Line " +
  "Supply procurement to deliver complete EPC programs. Our integrated capital-delivery model puts " +
  "engineering at the center of estimating, procurement, and project delivery.";

const OFFER =
  "Salary range: [$___,___ – $___,___] depending on experience, plus participation in the company " +
  "bonus program. Benefits include medical, dental, vision, and prescription coverage; 401(k) and " +
  "company retirement programs; paid vacation and holidays; company-paid life insurance; voluntary " +
  "disability and accident coverage; tuition reimbursement; and a mileage reimbursement program.";

const EEO =
  "Utility Supply and Construction Company is an equal opportunity employer. All qualified " +
  "applicants will receive consideration for employment without regard to race, color, religion, " +
  "sex, sexual orientation, gender identity, national origin, disability, or protected veteran status.";

// ---------------------------------------------------------------- role data --
// name, years line, licensure line, summary, duties[], required[], preferred[]
const ROLES = [
  {
    file: "Principal_Engineer",
    title: "Principal Engineer",
    summary: "Senior-most technical authority for CVR Engineering: Engineer of Record on our most complex substation and transmission programs, owner of design standards and technical governance, and mentor to the engineering staff.",
    duties: [
      "Serve as Engineer of Record: own design integrity, seal deliverables, and lead engineer-verified procurement content on assigned programs.",
      "Set and maintain CVR design criteria, standards, and QA/QC review gates across substation, transmission, and distribution work.",
      "Lead the technical basis for estimates and EPC pursuits with Estimating and HWC Construction — constructability, quantities, and production assumptions.",
      "Perform and direct complex studies and designs (protection & control, substation physical, line design) to 30/60/90/IFC.",
      "Represent CVR technically with utility clients (CenterPoint, DTE, Consumers, MEC and new accounts) at the director/principal level.",
      "Mentor engineers and designers; lead technical development and licensure progression across the team.",
    ],
    required: [
      "15+ years of progressive utility power engineering experience (substation, transmission, and/or distribution).",
      "Licensed Professional Engineer (PE); Michigan licensure or the ability to obtain by comity within 6 months. Multi-state licensure supporting our expansion states is strongly valued.",
      "Bachelor of Science in Electrical or Civil Engineering from an ABET-accredited program.",
      "Demonstrated Engineer-of-Record experience sealing utility designs for investor-owned or cooperative utilities.",
      "Deep working command of NESC, IEEE, and utility design standards, and of design tools appropriate to discipline (CAD, protection, line design).",
    ],
    preferred: [
      "EPC or design-build delivery experience where engineering, procurement, and construction sit under one roof.",
      "Experience standing up or governing design standards, review gates, and engineering quality programs.",
      "Existing relationships within our anchor utility client base.",
    ],
  },
  {
    file: "Senior_Engineer",
    title: "Senior Engineer",
    summary: "Lead engineer on major projects and programs — independently directs design packages from scoping through IFC, supervises project engineering teams, and is Engineer-of-Record capable.",
    duties: [
      "Lead complete design packages (substation, transmission, or distribution) from scoping and 30% through IFC and record drawings.",
      "Direct the work of engineers and designers on assigned projects; check and back-check design deliverables.",
      "Own the engineering basis for estimates on assigned pursuits; support constructability reviews with HWC.",
      "Prepare engineer-verified material transmittals and support procurement and expediting through Power Line Supply.",
      "Manage client technical relationships at the project level; run design review meetings.",
      "Support construction: RFIs, field changes, outage and energization support, closeout documentation.",
    ],
    required: [
      "10+ years of utility power engineering experience with increasing design leadership.",
      "Licensed Professional Engineer (PE), or the ability to obtain licensure by comity within 6 months.",
      "Bachelor of Science in Engineering from an ABET-accredited program.",
      "Independent command of applicable codes and standards (NESC, IEEE, RUS as applicable) and discipline design tools.",
      "Track record of delivering complete design packages on schedule and budget for utility clients.",
    ],
    preferred: [
      "EPC-paired delivery experience; familiarity with estimating and unit-cost development.",
      "Multi-state PE licensure.",
      "Mentoring or supervisory experience.",
    ],
  },
  {
    file: "Engineer_IV",
    title: "Engineer IV",
    summary: "Fully independent project engineer for complex assignments — executes and checks advanced designs, guides junior engineers, and carries PE-level responsibility on assigned scopes.",
    duties: [
      "Execute complex substation, transmission, or distribution designs with minimal oversight, from concept through IFC.",
      "Check the work of junior engineers and designers; enforce CVR design standards and QA/QC gates.",
      "Develop the engineering basis, quantities, and technical requirements for estimates and material transmittals.",
      "Interface directly with utility client engineering staff on technical issues.",
      "Support construction with RFI responses, design clarifications, and field engineering.",
      "Contribute to standards development and process improvement.",
    ],
    required: [
      "8+ years of utility power engineering experience.",
      "Licensed Professional Engineer (PE), or licensure examination scheduled with licensure expected within 12 months.",
      "Bachelor of Science in Engineering from an ABET-accredited program.",
      "Proficiency in discipline design tools and applicable codes and standards (NESC, IEEE).",
    ],
    preferred: [
      "Experience across more than one discipline (substation physical, P&C, line design, distribution).",
      "Estimating or construction-support experience on EPC work.",
    ],
  },
  {
    file: "Engineer_III",
    title: "Engineer III",
    summary: "Experienced project engineer — independently executes standard design packages, leads smaller projects end-to-end, and is on the path to professional licensure and design leadership.",
    duties: [
      "Execute substation, transmission, or distribution design packages with limited oversight.",
      "Lead smaller projects end-to-end: scope, schedule inputs, design, transmittals, and closeout.",
      "Develop quantities and technical content for estimates and engineer-verified procurement.",
      "Coordinate with designers on drawing production; perform design checks.",
      "Support construction with RFIs and field engineering as assigned.",
    ],
    required: [
      "5+ years of utility power engineering experience.",
      "Engineer in Training (EIT/FE) certification; PE licensure expected within 18 months (PE already in hand strongly preferred).",
      "Bachelor of Science in Engineering from an ABET-accredited program.",
      "Working command of NESC and discipline design tools.",
    ],
    preferred: [
      "Client-facing project experience with investor-owned or cooperative utilities.",
      "Exposure to estimating, procurement, or construction support.",
    ],
  },
  {
    file: "Engineer_II",
    title: "Engineer II",
    summary: "Developing engineer — executes defined design tasks and growing scopes under the direction of senior engineers, building toward independent project delivery.",
    duties: [
      "Perform design calculations, studies, and drawing development for substation, transmission, and distribution projects under senior direction.",
      "Prepare material lists, quantities, and inputs to estimates and transmittals.",
      "Participate in design reviews; incorporate check comments and maintain design quality.",
      "Support field walk-downs, data collection, and construction support tasks.",
      "Build proficiency in CVR standards, tools, and the integrated capital-delivery process.",
    ],
    required: [
      "2+ years of engineering experience (utility power experience preferred).",
      "Engineer in Training (EIT/FE) certification.",
      "Bachelor of Science in Engineering from an ABET-accredited program.",
      "Foundation in electrical power or structural fundamentals appropriate to discipline.",
    ],
    preferred: [
      "Utility internship or co-op experience.",
      "Exposure to CAD/design tools used in utility practice.",
    ],
  },
  {
    file: "Engineer_I",
    title: "Engineer I",
    summary: "Entry-level engineer — learns utility design practice through structured assignments under direct supervision, with a defined path through EIT to licensure.",
    duties: [
      "Perform assigned calculations, drawing mark-ups, data collection, and design support tasks under direct supervision.",
      "Develop working knowledge of NESC, CVR design standards, and discipline design tools.",
      "Support field visits, as-built verification, and record documentation.",
      "Assist with material lists and estimate inputs.",
      "Progress through the CVR engineer development plan toward independent design work.",
    ],
    required: [
      "0–2 years of engineering experience.",
      "Engineer in Training (EIT/FE) certification, or FE examination passed/scheduled within 12 months of hire.",
      "Bachelor of Science in Engineering from an ABET-accredited program.",
    ],
    preferred: [
      "Utility, T&D, or construction internship experience.",
      "Interest in substation, transmission, or distribution specialization.",
    ],
  },
  {
    file: "Senior_Designer",
    title: "Senior Designer",
    summary: "Lead design/drafting professional — owns drawing production standards, produces the most complex design packages, and mentors the designer and technician staff.",
    duties: [
      "Produce and check complex substation physical, protection & control, and line design drawing packages.",
      "Own CAD standards, drawing templates, and production workflows across the division.",
      "Translate engineering direction into complete, construction-ready drawing sets.",
      "Mentor designers and graphics technicians; manage drawing production schedules and quality.",
      "Support as-built and record drawing programs across active jobs.",
    ],
    required: [
      "10+ years of design/drafting experience in utility power (substation, transmission, or distribution).",
      "Expert proficiency in AutoCAD and/or MicroStation; working knowledge of utility drawing standards.",
      "Demonstrated production leadership: checking, standards ownership, and mentoring.",
      "Associate degree or technical certification in drafting/design technology, or equivalent experience.",
    ],
    preferred: [
      "PLS-CADD, Inventor, or 3D substation modeling experience.",
      "Experience supporting EPC or design-build delivery.",
    ],
    noLicense: true,
  },
  {
    file: "Designer_II",
    title: "Designer II",
    summary: "Experienced designer — independently produces substation, transmission, and distribution drawing packages from engineering direction, and checks the work of junior staff.",
    duties: [
      "Produce substation physical, wiring/P&C, and line design drawings from engineering mark-ups and models.",
      "Maintain drawing quality to CVR CAD standards; perform back-checks.",
      "Assemble IFC packages, transmittals, and record drawing sets.",
      "Coordinate directly with engineers on design intent and constructability.",
      "Support material take-offs and bill-of-material development.",
    ],
    required: [
      "3+ years of utility design/drafting experience.",
      "Proficiency in AutoCAD and/or MicroStation.",
      "Working knowledge of utility drawing conventions and deliverable standards.",
      "Associate degree or technical certification in drafting/design technology, or equivalent experience.",
    ],
    preferred: [
      "Substation physical or P&C drawing specialization.",
      "GIS or PLS-CADD exposure.",
    ],
    noLicense: true,
  },
  {
    file: "Transmission_Designer",
    title: "Transmission Designer",
    summary: "Line design specialist — develops transmission and distribution line designs, structure spotting, and staking packages in PLS-CADD under engineering direction, supporting our growing T-line and pole-program workload.",
    duties: [
      "Develop line designs in PLS-CADD: alignments, structure spotting, sag-tension, and clearance checks under engineering direction.",
      "Produce staking sheets, framing details, and construction packages for pole replacement and conversion programs.",
      "Support field data collection, LiDAR/survey integration, and as-built verification.",
      "Prepare structure lists, material take-offs, and bill-of-material inputs for estimates and procurement.",
      "Coordinate with engineers and HWC construction on constructability and framing standards.",
    ],
    required: [
      "0–3 years of line design or utility design experience (2+ years preferred).",
      "PLS-CADD proficiency, or demonstrated aptitude with training commitment in the first 6 months.",
      "Proficiency in AutoCAD and/or MicroStation.",
      "Associate degree or technical certification in drafting/design technology, or equivalent experience.",
    ],
    preferred: [
      "Distribution pole-line design, joint-use, or make-ready experience.",
      "Familiarity with NESC clearances and loading districts.",
      "GIS experience.",
    ],
    noLicense: true,
  },
  {
    file: "Graphics_Technician",
    title: "Graphics Technician",
    summary: "Entry-level CAD professional — produces drawings, record prints, and drawing-management support across active jobs while building toward a designer role.",
    duties: [
      "Draft and revise drawings from engineer and designer mark-ups in AutoCAD/MicroStation.",
      "Produce record prints and closeout drawing sets for completed jobs.",
      "Maintain drawing files, title blocks, and transmittal logs to CVR standards.",
      "Support scanning, conversion, and drawing-management tasks across the division.",
      "Build proficiency toward the Designer career path.",
    ],
    required: [
      "0–2 years of CAD/drafting experience.",
      "Working proficiency in AutoCAD (MicroStation a plus).",
      "High school diploma plus drafting coursework or technical certification, or equivalent experience.",
    ],
    preferred: [
      "Interest in utility/T&D design as a career path.",
      "Exposure to GIS or document management systems.",
    ],
    noLicense: true,
  },
];

// ---------------------------------------------------------------- builder ---
function buildDoc(role) {
  const kids = [
    new Paragraph({
      children: [
        new TextRun({ text: "— ", font: FONT, size: 20, bold: true, color: GREEN }),
        new TextRun({ text: "CVR ENGINEERING · UTILITY SUPPLY & CONSTRUCTION", font: FONT, size: 20,
          bold: true, color: INK2 }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: role.title, font: FONT, size: 44, bold: true, color: INK })],
      spacing: { after: 60 },
    }),
    p("Full-time · Reed City / Traverse City, MI (per assignment) · Reports to the SVP of Engineering or designee", { size: 20, color: INK2, after: 160 }),
    p(role.summary, { after: 160 }),
    h("About CVR Engineering"),
    p(ABOUT),
    h("What you'll do"),
    ...role.duties.map(bullet),
    h("What you'll bring — required"),
    ...role.required.map(bullet),
    h("What you'll bring — preferred"),
    ...role.preferred.map(bullet),
    h("What we offer"),
    p(OFFER),
    h("Equal opportunity"),
    p(EEO, { size: 20 }),
    p("To apply, contact [__________] or apply at uscco.com/careers. Reference: CVR Engineering — " + role.title + ".",
      { size: 20, color: MUTED, before: 160 }),
  ];
  return new Document({
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
        page: { size: { width: 12240, height: 15840 },
          margin: { top: 1000, bottom: 1000, left: 1260, right: 1260 } },
      },
      children: kids,
    }],
  });
}

fs.mkdirSync("hiring/JDs", { recursive: true });
(async () => {
  for (const role of ROLES) {
    const buf = await Packer.toBuffer(buildDoc(role));
    const out = `hiring/JDs/CVR_JD_${role.file}.docx`;
    fs.writeFileSync(out, buf);
    console.log("wrote", out);
  }
})();

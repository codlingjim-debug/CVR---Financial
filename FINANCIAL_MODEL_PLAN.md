# CVR Engineering — Financial Model Build Plan

**Audience:** CVR Engineering leadership and staff (USC / Hydaker-Wheatlake family of companies)
**Date:** July 2026
**Status:** Planning document — v3 (rate sheet and KPI report incorporated)

---

## 1. Purpose

Build a driver-based financial model for CVR Engineering that:

1. **Establishes a credible baseline** of what CVR costs and earns today — now quantified from the July 2026 KPI report (§3).
2. **Forecasts the path to margin contribution** across the integration arc: *support function → prime engineer → Engineer of Record / turnkey program support*.
3. **Tracks the division's business targets:**
   - Year-2 Sales goal: **$6,000,000**
   - Year-2 OILI (Operating Income Less Interest) return: **20%** (~$1.2M on $6M revenue)
4. Produces a **monthly operating P&L** in USC's format, rolling up to quarterly/annual views, with scenario and sensitivity capability.

The model serves two audiences: (a) CVR leadership's operating decisions (hiring, pricing, utilization, project mix), and (b) monthly reporting to USC leadership.

---

## 2. Source Documents

| Document | What it contributes | Status |
|---|---|---|
| USC Operating Income / OILI illustration | USC's exact P&L structure and the OILI metric definition | Reviewed |
| *CVR & Estimating Operations Org Chart* | Current roster and roles | Reviewed |
| *Integrated Utility Delivery* strategy one-pager | The CVR integration path that defines revenue phasing | Reviewed |
| **CVR Rate Sheet (effective Jan 2026)** — `data/CVR_Rate_Sheet_2026.pdf`, `data/cvr_rate_table_2026.csv` | Billing rates by classification; expense and markup policies | **Incorporated (§4)** |
| **CVR & EPC KPI report (week ending 7/11/2026)** — `data/CVR_EPC_KPI_2026-07-11.pdf` | YTD financials for both lines of business, utilization, work/customer mix, project scorecards, bid pipeline, win rates, AR | **Incorporated (§3)** |

### USC P&L format (from the OILI illustration)

```
Revenues → Cost of Sales (Labor, Subcontractor) → Gross Profit
→ Operating Expenses (Non-Chargeable Labor · Fringes · Travel · Insurance ·
  Licenses · Software · Hardware · Benefits · Retirement · USC Corporate
  Overhead Allocation) → Operating Income
→ Other (Income)/Expense (Interest) → Net Income

OILI = Operating Income − Interest Expense;  Return % = OILI ÷ Revenue (target 20%)
```

---

## 3. Baseline: What the July 2026 KPI Report Shows

This is the calibration data for the model — the numbers every forecast assumption must reconcile to.

### 3.1 Financial baseline (January–May 2026)

| | CVR (engineering) | HWC EPC |
|---|---|---|
| Revenue YTD | **$426.7K** vs $845.5K budget (50%) | **~$1.2M** (incl. negative months Mar/Apr — billing adjustments) |
| Gross Profit YTD | **$76.8K** vs $520.6K budget | — |
| Net Income YTD | **−$304.7K** vs +$58.1K budget | **−$2.1M** (−180% of revenue) |
| Monthly revenue range | $39K–$110K | −$321K to +$732K |

CVR is running at roughly half of budgeted revenue with two negative-gross-profit months (March −$15.7K, May −$18.0K). The EPC line's losses are an order of magnitude larger than CVR's — engineering's design-for-construction quality directly affects that outcome, which is why the model tracks both lines.

### 3.2 Utilization (2026 YTD)

- **Total billable utilization: 59.0%** against a ~75% median target
- 8,052 total hours: **4,747 billable (59%) · 2,896 non-billable (36%) · 405 bids (5%)**
- Wide spread by individual (33%–100%), with per-person targets ranging 42%–100% by role
- Bids + business development = 20% of non-billable time (182 BD hrs + 408 proposal hrs)

**Implied realization flag:** 4,747 billable hours against $426.7K revenue implies ~$90/hr realized — well below the blended rate card (~$130–150/hr for the current staff mix). Whether this is billing lag, write-offs, or internal work billed at reduced rates is a Phase-1 question with direct margin consequences.

### 3.3 Work and customer mix

- Design hours: **Substation 3,316 (71%) · Distribution 836 (18%) · Transmission 517 (11%)**
- Billable hours by customer: **CenterPoint ~3,317 (≈70%)**, Detroit Edison 738, Consumers 562, remainder small
- Customer concentration is real and quantified — the model's downside scenario must show CVR without its largest account

### 3.4 Project performance (scorecards, week of 7/11/2026)

- **CVR:** 13 active jobs, PO values $5.2K–$1.43M, plan margins **19.4%–43.9%**. Several jobs show significant cost overruns (worst cases exceeding −90% and −200% cost variance) — estimating accuracy and scope control are visible margin leaks
- **EPC:** 4 active substation jobs, PO values $4.3M–$6.6M, plan margins **12.7%–16.4%**, cost variances from +3.6% to −19.8%

### 3.5 Pipeline and win rate

- Pending bids: **~$2.18M CVR scope + ~$12.6M EPC scope** (Hoosier Energy ×2, Consumers pole program, Lansing BWL joint-use audit, Steuben REMC)
- On paired pursuits, engineering scope runs **~4–5% of the EPC job value** — a planning ratio the model uses to convert EPC pipeline into CVR revenue
- Win rate: **50% (2025) → 67% (2026 YTD)**
- Outstanding AR: $66.5K, predominantly CenterPoint

---

## 4. Rate Table (effective January 2026)

Machine-readable copy: `data/cvr_rate_table_2026.csv`

| Classification | Rate/hr | Classification | Rate/hr |
|---|---|---|---|
| Administrative Assistant | $59.62 | Engineer I | $112.27 |
| Graphics Technician | $76.14 | Engineer II | $138.09 |
| Designer I | $79.91 | Engineer III | $152.21 |
| Designer II | $95.70 | Engineer IV | $172.37 |
| Senior Designer | $105.01 | Senior Engineer | $241.57 |
| Project Manager | $159.86 | Principal Engineer | $360.72 |

Policies that carry into the model: travel time billed at full rates; **no overtime multipliers** (excess hours at standard rates); mileage at IRS rate; travel/living expenses at cost; subcontract work and other purchases at **cost + 10%** (a thin subcontractor margin — Stream mix matters).

---

## 5. Core Design: Three Revenue Streams

- **Stream 1 — EPC projects with HWC.** Engineering scope inside integrated EPC delivery. Calibration from the KPI report: engineering ≈ 4–5% of EPC contract value; EPC plan margins 12.7–16.4%; current EPC losses driven partly by cost variance that early, constructable design can reduce.
- **Stream 2 — Pure engineering projects.** Standalone billed work (the current CVR P&L): rate table × utilization × realization. Calibration: 59% utilization vs 75% target; ~$90/hr implied realization vs ~$130–150 rate card; plan margins 19–44%.
- **Stream 3 — Internal support / cost recovery.** Hours to USC/HWC at internal treatment; the legacy mode that hours migrate out of.

Every scenario is a statement about how fast hours shift across streams and at what realized rate.

### The gap to $6M, quantified

At a ~$140/hr blended realized rate, $6M ≈ **43,000 billable hours/year**. At the 75% utilization target (~1,560 billable hrs/FTE-yr), that's **~27 billable FTEs** — versus roughly 10–11 today producing an annualized ~$1.0M. The bridge therefore has four levers, all of which the model exposes explicitly:

1. **Utilization 59% → 75%** (≈ +27% capacity from the same team)
2. **Realization $90 → rate card** (fix leakage/lag identified in §3.2 — potentially +40–60% revenue on the same hours)
3. **Headcount growth** (hiring plan tab; sequenced against backlog)
4. **EPC engineering capture** (at 4–5% of EPC value, the current $12.6M EPC pipeline carries ~$500–600K of engineering; scaling EPC wins is a CVR revenue multiplier)

Levers 1 and 2 alone roughly double revenue with today's roster; the remainder must come from 3 and 4. This math frames the Base case.

---

## 6. Model Architecture (Workbook Structure)

| # | Tab | Contents |
|---|---|---|
| 1 | **Assumptions** | Global inputs: escalation, fringe/benefit load %, utilization targets by role (per-person targets from the KPI report), realization %, overhead allocation, interest, calendar |
| 2 | **Rates** | The §4 rate table, with per-stream realization adjustments and annual escalation |
| 3 | **Headcount & Labor** | Roster by person/role (org chart + KPI report names), rate band, start/end dates, hiring plan. Fully loaded cost per person-month |
| 4 | **Capacity & Utilization** | Available hours × chargeability by role → billable / non-billable / bids split (KPI report's three-way categorization). Non-chargeable labor flows to OpEx per USC format |
| 5 | **Revenue Build** | By stream: EPC-with-HWC (EPC pipeline × win rate × 4–5% engineering share), pure engineering (backlog burn from the scorecard's 13 active jobs + pipeline × 67% win rate), internal recovery. Top-down check: hours × realized rate |
| 6 | **Direct Costs** | Chargeable labor at loaded cost; subcontractors at cost +10%; Gross Profit by project and stream. Project-level plan-margin vs cost-variance tracking mirrors the scorecards |
| 7 | **Operating Expenses** | USC's line items; corporate overhead allocation as an explicit driver |
| 8 | **P&L (Monthly)** | USC-format P&L, 36 months, by stream + consolidated; Operating Income, OILI, Return % |
| 9 | **KPI Dashboard** | Reproduces and extends the existing KPI report so the team keeps one familiar scorecard: billable utilization vs target (total + per person), hours mix (billable/non-billable/bids), revenue/GP/net vs budget (monthly + YTD), project scorecard metrics (% complete, cost ±, plan margin, billed), win/loss rate, engineering-share-of-EPC, AR aging, BD/proposal hours |
| 10 | **Scenarios** | Base / Upside / Downside driving utilization, realization, win rate, stream mix, hiring pace. Downside includes a largest-customer-loss case (§3.3) |
| 11 | **Sensitivity** | OILI % vs utilization × realization; breakeven utilization; billable FTEs required for $6M at varying blended rates |
| 12 | **Actuals & Variance** | Monthly actuals in; forecast-vs-actual by stream — the monthly operating rhythm |

**Time horizon:** 36 months, monthly granularity.

---

## 7. Key Drivers (with baseline values)

| Driver | Baseline (July 2026) | Target / lever |
|---|---|---|
| Billable utilization | 59.0% | 75% median target |
| Realized rate | ~$90/hr implied | Rate card blend $130–150/hr |
| Billable headcount | ~10–11 | Hiring plan (model output) |
| Win rate | 67% (2026 YTD) | Hold/improve; more at-bats |
| Engineering share of EPC value | ~4–5% | Applied to EPC pipeline |
| Plan margin (pure engineering) | 19–44% by job | Protect via estimating accuracy |
| Cost variance discipline | Multiple jobs in overrun | Scorecard management |
| Subcontractor markup | Cost + 10% | Policy (thin; watch mix) |
| Overhead allocation | TBD from USC finance | Explicit model driver |

---

## 8. Data Still Needed from USC Finance

- [ ] CVR trailing-12-month actuals in USC P&L format (extend the 5 months in the KPI report)
- [ ] Actual salaries for the roster, and the standard fringe/benefit load % (to compute loaded cost against the §4 bill rates → per-role gross margin)
- [ ] USC Corporate Overhead Allocation methodology and CVR's current allocation
- [ ] Internal transfer-pricing treatment of CVR hours on USC/HWC jobs (explains the §3.2 realization gap)
- [ ] Interest expense basis for OILI
- [ ] Confirmation of the 2026 CVR budget behind the KPI report's budget lines ($845.5K revenue through May)

---

## 9. Build Phases

**Phase 0 — Data gathering (Week 1–2).** ✅ Rate sheet and KPI report in repo. Remaining: §8 finance items; interviews with Engineering and Estimating leadership on workload and pipeline.

**Phase 1 — Baseline (Week 2–3).** Tabs 1–4 plus a current-state monthly P&L reconciled to the KPI report's Jan–May actuals. First deliverable answers: where does the $90/hr realized rate come from, and what does each role earn at loaded cost vs bill rate?

**Phase 2 — Forecast engine (Week 3–5).** Revenue (5), direct cost (6), OpEx (7), segmented P&L (8). Wire in stream-shift logic, the 13-job backlog burn, pipeline × win rate, and the hiring plan.

**Phase 3 — Dashboard & scenarios (Week 5–6).** Tabs 9–11. Calibrate the Base case to the §5 gap math; document exactly which lever settings reach $6M / 20% OILI.

**Phase 4 — Validation & operating rhythm (Week 6–8).** Reconcile with USC finance on overhead/interest; establish the monthly actuals-in / forecast-out cadence owned by the team.

**Implementation:** build the workbook programmatically (Python + openpyxl) in this repository — version-controlled and regenerable, with the `.xlsx` as the distributed artifact.

---

## 10. Open Questions & Risks

1. **Realization gap** — ~$90/hr realized vs $130–150 rate card is the single largest unexplained number in the baseline; diagnosing it (lag vs write-off vs internal pricing) is Phase 1's first job.
2. **Customer concentration** — ~70% of billable hours from one customer; the downside scenario must be built and socialized.
3. **Cost-overrun discipline** — several active jobs carry major cost variance; estimating accuracy and scope-change capture are margin-protection projects the model will make visible monthly.
4. **EPC coupling** — CVR's health is tied to EPC's; negative-revenue months and −180% net margin on the EPC line will draw corporate attention, and engineering's constructability role is part of the fix. Intercompany pricing of engineering inside EPC jobs needs an explicit agreed treatment.
5. **Estimating org scope** — confirm whether Estimating Operations sits inside the CVR P&L or separately; the model tags people by group so the boundary can be toggled.
6. **Overhead allocation sensitivity** — a 20% OILI return is highly sensitive to the corporate allocation, especially if it scales with revenue.

---

## 11. Status

1. ~~Add the rate table and KPI report to the repository~~ ✅ (`data/`)
2. ~~Phase 1 baseline~~ ✅ — `model/CVR_Model_Phase1_Baseline.xlsx`, reconciled to the 6/30/26 GL statements (`PHASE1_BASELINE.md`)
3. ~~Phase 2 forecast engine~~ ✅ — `model/CVR_Model_Phase2_Forecast.xlsx`, driver-based Jul-26–Dec-27 with scenarios, cash/note roll-forward, and backlog/pipeline coverage (`PHASE2_FORECAST.md`)
4. Open: salary detail (person-level labor build), pipeline probabilities owned by Estimating, Phase 3 dashboard polish, Phase 4 monthly actuals rhythm starting with the July close.

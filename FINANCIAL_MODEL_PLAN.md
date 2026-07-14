# CVR Engineering — Financial Model Build Plan

**Audience:** CVR Engineering leadership and staff (USC / Hydaker-Wheatlake family of companies)
**Date:** July 2026
**Status:** Planning document — v2

---

## 1. Purpose

Build a driver-based financial model for CVR Engineering that:

1. **Establishes a credible baseline** of what CVR costs and earns today.
2. **Forecasts the path to margin contribution** across the integration arc: *support function → prime engineer → Engineer of Record / turnkey program support*.
3. **Tracks the division's business targets:**
   - Year-2 Sales goal: **$6,000,000**
   - Year-2 OILI (Operating Income Less Interest) return: **20%** (~$1.2M on $6M revenue)
4. Produces a **monthly operating P&L** in USC's format, rolling up to quarterly/annual views, with scenario and sensitivity capability.

The model serves two audiences: (a) CVR leadership's operating decisions (hiring, pricing, utilization, project mix), and (b) monthly reporting to USC leadership.

---

## 2. Source Documents

| Document | What it contributes to the model | Status |
|---|---|---|
| USC Operating Income / OILI illustration | USC's exact P&L structure and the OILI metric definition; the format CVR's numbers must report in | Reviewed |
| *CVR & Estimating Operations Org Chart* | Current roster (~21 people): VP Engineering, Engineers I–IV, Senior Engineer, Senior Designer, Graphics Technicians, plus the Estimating organization | Reviewed |
| *Integrated Utility Delivery* strategy one-pager | The CVR integration path (Current → Transition → Target) that defines the model's revenue phasing | Reviewed |
| **CVR Rate Table** | Billing rates by role/classification — feeds the Rates tab and every revenue calculation | **Pending — to be added to this repository** |
| **CVR KPI report (EPC w/ HWC + pure engineering)** | Historical KPIs by line of business — calibrates utilization, multiplier, and margin assumptions and defines the KPI dashboard | **Pending — to be added to this repository** |

### USC P&L format (from the OILI illustration)

```
Revenues
  Design Build / Engineering Sales
Cost of Sales
  Labor (chargeable)
  Subcontractor
Gross Profit
Operating Expenses
  Non-Chargeable Labor · Fringes · Travel · Insurance · Licenses
  Software · Hardware · Employee Benefits · Retirement Contributions
  USC Corporate Overhead Allocation
Operating Income
Other (Income)/Expense
  Gain on Sale of Assets · Interest Expense
Net Income

OILI = Operating Income − Interest Expense
Return % = OILI ÷ Revenue          (Year-2 target: 20%)
```

The model reproduces this format line-for-line so CVR's numbers drop straight into USC's reporting without translation.

---

## 3. Core Design: Three Revenue Streams

CVR's work falls into distinct lines of business with different economics, and the model keeps them separate end-to-end (revenue → direct cost → gross margin → KPIs):

- **Stream 1 — EPC projects with HWC.** Engineering scope delivered inside integrated EPC projects with Hydaker-Wheatlake Construction. Characterized by intercompany pricing, engineering as a fraction of a larger construction contract value, schedule coupling to construction, and design-for-construction efficiency (rework and change-order rates matter most here).
- **Stream 2 — Pure engineering projects.** Standalone engineering services billed directly to external clients (design, studies, Owner's-Engineer-type work, and eventually Engineer-of-Record programs). Classic professional-services economics: rate × utilization × realization.
- **Stream 3 — Internal support / cost recovery.** Hours delivered to USC construction and estimating at internal transfer treatment. This is the legacy mode; the strategy shifts hours from Stream 3 into Streams 1 and 2 over time.

Every forecast scenario is fundamentally a statement about **how fast hours and headcount shift across these streams, and at what realized rate** — the rate table and the historical KPIs by stream are the calibration inputs.

---

## 4. Model Architecture (Workbook Structure)

| # | Tab | Contents |
|---|---|---|
| 1 | **Assumptions** | All global inputs in one place: start dates, escalation %, fringe/benefit load %, utilization targets by role, overhead allocation %, interest assumptions, working-day calendar |
| 2 | **Rates** | The CVR rate table verbatim: rates by role/classification and by stream (EPC-with-HWC intercompany rates vs. pure-engineering external rates), with realization % and annual escalation |
| 3 | **Headcount & Labor** | Roster by person/role (seeded from the org chart), rate band, start/end dates, hiring plan rows. Computes fully loaded cost per person per month |
| 4 | **Capacity & Utilization** | Available hours per FTE per month × chargeability % by role → chargeable vs. non-chargeable hours. Non-chargeable hours flow to OpEx "Non-Chargeable Labor" exactly as USC's format expects |
| 5 | **Revenue Build** | Bottom-up by stream: (a) EPC-with-HWC backlog and probability-weighted pipeline; (b) pure-engineering backlog and pipeline; (c) internal recovery. Reconciles to a top-down check (chargeable hours × realized rate) |
| 6 | **Direct Costs** | Chargeable labor at loaded cost; subcontractor spend by project; Gross Profit by month, by project, and by stream |
| 7 | **Operating Expenses** | Line-item OpEx matching USC's umbrella list; USC Corporate Overhead Allocation as an explicit driver |
| 8 | **P&L (Monthly)** | Full USC-format P&L, monthly for 36 months, segmented by stream with a consolidated view; computes Operating Income, OILI, and Return % |
| 9 | **KPI Dashboard** | Divisional targets (Sales vs. $6M, OILI vs. 20%) plus the operational KPI set from the CVR KPI report, tracked by stream — expected to include utilization/chargeability, net labor multiplier, revenue per FTE, rework/change-order rate, on-time deliverable %, backlog months, win rate. Final KPI list locks in once the KPI report is incorporated |
| 10 | **Scenarios** | Base / Upside / Downside toggle driving utilization, rate, pipeline conversion, stream mix, and hiring pace |
| 11 | **Sensitivity** | One- and two-variable tables: OILI % vs. utilization × realized rate; breakeven utilization; revenue per FTE required to hit 20% |
| 12 | **Actuals & Variance** | Monthly actuals paste-in from USC accounting; forecast-vs-actual variance by stream, so this is a living operating tool the team runs every month |

**Time horizon:** 36 months, monthly granularity.

---

## 5. Key Drivers

1. **Billable headcount** — engineers/designers on the org chart plus the hiring plan.
2. **Chargeability (utilization) %** by role — the single biggest lever on margin.
3. **Realized rate** by role and stream — from the rate table, net of discounts/write-offs; intercompany EPC rates vs. external market rates.
4. **Loaded labor cost** — salary + fringes + benefits + retirement (per USC's OpEx categories).
5. **Stream mix** — the pace at which hours shift from internal support into EPC-with-HWC and pure-engineering work.
6. **Subcontractor mix and markup** — pass-through vs. margin-bearing.
7. **Pipeline conversion** — win rate and timing on external pursuits.
8. **USC corporate overhead allocation** — inside the OILI calculation and therefore modeled explicitly, never buried.
9. **Rework/change-order rate** — a quality driver with direct margin effect, especially on EPC-with-HWC work.

---

## 6. Data Needed

**From the two pending documents (to be added to this repository):**

- [ ] **CVR Rate Table** — rates by role/classification; confirm whether EPC-with-HWC work bills at the same schedule or an intercompany variant
- [ ] **CVR KPI report** — historical KPIs for EPC-with-HWC projects and pure-engineering projects; these become the baseline calibration and the dashboard definition

**From USC finance/accounting:**

- [ ] CVR trailing-12-month actuals in the USC P&L format, ideally split by the three streams
- [ ] Actual salaries/rates for the org-chart roster, and the standard fringe/benefit load %
- [ ] The USC Corporate Overhead Allocation methodology and CVR's current allocation
- [ ] Current internal transfer-pricing treatment of CVR hours charged to USC construction jobs
- [ ] Current backlog: active engineering commitments with remaining value and schedule, tagged by stream
- [ ] Pipeline list from Estimating/BD: pursuits, value, expected award dates, stream
- [ ] Interest expense basis (what debt/working-capital cost is charged to CVR for OILI)

Until actuals arrive, the model runs on placeholder assumptions clearly flagged as such.

---

## 7. Build Phases

**Phase 0 — Data gathering (Week 1–2).** Land the rate table and KPI report in this repository; issue the finance request list; interview Engineering and Estimating leadership on current workload, utilization reality, and pipeline.

**Phase 1 — Baseline (Week 2–3).** Build tabs 1–4 and a current-state monthly P&L, calibrated to the historical KPIs by stream. Deliverable: a quantified picture of what CVR costs today and where each stream's margin sits.

**Phase 2 — Forecast engine (Week 3–5).** Build revenue (tab 5), direct cost (6), OpEx (7), and the integrated segmented P&L (8). Wire in the stream-shift logic and the hiring plan.

**Phase 3 — Dashboard & scenarios (Week 5–6).** Tabs 9–11. Calibrate the Base case so the divisional targets ($6M / 20% OILI in Year 2) are achievable-but-stretch; document exactly which drivers must move to get there.

**Phase 4 — Validation & operating rhythm (Week 6–8).** Reconcile against actuals; walk the model with USC finance so overhead and interest treatments match their books; establish the monthly actuals-in / forecast-out cadence (tab 12) owned by the team.

**Implementation:** build the workbook programmatically (Python + openpyxl) in this repository so the model is version-controlled and regenerable, with the `.xlsx` as the distributed artifact.

---

## 8. Open Questions & Risks

1. **Revenue recognition for internal work** — does USC credit CVR revenue for hours on USC construction jobs today, or is CVR pure cost? Determines the Stream 3 treatment and how the baseline reads.
2. **Estimating org scope** — the org chart covers both CVR Engineering and Estimating Operations. Confirm whether Estimating is inside the CVR P&L or a separate cost center; the model tags people by group so either boundary can be toggled.
3. **Overhead allocation sensitivity** — a 20% OILI return is highly sensitive to the corporate allocation; if it scales with revenue, growth drags allocation up with it.
4. **Rate realism** — $6M Year-2 revenue on roughly a dozen billable staff implies ~$500K revenue per billable FTE; sanity-check against the rate table and achievable utilization in Phase 1, before committing the plan narrative.
5. **Intercompany pricing on EPC work** — margins on Stream 1 depend on how engineering is priced inside HWC EPC contracts; this needs an explicit, agreed treatment so stream margins are meaningful.
6. **Client concentration** — the upside case leans on a small number of utility relationships; scenarios should show the plan with and without the largest pursuit.

---

## 9. Immediate Next Steps

1. Add the CVR rate table and KPI report to this repository (a `data/` folder) so they can be wired into the Rates tab and KPI dashboard.
2. Confirm the §8 boundary questions (especially Estimating in/out).
3. Send the §6 finance data request.
4. Begin Phase 1 baseline build.

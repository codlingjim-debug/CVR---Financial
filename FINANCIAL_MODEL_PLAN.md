# CVR Engineering — Financial Model Build Plan

**Prepared for:** James Codling, PE, MBA — SVP of Engineering, Utility Supply & Construction Company (USC / Hydaker-Wheatlake)
**Date:** July 2026
**Status:** Planning document — v1

---

## 1. Purpose

Build a driver-based financial model for CVR Engineering that:

1. **Establishes a credible baseline** of what CVR costs and earns today (the "loss-leader" starting point).
2. **Forecasts the path to margin contribution** across the integration arc: *support function → prime engineer → Engineer of Record / turnkey program support*.
3. **Tracks directly against the incentive framework** already defined with USC leadership:
   - Year-2 Sales goal: **$6,000,000** (weighted 25% in STIC)
   - Year-2 OILI target: **20% return** (~$1.2M on $6M revenue; weighted 75% in STIC)
4. Produces a **monthly operating P&L** in USC's format, rolling up to quarterly/annual views, with scenario and sensitivity capability.

The model is the tool for three audiences: (a) Jim's own operating decisions (hiring, pricing, utilization), (b) monthly reporting to Brad Geer / USC leadership, and (c) STIC/LTIP performance tracking.

---

## 2. Source Documents Reviewed

| Document | What it contributes to the model |
|---|---|
| *J. Codling Comp Proposal and Op Income Illustration v2* | USC's exact P&L structure and the OILI metric definition; STIC payout mechanics (payout curve from 75% to 120% of target); Year-2 targets ($6M sales, 20% OILI) |
| *CVR & Estimating Operations Org Chart* | Current roster (~21 people): VP Engineering, Engineers I–IV, Senior Engineer, Senior Designer, Graphics Technicians, plus the Estimating organization (Director, Senior Estimators, Estimators, Assistant) |
| *Jim Codling offer letter (6/24/26)* | Compensation terms, performance measurements (cost/productivity/margin, on-time delivery, rework reduction), reporting line to President & COO |
| *Integrated Utility Delivery* strategy one-pager | The CVR integration path (Current → Transition → Target) that defines the model's revenue-mode phasing |
| *Codling_USC_Counter_v2* | Confirms CVR's current loss-leader status and the CenterPoint relationship / Texas growth thesis |

### USC P&L format (from the Op Income Illustration)

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

The model must reproduce this format line-for-line so CVR's numbers drop straight into USC's reporting without translation.

---

## 3. Core Design Decision: Two Revenue Modes

CVR today is an internal support function (cost center); the strategy moves it to externally billed engineering revenue. The model must handle **both modes simultaneously**, with the mix shifting over time:

- **Mode A — Internal support / cost recovery:** hours delivered to USC construction and estimating at an internal transfer rate (or absorbed cost). This is the current state and explains the loss-leader position.
- **Mode B — External engineering sales:** design-build engineering, prime-engineer, and eventually Engineer-of-Record work billed to utilities (CenterPoint and Texas market as the anchor thesis). This is what drives the $6M Year-2 sales goal.

Every forecast scenario is fundamentally a statement about **how fast hours and headcount shift from Mode A to Mode B, and at what realized rate**.

---

## 4. Model Architecture (Workbook Structure)

| # | Tab | Contents |
|---|---|---|
| 1 | **Assumptions** | All global inputs in one place: start dates, escalation %, fringe/benefit load %, utilization targets by role, billing rates by role and mode, overhead allocation %, interest assumptions, working-day calendar |
| 2 | **Headcount & Labor** | Roster by person/role (seeded from the org chart), salary or rate band, start/end dates, hiring plan rows for future adds. Computes fully loaded cost per person per month |
| 3 | **Capacity & Utilization** | Available hours per FTE per month × chargeability % by role → chargeable vs. non-chargeable hours. Non-chargeable hours flow to OpEx "Non-Chargeable Labor" exactly as USC's format expects |
| 4 | **Revenue Build** | Bottom-up: (a) **Backlog/committed** projects with monthly burn; (b) **Pipeline** opportunities × probability × timing; (c) Mode A internal recovery. Reconciles to a top-down check (chargeable hours × realized rate) |
| 5 | **Direct Costs** | Chargeable labor at loaded cost; subcontractor spend by project; produces Gross Profit by month and by project |
| 6 | **Operating Expenses** | Line-item OpEx matching USC's umbrella list; USC Corporate Overhead Allocation as an explicit driver (needs methodology from USC finance — see §6) |
| 7 | **P&L (Monthly)** | Full USC-format P&L, monthly for 36 months, with quarterly and annual roll-ups; computes Operating Income, OILI, and Return % |
| 8 | **Incentive Dashboard** | Sales vs. $6M goal and OILI vs. 20% target; applies the STIC payout curve (75%→53%, 90%→63%, 100%→70%, 120%→84% of the 70%-of-salary award) so performance-to-payout is visible at a glance |
| 9 | **Scenarios** | Base / Upside / Downside toggle driving utilization, rate, pipeline conversion, and hiring pace. Downside = slower Mode B conversion; Upside = CenterPoint program win accelerating Texas revenue |
| 10 | **Sensitivity** | One- and two-variable tables: OILI % vs. utilization × realized rate; breakeven utilization; revenue per FTE required to hit 20% |
| 11 | **Actuals & Variance** | Monthly actuals paste-in from USC accounting; forecast-vs-actual variance to make this a living operating tool, not a one-time projection |

**Time horizon:** 36 months, monthly granularity (covers remainder of 2026 ramp, the Year-2 incentive year, and Year 3 target-state).

---

## 5. Key Drivers (the handful of numbers that matter)

1. **Billable headcount** — engineers/designers on the org chart plus the hiring plan.
2. **Chargeability (utilization) %** by role — the single biggest lever moving CVR off loss-leader status.
3. **Realized billing rate** by role and mode — internal transfer rate vs. external market rate; rate realization (discounts, write-offs).
4. **Loaded labor cost** — salary + fringes + benefits + retirement (per USC's OpEx categories).
5. **Subcontractor mix and markup** — pass-through vs. margin-bearing.
6. **Pipeline conversion** — win rate and timing on external pursuits (CenterPoint / Texas anchor).
7. **USC corporate overhead allocation** — outside CVR's control but inside the OILI calculation; must be modeled explicitly and negotiated knowingly.
8. **Rework/change-order rate** — ties to the offer letter's performance measurements; a quality driver with direct margin effect.

---

## 6. Data Needed from USC (request list)

Priority items to request from USC finance/accounting before Phase 1 can be trusted:

- [ ] CVR trailing-12-month actuals in the USC P&L format (proves the loss-leader baseline)
- [ ] Actual salaries/rates for the org-chart roster, and the standard fringe/benefit load %
- [ ] The USC Corporate Overhead Allocation methodology and CVR's current allocation
- [ ] Current internal transfer-pricing treatment of CVR hours charged to USC construction jobs
- [ ] Any existing external billing rate sheet or recent proposals with rates
- [ ] Current backlog: active engineering commitments with remaining value and schedule
- [ ] Pipeline list from Estimating/BD: pursuits, value, expected award dates
- [ ] Interest expense basis (what debt/working-capital cost gets pushed to CVR for OILI)
- [ ] STIC plan document (to confirm the payout curve and definitions match the illustration)

Until actuals arrive, the model runs on placeholder assumptions clearly flagged as such.

---

## 7. Build Phases

**Phase 0 — Data gathering (Week 1–2).** Issue the §6 request list; interview Roy Pierce (VP Engineering) and Frank Miller (Director of Estimating) on current workload, utilization reality, and pipeline.

**Phase 1 — Baseline (Week 2–3).** Build tabs 1–3 and a current-state monthly P&L. Deliverable: "What CVR costs today and why it loses money" — quantified loss-leader baseline. This is the credibility anchor for everything after.

**Phase 2 — Forecast engine (Week 3–5).** Build revenue (tab 4), direct cost (5), OpEx (6), and the integrated P&L (7). Wire in the Mode A→B transition logic and the hiring plan.

**Phase 3 — Scenarios & incentive dashboard (Week 5–6).** Tabs 8–10. Calibrate the Base case so leadership targets ($6M / 20% OILI in Year 2) are achievable-but-stretch; document exactly which drivers must move to get there.

**Phase 4 — Validation & operating rhythm (Week 6–8).** Reconcile against any actuals received; walk the model with USC finance so overhead and interest treatments match their books; establish the monthly actuals-in / forecast-out cadence (tab 11).

**Suggested implementation:** build the workbook programmatically (Python + openpyxl) in this repository so the model is version-controlled and regenerable, with the `.xlsx` as the distributed artifact. Alternative: hand-built Excel with this repo holding assumptions and documentation.

---

## 8. Open Questions & Risks

1. **Revenue recognition for internal work** — does USC credit CVR any revenue for hours on USC construction jobs today, or is CVR pure cost? Determines how dramatic the baseline loss looks and how the Mode A line is modeled.
2. **Estimating org scope** — the org chart covers both CVR Engineering and Estimating Operations. Confirm whether Estimating is inside the CVR P&L (and the OILI target) or a separate cost center. The model should tag people by group so either boundary can be toggled.
3. **Overhead allocation risk** — a 20% OILI return is highly sensitive to the corporate allocation; if it's a % of revenue, growth drags allocation up with it. Model it as its own driver, never buried in a lump.
4. **Rate realism** — Year-2 $6M on roughly a dozen billable staff implies ~$500K revenue per billable FTE; sanity-check against market engineering rates and achievable utilization early (Phase 1), before committing the plan narrative.
5. **CenterPoint concentration** — the upside case leans on one utility relationship; scenarios should show the plan with and without it.

---

## 9. Immediate Next Steps

1. Confirm the §8 boundary questions (especially Estimating in/out).
2. Send the §6 data request to USC finance.
3. Begin Phase 1 baseline build in this repository.

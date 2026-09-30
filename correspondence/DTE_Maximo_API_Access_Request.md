# DRAFT — Request for read-only Maximo data access (DTE)

**To:** [DTE project manager / contract administrator for New Baltimore & Catalina]
**Cc:** [DTE Maximo administrator, if known] · [HWC leadership]
**Subject:** Request: read-only Maximo API access for HWC on New Baltimore and Catalina work orders

---

Hi [Name],

On New Baltimore and Catalina we pull work order, material and cost data out of Maximo by hand, one screen at a time. It's slow, it's easy to get wrong, and our numbers can end up out of step with yours. We'd like to ask for **read-only, programmatic access** to the same data we can already see through the Maximo web screens. That way our reports would come straight from your system of record.

**What it would help with**

- **New Baltimore (39-WO pilot):** tracking WO status, material readiness and scheduled dates ahead of the spring 2027 construction start, and giving you consistent numbers for the open-book review and cost-per-mile comparison.
- **Material reconciliation:** checking planned material (BOM) against actual issues and returns per work order before the 2027 construction season. This should catch surplus and shortages early.
- **Catalina Ph 3 and future awards:** the same visibility through construction and closeout.

**What we're asking for**

1. **One read-only integration account** (or an API key under an existing HWC login), limited to the work orders on HWC's contracts. Nothing that can create, change or approve records.
2. **REST API access** to the following, or to whatever object structures your team already maintains for these:

   | Data | Typical Maximo object | Fields we need |
   |---|---|---|
   | Work orders | WORKORDER (e.g. MXAPIWODETAIL) | WO number, parent WO/project, description, location, work type, status and status date, target/scheduled/actual start and finish, estimated vs. actual labor, material and service cost |
   | Planned materials | WPMATERIAL | Item number, description, planned quantity, unit cost, per WO |
   | Material issues/returns | MATUSETRANS | Item number, quantity, transaction type and date, per WO |
   | Purchasing (if available) | PO / POLINE | PO number, line, item, quantity, cost, receipt status, linked WO |

3. **Filtering** to HWC's work (for example by project/parent WO, contract number or vendor). We have no need to see anything outside our scope.

**How we'd use and protect the data**

- We'd run a scheduled pull, **daily or weekly**, at low volume (a few hundred records per run), outside peak hours if you'd like.
- The data would be used only for project controls and reporting on DTE work. It stays in HWC's internal systems and isn't shared with third parties.
- We'll follow DTE's security requirements: IP allow-listing, key rotation, a named technical contact, and any agreement you need us to sign.
- You can turn the key off at any time.

**If direct API access isn't possible**, a scheduled report or saved-query export emailed to us weekly as CSV or Excel would give us most of the benefit.

Could you point us to the right person in your Maximo or IT team, or let us know the process for requesting this? We're happy to set up a short call to walk through the details.

Thanks,
[Your name]
[Title], Hydaker-Wheatlake Company (HWC)
[Phone] · [Email]

---

*Notes before sending (delete this section):*
- *Fill in HWC's DTE contract/PO numbers for New Baltimore and Catalina. The 001-0003 and 001-0001 numbers in the P6 schedule are CVR job numbers, and HWC's may be different.*
- *The object names in the table are standard Maximo examples. DTE's admins may use their own names, so the field list is what matters.*
- *If you already know DTE's Maximo version (7.6 vs. MAS 8/9), mention it. API keys work differently in each.*

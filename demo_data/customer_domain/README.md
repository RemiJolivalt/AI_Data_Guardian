# Demo data — Customer Trust Assessment

All data here is **synthetic** and contains **no real, identifiable data**. Every anomaly is
intentional and supports the executive story: *can we trust our customer knowledge?* This scenario
reuses the deterministic engine and lights up the METADATA and LINEAGE dimensions that the KPI
scenario leaves as `INSUFFICIENT_EVIDENCE`.

## The domain (CRM = playing field, not the product)

```
CUSTOMER
 ├── CUSTOMER_ADDRESS
 ├── ORDER
 ├── CUSTOMER_INTERACTION
 └── CONSENT
```

## Three simulated inputs (external tools mocked by CSV)

| File | Simulates | Notes |
|---|---|---|
| `customer.csv`, `customer_address.csv`, `orders.csv`, `customer_interaction.csv`, `consent.csv` | the CRM data | intentionally imperfect |
| `governance_metadata.csv` | a **data governance / catalog** tool export | partial coverage: blank descriptions, missing owners, unflagged PII, incomplete lineage |
| `data_quality_rules.csv` | a **data quality** tool export | only a few columns covered; some rules currently failing |
| `industry_customer_context.yaml` | a **curated** industry knowledge pack | the AI's grounded source of truth (`is_curated: true`) |
| `expected_ai_recommendations.csv` | golden expectations | what the AI should propose (reviewer fixture) |

## Three stories (engineered anomalies)

**1. Customer identity cannot be trusted**
- duplicate `customer_id` (`CUS-00000002`), off-pattern id (`CUS-8`)
- invalid email (`sofia.rossi_example.com`), phone format drift (`+33 6…`, `0033…`, `06 12…`)
- missing `country_code` / `postal_code`; B2C rows carrying a `company_name`
- catalog: `email` and `phone_number` have **no description and no PII classification**

**2. Consent is insufficiently governed**
- `marketing_consent` has **no business description** and **no DQ rule** in the catalog
- consent expired but still `GRANTED` (`CON-0003`), `PENDING` with no expiry (`CON-0008`)
- `marketing_consent = Y` in CRM while the consent record is `DENIED` (`CUS-00000002`)

**3. Orders cannot always be linked to a reliable customer**
- `ORD-0005` references `CUS-99999999`, absent from `CUSTOMER` (no referential-integrity rule exists)
- negative `order_amount` (`ORD-0007`); `valid_to < valid_from` on an address (`ADR-0006`)
- two `is_primary = true` addresses for `CUS-00000001`

## What the platform computes (deterministic)

Four **coverage** metrics over the real columns of the five tables, plus a gap list:
- **Metadata coverage** — columns with a business description in the catalog
- **Governance coverage** — columns with an owner and a sensitivity
- **Quality coverage** — columns with at least one active DQ rule
- **Lineage coverage** — columns with a declared upstream asset

These feed the headline message, e.g. *"only N% of the customer data needed for a reliable view is
described, governed and controlled"* — computed on this dataset, never hard-coded.

## What the AI proposes (grounded, never applied automatically)

For each gap, a `PROPOSED` suggestion citing its basis (a profiling evidence id + a knowledge-pack
entry id) and a confidence. A human validates (G2/G6); validated suggestions regenerate an updated
`governance_metadata` export in `outputs/` (simulated write-back — no external write in the MVP).

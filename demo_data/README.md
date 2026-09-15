# Demo data — Revenue Forecasting scenario

All data here is **synthetic** (`is_synthetic: true`) and contains **no real, identifiable data**.
Every anomaly is intentional and maps to a step of the demo script (cahier §4.2).

## Scenario

An enterprise wants a **Revenue Forecasting Agent** for sales-committee planning. The
**Net Revenue** KPI feeds executive decisions but draws from multiple sources. AI Data Guardian
must show the data is **NOT_TRUSTED / NOT_READY** and explain why.

## Files

| File | Role | Intentional anomalies |
|---|---|---|
| `customers.csv` | operational master | `C-1001` and `C-1002` duplicated; missing `email`/`owner` |
| `transactions.csv` | operational | orphan `C-1099`; duplicate booking `T-9003`; no freshness SLA in calc |
| `catalog.json` | partial catalog | `customers.owner` null; `transactions` missing classification/steward |
| `kpi_net_revenue.md` | KPI definition | business definition diverges from technical calculation; no owner |
| `policy_data_quality.yaml` | DQ policy | controls DQ-UNIQUENESS, DQ-FRESHNESS, GOV-OWNERSHIP, GOV-DEFINITION |
| `governance_rules.yaml` | governance rules | owner/steward/classification/freshness required |
| `ai_use_case.md` | AI use case | readiness blockers documented |
| `feedback_history.json` | historical feedback | synthetic steward confirmation of duplicates |

## Anomaly → demo step mapping (§4.2)

| Demo step | Powered by |
|---|---|
| Trust Score low / `Not ready` | duplicates + missing ownership + freshness gap |
| "Why not trusted?" (3 causes) | duplicate keys, missing KPI owner, KPI definition divergence |
| Business impact / exposure | Net Revenue double-counting from duplicates |
| Remediation plan (3 actions) | de-duplicate, assign owner, enforce freshness SLA |
| Simulated score after remediation | resolving DQ-UNIQUENESS + GOV-OWNERSHIP + DQ-FRESHNESS |

## Trusted counter-scenario

A second, clean variant (no duplicates, full ownership, declared freshness) will be added to prove
a `TRUSTED` / `READY` path (cahier §14.2). Tracked as a Phase 1 follow-up.

## Golden expectations

Expected high-level outputs live in `tests/fixtures/golden/` for regression once the pipeline
consumes this scenario.

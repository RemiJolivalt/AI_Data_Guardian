# F0-05 — Synthetic golden demo scenario

- Persona: Demo Designer
- Value: a reproducible, intentional dataset that drives the 60-second executive story.
- Traces to: cahier §4, §14, F0-05. Depends on: F0-03.
- Status: **done** — `demo_data/` scenario + `tests/fixtures/golden/` expectation.

## Scope

`demo_data/` with the §14.1 datasets for the `Revenue Forecasting Agent` scenario: customers with
duplicates/missing fields, transactions with stale freshness, partial catalog, KPI business
definition, divergent technical mapping, a DQ policy, governance rules, the AI use-case
description, and synthetic historical feedback. Plus `demo_data/README.md` and golden expected
results in `tests/fixtures/`.

## Out of scope

The pipeline that consumes the data (Phase 1).

## Acceptance criteria

- Given `demo_data/`, When inspected, Then it contains one `not trusted` scenario (Net Revenue) and
  at least one `trusted` scenario (§14.2).
- Given each dataset, Then every injected anomaly is intentional and documented in
  `demo_data/README.md`.
- Given any record, Then no real, identifiable data is present and synthetic data is marked
  `is_synthetic: true` where the contract applies.
- Given the scenario, Then golden expected outputs are defined in `tests/fixtures/` for later
  regression.

## Error cases

N/A (static assets); malformed files must be caught by later ingestion tests.

## Security

Synthetic only; no PII; documented anomalies.

## Demo proof

The scenario README maps each anomaly to the demo script step it powers (§4.2).

# AI use case — Revenue Forecasting Agent

- use_case_id: uc:revenue_forecasting_agent
- target KPI: kpi:net_revenue

## Description

An AI agent assists sales-committee planning by forecasting Net Revenue. It consumes the
`customers` and `transactions` datasets and the `net_revenue` KPI.

## AI-readiness concerns (intentional, for the demo)

- Data quality: duplicate customers and an orphan transaction inflate the target signal.
- Governance: no KPI owner; missing dataset owners/classification.
- Freshness: transactions feed has no enforced SLA in the calculation.
- Representativity/rights/monitoring: not documented in the partial catalog.

Expected outcome: **NOT_READY** until the duplication, freshness, and ownership gaps are closed.

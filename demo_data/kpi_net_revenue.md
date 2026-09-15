# KPI — Net Revenue

- kpi_id: kpi:net_revenue
- owner: (unassigned)

## Business definition (as understood by the executive committee)

Net Revenue = total invoiced amount to **distinct** customers over the period, excluding
intra-group and duplicate bookings, refreshed daily.

## Technical calculation (as implemented today)

`SUM(transactions.amount_eur)` grouped by `customer_id`, with **no de-duplication** of customers
and **no freshness constraint** on the transactions feed.

## Divergence (intentional demo anomaly)

The technical calculation does not de-duplicate customers (`C-1001`, `C-1002` appear twice) and
counts a transaction for an unknown customer (`C-1099`). The business definition requires distinct
customers and daily freshness; the implementation guarantees neither.

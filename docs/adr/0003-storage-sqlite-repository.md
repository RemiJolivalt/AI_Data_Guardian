# ADR-0003 — Storage

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier ADR-003, §11.1

## Context

The MVP runs locally with synthetic data but must not paint itself into a corner for a future
cloud/object-store target.

## Decision

Use a **repository abstraction** with two implementations:
- **SQLite** for local development and tests (deterministic, offline).
- **Supabase Postgres** for the deployed environment (selected via `DATABASE_URL` / `SUPABASE_DB_URL`).

Workspace files use an object-store interface: local filesystem (`outputs/`) in demo mode,
**Supabase Storage** when deployed.

## Consequences

- No external DB dependency for local demo/tests; deployed runs on managed Postgres.
- The environment target (Vercel + Supabase, ADR-0008) is an adapter choice, not a rewrite.
- Determinism guarantee (US-040) is upheld with local SQLite in CI/tests.
- Superseded the original "SQLite only" framing on 2026-09-15 following the Vercel/Supabase decision.

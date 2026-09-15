# ADR-0008 — Deployment environment: Vercel + Supabase

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier §11.1, ADR-0003, ADR-0007, ADR-0009

## Context

The stakeholder selected **Vercel + Supabase** as the technical environment. This is a
Node/TypeScript-native platform. The cahier (§11.1) proposed Python/FastAPI + SQLite; the
repository abstraction (ADR-0003) was designed precisely to allow this kind of swap.

## Decision

- **Host** the Next.js app (UI + API route handlers) on **Vercel**.
- **Supabase** provides the deployed **Postgres** database, **Auth** (ADR-0007), and **Storage**
  (workspace files / object-store interface).
- **SQLite** remains the local/test datastore for deterministic, offline runs, behind the same
  repository interface. Selection is driven by env (`SUPABASE_DB_URL` / `DATABASE_URL`).

## Consequences

- One deploy target, first-class DX for the chosen stack.
- The deterministic core stays framework-agnostic (`src/core/`) so it runs identically in tests,
  serverless functions, and any future runtime.
- Risk to validate: heavy compute in Vercel serverless functions (size/duration limits). Mitigation:
  keep profiling lightweight and demo-sized; move heavy jobs to a background worker if needed.
- Supabase Row Level Security must be configured before any non-synthetic data is stored.

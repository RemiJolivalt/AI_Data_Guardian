# ADR-0009 — Implementation language: TypeScript (overrides cahier §11.1)

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier §11.1, §11.2, ADR-0001, ADR-0008

## Context

The cahier §11.1 recommends Python 3.12 + FastAPI. However: (1) the target environment is
Vercel + Supabase (Node-native, ADR-0008); (2) the machine has Node 24 and no Python; (3) the
cahier's deterministic requirement (§11.2) is about **reproducibility and keeping the LLM off the
compute path**, not a specific language.

## Decision

Implement the entire stack — UI and deterministic core — in **TypeScript** on **Next.js**
(App Router). Contracts use **Zod** (replacing Pydantic). Tests use **Vitest** (unit/contract/
integration) and **Playwright** (E2E).

This is a documented **override** of cahier §11.1, escalated and approved by the stakeholder
rather than resolved silently (per the source-of-truth conflict rule).

## Consequences

- Single language across the stack; no Python toolchain required.
- Deterministic compute lives in `src/core/` as pure, framework-agnostic TypeScript; the LLM stays
  behind the provider adapter and never touches scoring/profiling.
- The cahier's intent (versioned deterministic scoring, evidence contracts, 5-agent design) is
  fully preserved; only the language and libraries change.
- Profiling relies on lightweight TS rather than pandas; acceptable for demo-sized data.

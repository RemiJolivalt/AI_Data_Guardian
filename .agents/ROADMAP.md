# ROADMAP — AI Data Guardian

Sequencing is optimized to surface the Wow effect early: build one **vertical demo slice**
(golden scenario -> Trust Score -> "Why not trusted" cockpit) before widening. Deterministic core
precedes any LLM use.

## Phase 0 — Foundation (current)

- [x] F0-01 Initialize repo structure & git hygiene (.gitignore, untrack venv/.env)
- [x] F0-02 Author agent instructions & governance docs (`.agents/`, `.github/`)
- [x] F0-06 Legacy assessment of `Manual_Inputs/` (`docs/legacy-assessment.md`)
- [x] F0-03 Domain contracts (Zod) + contract tests — green
- [x] F0-04 Scoring configuration (`config/scoring.yaml`, versioned) + loader/tests — green
- [x] F0-05 Synthetic demo scenario (`demo_data/`, golden fixtures)
- [~] F0-07 Tooling scaffolded (Vitest, tsc, ESLint); security test suite still to add

> Gate G1 (scope & sources) approved 2026-09-15 ("Go on"). Stack: TypeScript / Next.js / Vercel /
> Supabase (ADR-0008, ADR-0009).

## Phase 1 — Trusted Data Assessment (vertical slice first)

Golden scenario + deterministic profiling + Findings/Evidence + Trust Score + minimal cockpit +
"Why not trusted?" explanation.

- [x] Ingestion (CSV) + source hashing
- [x] Deterministic profiling (duplicates, nulls, freshness)
- [x] Findings + Evidence rule evaluator
- [x] Trust Score engine (versioned) + AI readiness
- [x] `GET /api/assessments/demo` + `/cockpit` "Why not trusted?"
- [ ] Persist assessment runs via the repository (SQLite/Supabase)
- [ ] Trusted counter-scenario + Playwright E2E

## Phase 2 — AI Trust & Remediation

AI Readiness · lineage · business impact (SIMULATED) · remediation + before/after simulation
· human review center.

- [x] Business impact (SIMULATED LOW/CENTRAL/HIGH exposure)
- [x] Remediation plan (versioned impact/effort priority)
- [x] Before/after Trust Score simulation
- [ ] Lineage view
- [ ] Human review center (accept/reject/correct)

## Phase 3 — Executive Demonstrator

Storytelling · report export (MD/JSON/PDF) · guided scenario · agent run logs · UX polish · E2E.

## Phase 4 — Productization (post-MVP)

Cloud adapters · multi-tenant · identity & RBAC · real connectors · metering · hardening.

## Deviations from the cahier's ordering (rationale)

- Legacy-reuse effort minimized: the previous POC code is unrecoverable (see legacy-assessment).
- 14 agents -> 5 logical agents (see ARCHITECTURE §1–2).
- Vertical Wow slice built before horizontal breadth.
- Stack pivoted from cahier §11.1 (Python) to TypeScript for the Vercel/Supabase target (ADR-0009).

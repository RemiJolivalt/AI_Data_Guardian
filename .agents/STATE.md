# STATE — AI Data Guardian

Living snapshot of where the build is. Update at the end of every story.

## Current phase

**Phase 1 — Trusted Data Assessment (vertical slice).** Deterministic pipeline runs end to end on
the demo scenario and renders in the cockpit. Stack: **TypeScript / Next.js / Vercel / Supabase**.

## Done

- Read-only repo assessment; git hygiene (`.gitignore`, untracked `.venv`/`.env`, 2,577 -> 18 files).
- Source-of-truth spec copied to repo root (`CAHIER_DES_CHARGES_AI_DATA_GUARDIAN.md`).
- Governance foundation: `AGENTS.md`, `README.md`, `.env.example`, `.agents/*`, `.github/*`.
- `docs/legacy-assessment.md`; ADRs 0001–0009 (0006 proposed, rest accepted).
- **F0-03** domain contracts as Zod schemas (`src/core/domain/`) + contract tests.
- **F0-04** versioned `config/scoring.yaml` + typed loader (`src/core/scoring/config.ts`) + tests.
- **F0-05** synthetic golden scenario (`demo_data/`) + golden fixture.
- Next.js app shell + `GET /health`; Supabase client stub.
- Toolchain: Vitest, `tsc`, ESLint/Prettier configured. **13/13 unit tests pass; typecheck clean.**

## Phase 1 slice (done)

- Ingestion: dependency-free CSV parser + SHA-256 source hashing (`src/core/ingestion/`).
- Profiling: null/distinct counts, duplicate detection, freshness age (`src/core/profiling/`).
- Deterministic rule evaluator -> Findings + Evidence for the Revenue scenario
  (`src/core/assessment/rules.ts`).
- Trust Score engine consuming `scoring.yaml`; unassessed dims -> INSUFFICIENT_EVIDENCE
  (`src/core/scoring/engine.ts`).
- Orchestrator `runAssessment` -> NOT_TRUSTED / NOT_READY (`src/core/assessment/runAssessment.ts`).
- `GET /api/assessments/demo` + `/cockpit` server page ("Why not trusted?").
- **25/25 tests pass (unit + integration); `next build` green (5 routes).**

## In progress

- None.

## Blocked / awaiting decision

- ADR-0006 (PDF/export approach) remains **proposed**.
- Trusted counter-scenario dataset for `demo_data/` to be confirmed (Phase 1).
- Follow-up: add the security test suite (path traversal, extension allowlist, secret masking,
  prompt-injection) to finish F0-07.

## Key facts discovered

- No Python on host (Node 24 only) -> reinforced the TypeScript pivot.
- The "Previous POC" under `Manual_Inputs/` is unrecoverable (OneDrive download-failure stubs);
  no reusable code.

## Next best actions (Phase 1)

1. Business impact / exposure scenarios (SIMULATED) for the duplicate double-counting.
2. Remediation plan + before/after simulation (US-060, US-061).
3. Lineage view (Source -> Dataset -> KPI -> Use case).
4. Persist runs via the repository (SQLite local / Supabase deployed).
5. Add the trusted counter-scenario and E2E (Playwright) on the cockpit.

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
- Business impact (SIMULATED LOW/CENTRAL/HIGH exposure) + prioritized remediation plan (versioned
  impact/effort formula) + before/after Trust Score simulation (`src/core/impact`, `src/core/remediation`).
- **32/32 tests pass (unit + integration); `next build` green (5 routes).**

## Persistence (done)

- Repository abstraction `AssessmentRepository` with in-memory (local/tests) and **Supabase Postgres**
  implementations (`src/core/memory/`); factory selects by config (ADR-0003/0008).
- Demo run persists automatically; resilient (persist failure does not fail the request).
- Endpoints: `GET /api/assessments` (list), `GET /api/assessments/[id]` (detail); `/runs` history page.
- SQL migration `supabase/migrations/0001_assessment_runs.sql` + `npm run migrate` runner.
- **35/35 tests pass; `next build` green (7 routes).**
- Pending: apply the migration in Supabase (SQL editor) and set the 3 Supabase env vars in Vercel.

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

1. Persist runs via the repository (SQLite local / Supabase deployed) — exercises Supabase wiring.
2. Interactive `POST /recommendations/{id}/simulate` (accept an action -> live before/after).
3. Lineage view (Source -> Dataset -> KPI -> Use case).
4. Trusted counter-scenario + Playwright E2E on the cockpit.
5. Human Review Center (accept/reject/correct a finding).

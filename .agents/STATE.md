# STATE — AI Data Guardian

Living snapshot of where the build is. Update at the end of every story.

## Current phase

**Phase 0 — Foundation.** Gate G1 approved (2026-09-15). Stack: **TypeScript / Next.js / Vercel /
Supabase** (ADR-0008, ADR-0009).

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

1. Ingestion + deterministic profiling of the demo scenario.
2. Findings/Evidence generation against the DQ policy + governance rules.
3. Trust Score engine consuming `config/scoring.yaml`.
4. Minimal Executive Cockpit + "Why not trusted?" screen.

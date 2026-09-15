# AI Data Guardian

An **AI Trust Platform** that determines, in under 60 seconds, whether the data behind a KPI,
decision, report, or AI use case is trustworthy, governed, explainable, and ready for use.

It answers three questions, in order:

1. Can I trust this data for this use?
2. What is the business risk if I use it despite the gaps?
3. Which actions give the most trust for the least effort?

> Status: **Phase 0 — Foundation**. Demonstration-first MVP. Synthetic data only.

## Documentation map

| Topic | Location |
|---|---|
| Product specification (source of truth) | [CAHIER_DES_CHARGES_AI_DATA_GUARDIAN.md](CAHIER_DES_CHARGES_AI_DATA_GUARDIAN.md) |
| Agent operating rules | [AGENTS.md](AGENTS.md) |
| Requirements digest | [.agents/REQUIREMENTS.md](.agents/REQUIREMENTS.md) |
| Architecture | [.agents/ARCHITECTURE.md](.agents/ARCHITECTURE.md) |
| Roadmap | [.agents/ROADMAP.md](.agents/ROADMAP.md) |
| Current state | [.agents/STATE.md](.agents/STATE.md) |
| Decisions log | [.agents/DECISIONS.md](.agents/DECISIONS.md) |
| Architecture Decision Records | [docs/adr/](docs/adr/) |
| Legacy assessment | [docs/legacy-assessment.md](docs/legacy-assessment.md) |
| Phase 0 stories | [.agents/stories/](.agents/stories/) |

## Stack (MVP)

- Language: TypeScript (ADR-0009)
- App: Next.js (App Router) on Vercel (ADR-001, ADR-0008)
- Contracts: Zod
- Data: SQLite local/tests + Supabase Postgres deployed, behind a repository abstraction
- Auth/Storage: Supabase (deployed)
- Orchestration: internal state machine
- LLM: OpenAI-compatible adapter, deterministic fallback
- Tests: Vitest (unit/contract), Playwright (E2E)

## Getting started

```bash
npm install
npm run test        # Vitest unit + contract tests
npm run typecheck   # tsc --noEmit
npm run dev         # Next.js dev server (http://localhost:3000)
```

The deterministic core (domain contracts, scoring config) and the synthetic demo scenario are in
place and tested. Pipeline and UI screens are built in Phase 1. See
[.agents/ROADMAP.md](.agents/ROADMAP.md).

## Security

- Secrets live only in `.env` (git-ignored). See [.env.example](.env.example).
- Synthetic demo data only; no real, identifiable data.
- Document content is treated as data, never as instructions.

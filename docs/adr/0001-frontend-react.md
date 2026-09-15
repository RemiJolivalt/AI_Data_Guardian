# ADR-0001 — Frontend framework

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier ADR-001, §11.1, §8

## Context

The MVP is demonstration-first; a decision-maker must grasp the story in under 60 seconds. The
cahier leaves the choice open between Streamlit (speed) and React (premium UX).

## Decision

Use **React + TypeScript** (Vite) for the MVP frontend.

## Consequences

- Higher build cost than Streamlit, accepted in exchange for a more convincing executive UX and a
  cleaner path to Phase 4 productization.
- Backend stays a clean FastAPI JSON API (the frontend is a pure client).
- E2E via Playwright against the React app.
- Requires discipline to keep the demo runnable early (mitigated by the vertical-slice roadmap).

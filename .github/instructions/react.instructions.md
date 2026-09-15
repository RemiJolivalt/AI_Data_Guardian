---
applyTo: "src/app/**/*.{ts,tsx}"
---

# React / Next.js instructions

- Next.js App Router + TypeScript (strict). No `any` without justification.
- Business-consequence-first UI: one key message per screen; details via drill-down.
- Render **facts, assumptions, and simulations** with visually distinct, **non-color-only**
  affordances (icon + label + text), for accessibility.
- Every score opens its calculation method; every recommendation opens its evidence.
- No irreversible action hidden behind a click; confirm sensitive actions.
- The UI is a client of the API route handlers under `src/app/api/`; keep business logic and
  scoring in the deterministic core (`src/core/`), never in components.
- Keyboard navigable; sufficient contrast; alt text on exported visuals; FR + EN strings.
- Co-locate component tests; add Playwright coverage for the demo-critical flows.

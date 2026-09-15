---
applyTo: "tests/**/*.ts"
---

# Test instructions

- Framework: **Vitest** (unit/contract/integration) and **Playwright** (E2E). Structure:
  `unit/`, `integration/`, `e2e/`, `security/`, `fixtures/`.
- Unit-test all deterministic compute: scoring, profiling, prioritization. Assert reproducibility
  (same inputs + same versions -> identical outputs).
- Contract-test every Zod schema in §7 (Finding, Evidence, Score, etc.).
- Integration-test each pipeline stage; E2E-test the primary demo scenario end to end.
- Use golden files for reports; update them deliberately, never blindly.
- Synthetic data must be explicitly declared; no silent mocks.
- Security tests: path traversal, extension allowlist, secret masking, prompt-injection resistance.
- A failing test is fixed at the cause; never bypassed or weakened to go green.

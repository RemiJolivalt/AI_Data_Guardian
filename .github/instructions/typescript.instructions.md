---
applyTo: "src/**/*.ts"
---

# TypeScript instructions

- TypeScript strict mode; no `any` without justification. Prefer inferred types from Zod schemas.
- The deterministic core lives under `src/core/` and must be **pure and framework-agnostic** — no
  Next.js, React, LLM, wall-clock branching, or hidden randomness (seed if unavoidable).
- Domain contracts (§7) are Zod schemas; types are `z.infer` from them. Validate at boundaries only.
- Never build SQL by string concatenation; use the repository layer / parameterized queries.
- Guard every file read against path traversal; confine to the workspace root; allowlist extensions.
- Never log secrets; mask tokens and keys. Read secrets only from `process.env`.
- Throw typed errors; never swallow. No empty `catch`.
- Compute functions (profiling, scoring, prioritization) must be deterministic and unit-tested.
- Keep server-only code out of client components; the LLM lives behind the provider adapter.

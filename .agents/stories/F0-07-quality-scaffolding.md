# F0-07 — Tests, lint, types, security scaffolding

- Persona: Developer
- Value: a green baseline so every later story is verified automatically.
- Traces to: cahier §10.3, §12.4, F0-07. Depends on: F0-03.
- Status: **partial** — Vitest/tsc/ESLint green; security test suite still to add.

## Scope

`package.json` (deps + scripts), `tsconfig.json` (strict), ESLint + Prettier config, Vitest layout
(`tests/{unit,integration,e2e,security,fixtures}`), a smoke/contract baseline, and a runnable
test/typecheck command set. Next.js app scaffolded under `src/app/`.

## Out of scope

Feature code; real pipelines.

## Acceptance criteria

- Given a clean checkout, When the dev installs dependencies, Then `ruff`, `mypy`, and `pytest` all
  run and pass on an empty/smoke baseline.
- Given the test layout, Then the five test categories exist and are discoverable.
- Given a required secret is missing, Then app/config startup fails cleanly (US-100).
- Given the security test suite, Then it includes placeholders for path traversal, extension
  allowlist, secret masking, and prompt-injection resistance.
- Given the frontend, Then `npm run lint` and the test runner execute on a scaffold component.

## Error cases

Missing dependency; failing lint/type baseline must block.

## Security

`.env.example` only; secrets masked in logs; dependency scan configured.

## Demo proof

A single command runs backend lint+type+tests green; frontend lint+test green.

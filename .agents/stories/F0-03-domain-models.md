# F0-03 — Domain models & contracts

- Persona: Developer / Architect
- Value: a single typed source of truth for every entity so all agents exchange valid, traceable data.
- Traces to: cahier §7, F0-03. Depends on: none (foundational).
- Status: **done** — Zod schemas in `src/core/domain/`, 8 contract tests green.

## Scope

Zod schemas for the §7.1 entities and the §7.2/§7.3 contracts, plus status enums (§6.3),
in `src/core/domain/`. TS types are inferred via `z.infer`.

## Out of scope

Persistence, scoring logic, API wiring (later stories).

## Acceptance criteria

- Given the §7.1 entity list, When the domain package is imported, Then a Pydantic v2 model exists
  for each entity with required ids, versions, and timestamps.
- Given a `Finding`, When constructed, Then it enforces `finding_id`, `assessment_id`, `category`,
  `severity`, `evidence_ids`, `status`, `created_by`, and `requires_human_review` (§7.2).
- Given an `Evidence`, When constructed, Then it enforces `evidence_id`, `source_id`, `method`,
  `is_synthetic`, `hash`, and `generated_at` (§7.3).
- Given a `Score`, When constructed, Then it carries `score_version`, `calculation_timestamp`,
  `inputs`, `assumptions`, and `evidence_ids`.
- Given status fields, Then only the §6.3 enum values are accepted.
- Given invalid input, Then construction raises a validation error (boundary validation).

## Error cases

Missing required id/version/timestamp; invalid enum; wrong types.

## Security

No secrets; no file/network access in models.

## Test data

Minimal valid and invalid fixtures per contract in `tests/fixtures/`.

## Demo proof

JSON round-trip of a `Finding` and `Evidence` matches the §7 contract exactly.

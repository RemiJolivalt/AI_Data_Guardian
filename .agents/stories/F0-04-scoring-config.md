# F0-04 — Versioned scoring configuration

- Persona: Architect / Data Office
- Value: a transparent, versioned, contestable Trust Score definition.
- Traces to: cahier §6, ADR-0005, F0-04. Depends on: F0-03.
- Status: **done** — `config/scoring.yaml` + loader in `src/core/scoring/config.ts`, 5 tests green.

## Scope

`config/scoring.yaml` defining the 8 dimensions (§6.1), their weights and sub-scores, plus a typed
loader in `src/core/scoring/` that validates the config and exposes `score_version`.

## Out of scope

The scoring computation engine (Phase 1).

## Acceptance criteria

- Given `config/scoring.yaml`, When loaded, Then it exposes a `score_version` and a weight for each
  of the 8 dimensions, with weights summing to a documented total.
- Given a malformed config (missing dimension, bad weight), When loaded, Then loading fails with a
  clear error (no silent default).
- Given the same config file, When loaded twice, Then the parsed result is identical (deterministic).
- Given a change to weights or logic, Then `score_version` must change (checked in review).
- Given missing minimum evidence for a dimension, Then the config defines it maps to
  `INSUFFICIENT_EVIDENCE`, never a guessed value.

## Error cases

Missing dimension; weights out of range; unparetiseable YAML.

## Security

Config is data, not code; no `eval`; no secrets.

## Test data

One valid config and two invalid variants in `tests/fixtures/`.

## Demo proof

Loader prints the dimension weights and `score_version` deterministically.

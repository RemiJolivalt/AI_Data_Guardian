# ADR-0004 — LLM provider

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier ADR-004, §11.1, §11.2

## Context

The product needs generative explanation/narrative but must remain reproducible, offline-capable
for demos, and provider-agnostic.

## Decision

A single **OpenAI-compatible adapter** in `providers/` with a **deterministic fallback**. When
`DEMO_MODE=true`, generation uses templated deterministic output so the demo runs with no network.

## Consequences

- Provider is swappable via env config.
- LLM is never on the deterministic compute path (scoring/profiling); it only explains/proposes.
- Timeouts and retries are bounded (§10.4).
- Prompts are versioned for observability (§10.5).

# ADR-0002 — Orchestration approach

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier ADR-002, §5, §11.1, §17

## Context

The pipeline chains discovery, profiling, scoring, impact, remediation, and reporting with human
gates and resumability. A heavy agent framework risks fragility and lock-in (§17).

## Decision

Implement an **internal explicit state machine** in `orchestration/`. No LangGraph in the MVP.

## Consequences

- Each stage: typed inputs/outputs, status, timestamps; resumable without full recompute (US-091).
- Human gates (G1–G6) are first-class states.
- Simpler to test deterministically; a framework can be introduced later behind the same interface
  if scale demands it.

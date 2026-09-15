# ADR-0007 — MVP authentication

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier ADR-007, §10.1, US-101, ADR-0008

## Context

The MVP is a local demonstrator. Full auth adds friction; zero auth may be unacceptable if demoed
on shared infrastructure.

## Options

1. No auth (local demo only).
2. Single shared token / minimal RBAC (owner, steward, viewer).
3. Full identity provider integration (deferred to Phase 4).

## Decision

Use **Supabase Auth** with a minimal role model (`owner`, `steward`, `viewer`) to make the
human-gate/steward flows believable without building an IdP. Roles gate sensitive actions and the
human gates (G1–G6). In local demo mode (`DEMO_MODE=true`) auth can be bypassed with a seeded
demo user.

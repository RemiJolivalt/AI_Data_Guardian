# ARCHITECTURE — AI Data Guardian MVP

Status: proposed foundation (pre-implementation). Decisions recorded as ADRs in `docs/adr/`.

## 1. Optimization vs. the cahier

The cahier (§5.2) lists 14 agents. For a 60-second executive demo this is over-engineered and
makes orchestration fragile (a risk §17 explicitly calls out). We collapse to **5 logical agents**
running **in one process**. The other capabilities become internal, deterministic functions — not
separate agents. Every logical agent still emits a traceable `AgentRun`, so observability (§10.5,
US-090) is preserved.

## 2. The 5 logical agents

| Agent | Absorbs (cahier) | Responsibility | Nature |
|---|---|---|---|
| **Orchestrator** | A01 | Plan, sequence, manage gates/retries, consolidate result | control |
| **Evidence Agent** | A02, A04, A05, A06, A07 | Discover sources, profile data, normalize metadata/lineage, evaluate governance & compliance -> produce Findings + Evidence | deterministic |
| **Trust Agent** | A08, A09 | Compute Trust Score + AI Readiness from evidence; emit blockers | deterministic |
| **Impact & Remediation Agent** | A10, A11 | Business impact scenarios (SIMULATED), prioritized remediation, post-remediation simulation | deterministic + generative assumptions |
| **Narrative Agent** | A12 | Executive storytelling, "why not trusted", report generation | generative |

Cross-cutting: **Reviewer (A13)** and **Feedback Learning (A14)** are implemented as pipeline
stages/services invoked by the Orchestrator, not standing agents.

## 3. Deterministic vs. generative boundary (§11.2)

- **Deterministic** (no LLM): parsing, profiling, metric computation, scoring, priority formula,
  state management, schema validation, id/evidence generation.
- **Generative** (LLM): business explanation, assisted semantic mapping, policy summarization,
  proposed assumptions, recommendations, executive narrative.
- **Hard rule**: no generative output becomes a fact without evidence or human validation.

## 4. Value chain (§5.1)

```text
Sources/evidence
  -> Ingestion & cataloging        (Evidence Agent)
  -> Profiling & normalization     (Evidence Agent)
  -> Control evaluation            (Evidence Agent)
  -> Trust analysis                (Trust Agent)
  -> Business impact analysis      (Impact & Remediation Agent)
  -> Recommendations & priority    (Impact & Remediation Agent)
  -> Human validation              (Orchestrator gates)
  -> Executive reporting           (Narrative Agent)
  -> Memory & continuous learning  (Feedback service)
```

## 5. Components / repo layout

Implementation language is **TypeScript** (ADR-0009); deployment is **Vercel + Supabase**
(ADR-0008). The deterministic core is framework-agnostic under `src/core/`.

```text
src/
  app/            Next.js App Router: the 8 MVP screens + API route handlers (§13)
    api/          route handlers (assessments, findings, scores, reports, health, ...)
  core/           deterministic + generative core (no Next/React imports)
    domain/       Zod contracts (§7) + status enums
    ingestion/    file readers (csv/xlsx/json/yaml/md), source manifest
    profiling/    deterministic metrics
    scoring/      trust + AI readiness engine, versioned config loader
    governance/   governance & metadata/lineage evaluation
    compliance/   policy/control ingestion + signal detection (no legal advice)
    impact/       impact scenarios (SIMULATED)
    remediation/  prioritization formula + post-remediation simulation
    reporting/    MD/JSON/PDF renderers, golden-file friendly
    orchestration/ internal state machine, gate handling, retries
    agents/       the 5 logical agents + reviewer/feedback services
    providers/    LLM adapter (OpenAI-compatible) + deterministic fallback
    memory/       repository interfaces + SQLite/Supabase implementations
    observability/ structured logging, agent-run tracing, metrics
  lib/            Supabase client, correlation id, env helpers
config/           scoring.yaml (versioned), policies, scenarios
demo_data/        synthetic golden scenario
tests/            unit / integration / e2e / security / fixtures
```

## 6. Data & storage (ADR-003, ADR-0008)

A **repository abstraction** with two implementations: **SQLite** for local/tests (deterministic,
offline) and **Supabase Postgres** when deployed. Workspace files use an object-store interface:
local filesystem (`outputs/`) in demo mode, **Supabase Storage** deployed. Determinism: same data
+ same versions -> same scores (US-040).

## 7. Orchestration (ADR-002)

An explicit internal **state machine**: each stage has inputs, outputs, status, timestamps, and is
resumable (US-091) without full recompute when upstream dependencies are unchanged. No LangGraph
dependency in the MVP.

## 8. LLM provider (ADR-004)

A single `providers/llm` adapter with an OpenAI-compatible interface. `DEMO_MODE=true` forces a
**deterministic fallback** so the demo runs offline. Timeouts and retries are bounded.

## 9. Security architecture (§10.1)

Secrets only via env; input validation + extension/tool allowlist; path-traversal guards on all
file reads; document content parsed as **data, never instructions**; no external writes; sensitive
actions behind human gates; structured audit log with correlation id.

## 10. Frontend (ADR-001, ADR-0008)

React via **Next.js (App Router)** on Vercel, TypeScript strict. Eight screens from §8.1.
Business-consequence-first; facts / assumptions / simulations rendered with distinct, non-color-only
affordances; every score drills into its calculation; every recommendation drills into its evidence.

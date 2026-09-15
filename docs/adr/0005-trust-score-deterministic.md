# ADR-0005 — Trust Score model

- Status: accepted
- Date: 2026-09-15
- Relates to: cahier ADR-005, §6

## Context

The score must be credible, contestable, and reproducible. LLM-derived scores would be
non-reproducible and easy to challenge (§17).

## Decision

A **weighted deterministic** model driven by a **versioned `config/scoring.yaml`**. Dimensions:
Data Quality, Governance, Metadata, Lineage, Compliance, Business Fitness, AI Readiness, Evidence
Strength. Each dimension exposes weight, sub-scores, and `evidence_ids`.

## Consequences

- Every score carries `score_version`, `calculation_timestamp`, `inputs`, `assumptions`,
  `evidence_ids`.
- Missing minimum evidence yields `INSUFFICIENT_EVIDENCE`, never a guessed value.
- Post-remediation scores are labelled `SIMULATED`.
- Changing weights/logic requires bumping `score_version` (enforced in review).
- The initial weight set is a placeholder to be tuned against golden fixtures in Phase 1.

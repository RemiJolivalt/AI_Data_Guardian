# REQUIREMENTS — digest for agents

Condensed, actionable digest of `CAHIER_DES_CHARGES_AI_DATA_GUARDIAN.md`. On any conflict, the
cahier wins. Section references (§) point back to the cahier.

## In scope (MVP) — §3.1

Configurable scenario; import CSV/XLSX/JSON/YAML/Markdown (PDF if available); read `Manual_Inputs/`;
source inventory + role classification; tabular profiling; ingest DQ rules & policies; anomaly and
missing-control detection; multidimensional Trust Score; AI Readiness Score; business impact
analysis; recommendations + prioritized remediation; human validation; decision & evidence history;
executive dashboard; exportable report (MD/JSON/PDF if enabled); synthetic data + demo mode;
agent observability and run log.

## Out of scope (MVP) — §3.2

Production writes; autonomous data modification; irreversible unapproved actions; replacing a
catalog/DQ/MDM/GRC tool; training/fine-tuning on confidential data; legally binding compliance
engine; certified financial figures; large-scale distributed orchestration.

## Trust model — §6

Dimensions: Data Quality, Governance, Metadata, Lineage, Compliance, Business Fitness, AI Readiness,
Evidence Strength. Rules: score is configurable and versioned; each dimension exposes weight,
sub-scores, and evidence; missing minimum data -> `INSUFFICIENT_EVIDENCE` (never a guessed value);
deterministic rules outrank LLM judgment; every score carries `score_version`,
`calculation_timestamp`, `inputs`, `assumptions`, `evidence_ids`; post-remediation is `SIMULATED`.

Statuses: `TRUSTED`, `CONDITIONALLY_TRUSTED`, `AT_RISK`, `NOT_TRUSTED`, `INSUFFICIENT_EVIDENCE`,
`REVIEW_REQUIRED`.

## Core entities — §7

Workspace, Assessment, BusinessUseCase, DataSource, Dataset, DataField, BusinessTerm, KPI, Policy,
Control, DataQualityRule, Finding, Evidence, Score, ImpactScenario, Recommendation,
RemediationAction, Decision, Feedback, AgentRun, Report.

Contract invariants: a `Finding` and an `Evidence` must always carry ids, source, method, and a
synthetic flag where applicable (see §7.2, §7.3).

## Screens — §8.1

Scenario Selector · Executive Cockpit · Why Not Trusted · Data & KPI Lineage · Remediation Plan
· Human Review Center · Executive Report · Agent Run Inspector.

## API surface — §13

`POST /assessments`, `GET /assessments/{id}`, `POST /assessments/{id}/sources`,
`POST /assessments/{id}/run`, `GET /assessments/{id}/runs`, `GET /assessments/{id}/findings`,
`GET /assessments/{id}/scores`, `GET /assessments/{id}/lineage`, `POST /findings/{id}/decisions`,
`GET /assessments/{id}/recommendations`, `POST /recommendations/{id}/simulate`, `POST /feedback`,
`POST /assessments/{id}/reports`, `GET /reports/{id}`, `GET /health`.
Every endpoint: input schema, output schema, documented errors, correlation id.

## Non-functional — §10

Security: secrets out of repo; input validation; extension/tool allowlist; path-traversal
prevention; action logging; minimal RBAC if auth on; demo/real data separation; dependency scan;
indirect prompt-injection defense.
Quality: deterministic compute functions; unit tests on scoring/profiling/prioritization; JSON
contract tests; per-pipeline integration tests; E2E demo test; golden files for reports.
Observability: structured logs; correlation id; agent traces; success/error/retry metrics; prompt,
rule, and data versions; gate state.
i18n/a11y: FR + EN minimum; keyboard nav; contrast; no meaning by color alone.

## Definition of Ready / Done — §12.3, §12.4

Ready: clear business goal, persona, Given/When/Then, scope & out-of-scope, dependencies, I/O
contracts, error cases, security needs, test data, expected demo proof.
Done: acceptance criteria met; tests pass; no known regression; no known critical vuln; usable
logs; docs updated; ADR if structural; demo scenario verified; independent reviewer `APPROVED`;
required human gates approved.

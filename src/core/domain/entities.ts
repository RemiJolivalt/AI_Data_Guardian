import { z } from "zod";
import { Id, IsoTimestamp, Version, Confidence } from "./ids";
import {
  SourceRole,
  LineageOrigin,
  DecisionType,
  AgentRunStatus,
  AIReadinessStatus,
} from "./enums";

/**
 * Remaining domain entities (cahier §7.1). Kept intentionally lean for the MVP;
 * each carries ids/versions/timestamps and is validated at boundaries only.
 */

export const Workspace = z.object({
  workspace_id: Id,
  name: z.string().min(1),
  created_at: IsoTimestamp,
  is_deleted: z.boolean().default(false),
});
export type Workspace = z.infer<typeof Workspace>;

export const BusinessUseCase = z.object({
  use_case_id: Id,
  name: z.string().min(1),
  description: z.string().default(""),
  target_kpi_ids: z.array(Id).default([]),
});
export type BusinessUseCase = z.infer<typeof BusinessUseCase>;

export const Assessment = z.object({
  assessment_id: Id,
  workspace_id: Id,
  use_case_id: Id.nullable().default(null),
  status: z.string().min(1),
  version: Version,
  is_synthetic: z.boolean().default(true),
  created_at: IsoTimestamp,
});
export type Assessment = z.infer<typeof Assessment>;

export const DataSource = z.object({
  source_id: Id,
  path: z.string().min(1),
  type: z.string().min(1),
  role: SourceRole.default("UNKNOWN"),
  hash: z.string().min(1),
  is_synthetic: z.boolean().default(true),
  processing_status: z.string().default("PENDING"),
});
export type DataSource = z.infer<typeof DataSource>;

export const DataField = z.object({
  field_id: Id,
  dataset_id: Id,
  name: z.string().min(1),
  data_type: z.string().default("unknown"),
  business_meaning: z.string().nullable().default(null),
});
export type DataField = z.infer<typeof DataField>;

export const Dataset = z.object({
  dataset_id: Id,
  source_id: Id,
  name: z.string().min(1),
  row_count: z.number().int().nonnegative().nullable().default(null),
  field_ids: z.array(Id).default([]),
  is_synthetic: z.boolean().default(true),
});
export type Dataset = z.infer<typeof Dataset>;

export const BusinessTerm = z.object({
  term_id: Id,
  name: z.string().min(1),
  definition: z.string().default(""),
});
export type BusinessTerm = z.infer<typeof BusinessTerm>;

export const KPI = z.object({
  kpi_id: Id,
  name: z.string().min(1),
  business_definition: z.string().default(""),
  technical_definition: z.string().nullable().default(null),
  owner: z.string().nullable().default(null),
});
export type KPI = z.infer<typeof KPI>;

export const Policy = z.object({
  policy_id: Id,
  name: z.string().min(1),
  version: Version,
  source_location: z.string().min(1),
});
export type Policy = z.infer<typeof Policy>;

export const Control = z.object({
  control_id: Id,
  policy_id: Id.nullable().default(null),
  description: z.string().default(""),
});
export type Control = z.infer<typeof Control>;

export const DataQualityRule = z.object({
  rule_id: Id,
  dimension: z.string().min(1),
  expression: z.string().min(1),
  threshold: z.number().nullable().default(null),
});
export type DataQualityRule = z.infer<typeof DataQualityRule>;

/** Impact scenarios are always explicit assumptions; simulated values are labelled. */
export const ImpactScenario = z.object({
  scenario_id: Id,
  assessment_id: Id,
  label: z.enum(["LOW", "CENTRAL", "HIGH"]),
  assumptions: z.array(z.string()).default([]),
  estimated_value: z.number().nullable().default(null),
  unit: z.string().nullable().default(null),
  simulated: z.boolean().default(true),
});
export type ImpactScenario = z.infer<typeof ImpactScenario>;

export const Recommendation = z.object({
  recommendation_id: Id,
  assessment_id: Id,
  finding_ids: z.array(Id).default([]),
  title: z.string().min(1),
  rationale: z.string().default(""),
  evidence_ids: z.array(Id).default([]),
});
export type Recommendation = z.infer<typeof Recommendation>;

export const RemediationAction = z.object({
  action_id: Id,
  recommendation_id: Id,
  target_problem: z.string().min(1),
  owner_type: z.string().min(1),
  effort: z.enum(["LOW", "MEDIUM", "HIGH"]),
  impact: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dependencies: z.array(Id).default([]),
  closure_evidence: z.string().default(""),
  priority: z.number(),
  priority_formula_version: Version,
});
export type RemediationAction = z.infer<typeof RemediationAction>;

export const Decision = z.object({
  decision_id: Id,
  finding_id: Id,
  type: DecisionType,
  comment: z.string().default(""),
  actor: z.string().min(1),
  actor_version: Version.optional(),
  decided_at: IsoTimestamp,
});
export type Decision = z.infer<typeof Decision>;

export const Feedback = z.object({
  feedback_id: Id,
  assessment_id: Id,
  content: z.string().min(1),
  approved_for_reuse: z.boolean().default(false),
  author: z.string().min(1),
  approver: z.string().nullable().default(null),
  created_at: IsoTimestamp,
});
export type Feedback = z.infer<typeof Feedback>;

export const AgentRun = z.object({
  run_id: Id,
  assessment_id: Id,
  agent: z.string().min(1),
  goal: z.string().default(""),
  status: AgentRunStatus.default("PENDING"),
  inputs: z.record(z.string(), z.unknown()).default({}),
  outputs: z.record(z.string(), z.unknown()).default({}),
  tools: z.array(z.string()).default([]),
  started_at: IsoTimestamp.optional(),
  ended_at: IsoTimestamp.optional(),
  attempt: z.number().int().positive().default(1),
});
export type AgentRun = z.infer<typeof AgentRun>;

export const Report = z.object({
  report_id: Id,
  assessment_id: Id,
  score_version: Version,
  format: z.enum(["MARKDOWN", "JSON", "PDF"]),
  approval_status: z.string().default("DRAFT"),
  generated_at: IsoTimestamp,
});
export type Report = z.infer<typeof Report>;

export const AIReadiness = z.object({
  assessment_id: Id,
  status: AIReadinessStatus,
  blockers: z.array(z.string()).default([]),
  confidence: Confidence.optional(),
});
export type AIReadiness = z.infer<typeof AIReadiness>;

export const LineageLink = z.object({
  from_asset: Id,
  to_asset: Id,
  origin: LineageOrigin,
});
export type LineageLink = z.infer<typeof LineageLink>;

import { z } from "zod";

/**
 * Enumerations for the domain (cahier §6.1, §6.3, §7.2).
 * Deterministic; no LLM involvement.
 */

export const TrustStatus = z.enum([
  "TRUSTED",
  "CONDITIONALLY_TRUSTED",
  "AT_RISK",
  "NOT_TRUSTED",
  "INSUFFICIENT_EVIDENCE",
  "REVIEW_REQUIRED",
]);
export type TrustStatus = z.infer<typeof TrustStatus>;

export const AIReadinessStatus = z.enum([
  "READY",
  "READY_WITH_CONDITIONS",
  "NOT_READY",
  "INSUFFICIENT_EVIDENCE",
]);
export type AIReadinessStatus = z.infer<typeof AIReadinessStatus>;

/** The 8 trust dimensions (cahier §6.1). */
export const ScoreDimension = z.enum([
  "DATA_QUALITY",
  "GOVERNANCE",
  "METADATA",
  "LINEAGE",
  "COMPLIANCE",
  "BUSINESS_FITNESS",
  "AI_READINESS",
  "EVIDENCE_STRENGTH",
]);
export type ScoreDimension = z.infer<typeof ScoreDimension>;

export const FindingCategory = ScoreDimension;
export type FindingCategory = z.infer<typeof FindingCategory>;

export const Severity = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export type Severity = z.infer<typeof Severity>;

export const FindingStatus = z.enum([
  "OPEN",
  "ACCEPTED",
  "REJECTED",
  "CORRECTED",
  "RESOLVED",
]);
export type FindingStatus = z.infer<typeof FindingStatus>;

export const DecisionType = z.enum(["ACCEPT", "REJECT", "CORRECT"]);
export type DecisionType = z.infer<typeof DecisionType>;

/** Whether a lineage link is a fact or an inference (cahier US-021). */
export const LineageOrigin = z.enum(["DECLARED", "DETECTED", "ASSUMED"]);
export type LineageOrigin = z.infer<typeof LineageOrigin>;

export const SourceRole = z.enum([
  "OPERATIONAL",
  "REFERENCE",
  "CATALOG",
  "POLICY",
  "RULESET",
  "FEEDBACK",
  "UNKNOWN",
]);
export type SourceRole = z.infer<typeof SourceRole>;

export const AgentRunStatus = z.enum([
  "PENDING",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "SKIPPED",
  "RETRIED",
]);
export type AgentRunStatus = z.infer<typeof AgentRunStatus>;

/** Human gates G1–G6 (cahier §5.3). */
export const GateStatus = z.enum(["NOT_REQUIRED", "PENDING", "APPROVED", "REJECTED"]);
export type GateStatus = z.infer<typeof GateStatus>;

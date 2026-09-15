import { z } from "zod";
import { Id, IsoTimestamp, Version, Confidence } from "./ids";
import { ScoreDimension, TrustStatus } from "./enums";

/**
 * A per-dimension sub-score. `value` is null when evidence is insufficient — the
 * platform never substitutes a guessed number (cahier §6.2, US-040).
 */
export const DimensionScore = z.object({
  dimension: ScoreDimension,
  weight: z.number().min(0).max(1),
  value: z.number().min(0).max(1).nullable(),
  status: TrustStatus,
  evidence_ids: z.array(Id).default([]),
});
export type DimensionScore = z.infer<typeof DimensionScore>;

/**
 * Score contract (cahier §6.2). Every score is reproducible and carries its
 * version, timestamp, inputs, assumptions, and evidence links. `simulated` marks
 * post-remediation projections (§6.2, US-061).
 */
export const Score = z.object({
  score_id: Id,
  assessment_id: Id,
  score_version: Version,
  calculation_timestamp: IsoTimestamp,
  overall: z.number().min(0).max(1).nullable(),
  status: TrustStatus,
  dimensions: z.array(DimensionScore),
  inputs: z.record(z.string(), z.unknown()).default({}),
  assumptions: z.array(z.string()).default([]),
  evidence_ids: z.array(Id).default([]),
  confidence: Confidence.optional(),
  simulated: z.boolean().default(false),
});
export type Score = z.infer<typeof Score>;

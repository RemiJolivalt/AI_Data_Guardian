import {
  Score,
  type Finding,
  type Severity,
  type ScoreDimension,
  type TrustStatus,
  type DimensionScore,
} from "@/core/domain";
import type { ScoringConfig } from "@/core/scoring/config";

/**
 * Deterministic Trust Score engine (cahier §6, ADR-0005). No LLM involvement.
 * Dimensions with no evaluation resolve to INSUFFICIENT_EVIDENCE (never a guessed value).
 */

const SEVERITY_PENALTY: Record<Severity, number> = {
  LOW: 0.15,
  MEDIUM: 0.3,
  HIGH: 0.5,
  CRITICAL: 0.8,
};

function statusFromValue(value: number, cfg: ScoringConfig): TrustStatus {
  const t = cfg.status_thresholds;
  if (value >= t.TRUSTED) return "TRUSTED";
  if (value >= t.CONDITIONALLY_TRUSTED) return "CONDITIONALLY_TRUSTED";
  if (value >= t.AT_RISK) return "AT_RISK";
  return "NOT_TRUSTED";
}

export interface ScoreInput {
  assessmentId: string;
  findings: Finding[];
  evaluatedDimensions: ScoreDimension[];
  config: ScoringConfig;
  now: Date;
}

export function computeTrustScore(input: ScoreInput): Score {
  const { config, findings } = input;
  const evaluated = new Set<ScoreDimension>(input.evaluatedDimensions);
  const dimensions: DimensionScore[] = [];

  let weightedSum = 0;
  let weightTotal = 0;

  for (const dim of Object.keys(config.dimensions) as ScoreDimension[]) {
    const weight = config.dimensions[dim]!.weight;
    if (!evaluated.has(dim)) {
      dimensions.push({
        dimension: dim,
        weight,
        value: null,
        status: "INSUFFICIENT_EVIDENCE",
        evidence_ids: [],
      });
      continue;
    }
    const dimFindings = findings.filter((f) => f.category === dim);
    const penalty = dimFindings.reduce((acc, f) => acc + SEVERITY_PENALTY[f.severity], 0);
    const value = Math.max(0, Math.min(1, 1 - penalty));
    const evidenceIds = dimFindings.flatMap((f) => f.evidence_ids);
    dimensions.push({
      dimension: dim,
      weight,
      value,
      status: statusFromValue(value, config),
      evidence_ids: evidenceIds,
    });
    weightedSum += weight * value;
    weightTotal += weight;
  }

  const overall = weightTotal > 0 ? weightedSum / weightTotal : null;
  const status: TrustStatus =
    overall === null ? "INSUFFICIENT_EVIDENCE" : statusFromValue(overall, config);

  const insufficient = dimensions.filter((d) => d.value === null).map((d) => d.dimension);
  const assumptions =
    insufficient.length > 0
      ? [`Dimensions not assessed in this slice: ${insufficient.join(", ")}.`]
      : [];

  return Score.parse({
    score_id: `SCR-${input.assessmentId}`,
    assessment_id: input.assessmentId,
    score_version: config.score_version,
    calculation_timestamp: input.now.toISOString(),
    overall,
    status,
    dimensions,
    inputs: { findingCount: findings.length, evaluatedDimensions: input.evaluatedDimensions },
    assumptions,
    evidence_ids: dimensions.flatMap((d) => d.evidence_ids),
    simulated: false,
  });
}

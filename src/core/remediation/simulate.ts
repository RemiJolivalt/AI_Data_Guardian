import { Score, type Finding, type ScoreDimension } from "@/core/domain";
import type { ScoringConfig } from "@/core/scoring/config";
import { computeTrustScore } from "@/core/scoring/engine";

/**
 * Recomputes the Trust Score as if the given findings were resolved (cahier US-061).
 * The result is always labelled SIMULATED and keeps the same assumptions transparent.
 */
export interface SimulateInput {
  assessmentId: string;
  findings: Finding[];
  resolvedFindingIds: string[];
  evaluatedDimensions: ScoreDimension[];
  config: ScoringConfig;
  now: Date;
}

export function simulateAfterRemediation(input: SimulateInput): Score {
  const resolved = new Set(input.resolvedFindingIds);
  const remaining = input.findings.filter((f) => !resolved.has(f.finding_id));

  const base = computeTrustScore({
    assessmentId: input.assessmentId,
    findings: remaining,
    evaluatedDimensions: input.evaluatedDimensions,
    config: input.config,
    now: input.now,
  });

  return Score.parse({
    ...base,
    score_id: `SCR-SIM-${input.assessmentId}`,
    simulated: true,
    assumptions: [
      ...base.assumptions,
      `SIMULATED: assumes ${input.resolvedFindingIds.length} remediation action(s) completed.`,
    ],
  });
}

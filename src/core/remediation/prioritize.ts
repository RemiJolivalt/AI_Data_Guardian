import { computeTrustScore } from "@/core/scoring/engine";
import type { Finding, ScoreDimension, RemediationAction } from "@/core/domain";
import type { ScoringConfig } from "@/core/scoring/config";

/**
 * Deterministic Trust Improvement Simulator (cahier §6, US-061). Computes the marginal trust gain
 * of each remediation action and an AI-recommended plan (greedy by gain per effort) to reach a
 * target trust. All projections are SIMULATED. No LLM involvement.
 */

const EFFORT_DAYS: Record<RemediationAction["effort"], number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
const DEFAULT_TARGET = 0.7; // CONDITIONALLY_TRUSTED threshold

export interface ActionGain {
  action_id: string;
  target_problem: string;
  effort: RemediationAction["effort"];
  effort_days: number;
  trust_gain: number;
}

export interface TrustSimulation {
  baseline_overall: number;
  target: number;
  actions: ActionGain[];
  recommended_action_ids: string[];
  projected_overall: number;
  total_effort_days: number;
}

export interface SimulationInput {
  assessmentId: string;
  findings: Finding[];
  evaluatedDimensions: ScoreDimension[];
  config: ScoringConfig;
  actions: RemediationAction[];
  resolves: Record<string, string[]>;
  now: Date;
  target?: number;
}

export function buildTrustSimulation(input: SimulationInput): TrustSimulation {
  const target = input.target ?? DEFAULT_TARGET;

  const overallResolving = (resolvedIds: Set<string>): number => {
    const remaining = input.findings.filter((f) => !resolvedIds.has(f.finding_id));
    const score = computeTrustScore({
      assessmentId: input.assessmentId,
      findings: remaining,
      evaluatedDimensions: input.evaluatedDimensions,
      config: input.config,
      now: input.now,
    });
    return score.overall ?? 0;
  };

  const baseline = overallResolving(new Set());

  const actions: ActionGain[] = input.actions.map((a) => {
    const resolved = new Set(input.resolves[a.action_id] ?? []);
    return {
      action_id: a.action_id,
      target_problem: a.target_problem,
      effort: a.effort,
      effort_days: EFFORT_DAYS[a.effort],
      trust_gain: Math.round((overallResolving(resolved) - baseline) * 1000) / 1000,
    };
  });
  actions.sort((x, y) => y.trust_gain / y.effort_days - x.trust_gain / x.effort_days);

  // Greedy: add the action with the best incremental gain per effort until target is reached.
  const chosen = new Set<string>();
  const resolvedFindings = new Set<string>();
  let current = baseline;
  while (current < target) {
    let best: { id: string; gainPerDay: number; overall: number } | null = null;
    for (const a of input.actions) {
      if (chosen.has(a.action_id)) continue;
      const trial = new Set(resolvedFindings);
      for (const fid of input.resolves[a.action_id] ?? []) trial.add(fid);
      const overall = overallResolving(trial);
      const gainPerDay = (overall - current) / EFFORT_DAYS[a.effort];
      if (gainPerDay > 0 && (best === null || gainPerDay > best.gainPerDay)) {
        best = { id: a.action_id, gainPerDay, overall };
      }
    }
    if (!best) break;
    chosen.add(best.id);
    for (const fid of input.resolves[best.id] ?? []) resolvedFindings.add(fid);
    current = best.overall;
  }

  const recommended = input.actions.filter((a) => chosen.has(a.action_id));
  return {
    baseline_overall: Math.round(baseline * 1000) / 1000,
    target,
    actions,
    recommended_action_ids: recommended.map((a) => a.action_id),
    projected_overall: Math.round(current * 1000) / 1000,
    total_effort_days: recommended.reduce((sum, a) => sum + EFFORT_DAYS[a.effort], 0),
  };
}

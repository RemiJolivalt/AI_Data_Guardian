import { Recommendation, RemediationAction, type Finding } from "@/core/domain";

/**
 * Deterministic remediation planning (cahier §7, US-060). Each finding yields one recommendation
 * and one action. Priority is a versioned formula: impact / effort (higher = do first).
 */

export const PRIORITY_FORMULA_VERSION = "1.0.0";

type Level = "LOW" | "MEDIUM" | "HIGH";
const LEVEL_SCORE: Record<Level, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };

export function priorityOf(impact: Level, effort: Level): number {
  return Math.round((LEVEL_SCORE[impact] / LEVEL_SCORE[effort]) * 100) / 100;
}

interface ActionSpec {
  title: string;
  ownerType: string;
  effort: Level;
  impact: Level;
}

// Maps a finding title to its remediation shape (deterministic, scenario-scoped).
const SPEC_BY_TITLE: Record<string, ActionSpec> = {
  "Duplicate customer identifiers": {
    title: "Deduplicate the customer master",
    ownerType: "DATA_ENGINEERING",
    effort: "MEDIUM",
    impact: "HIGH",
  },
  "Stale transactions feed": {
    title: "Enforce the transactions freshness SLA",
    ownerType: "DATA_ENGINEERING",
    effort: "MEDIUM",
    impact: "MEDIUM",
  },
  "Business-critical dataset has no owner": {
    title: "Assign an owner to the customers dataset",
    ownerType: "DATA_GOVERNANCE",
    effort: "LOW",
    impact: "HIGH",
  },
  "KPI definition not governed": {
    title: "Assign a Net Revenue owner and reconcile its definition",
    ownerType: "DATA_GOVERNANCE",
    effort: "LOW",
    impact: "HIGH",
  },
};

export interface RemediationPlan {
  recommendations: Recommendation[];
  actions: RemediationAction[];
  /** Finding ids each action would close, keyed by action_id. */
  resolves: Record<string, string[]>;
}

export function buildRemediationPlan(assessmentId: string, findings: Finding[]): RemediationPlan {
  const recommendations: Recommendation[] = [];
  const actions: RemediationAction[] = [];
  const resolves: Record<string, string[]> = {};

  findings.forEach((finding, i) => {
    const spec = SPEC_BY_TITLE[finding.title];
    if (!spec) return;
    const n = String(i + 1).padStart(2, "0");
    const recommendationId = `REC-${assessmentId}-${n}`;
    const actionId = `ACT-${assessmentId}-${n}`;

    recommendations.push(
      Recommendation.parse({
        recommendation_id: recommendationId,
        assessment_id: assessmentId,
        finding_ids: [finding.finding_id],
        title: spec.title,
        rationale: finding.business_consequence,
        evidence_ids: finding.evidence_ids,
      }),
    );

    actions.push(
      RemediationAction.parse({
        action_id: actionId,
        recommendation_id: recommendationId,
        target_problem: finding.title,
        owner_type: spec.ownerType,
        effort: spec.effort,
        impact: spec.impact,
        dependencies: [],
        closure_evidence: `Re-run assessment shows ${finding.title} resolved.`,
        priority: priorityOf(spec.impact, spec.effort),
        priority_formula_version: PRIORITY_FORMULA_VERSION,
      }),
    );

    resolves[actionId] = [finding.finding_id];
  });

  actions.sort((a, b) => b.priority - a.priority);
  return { recommendations, actions, resolves };
}

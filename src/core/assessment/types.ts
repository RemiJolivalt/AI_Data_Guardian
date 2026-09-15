import type { Evidence, Finding, Score, AIReadiness } from "@/core/domain";
import type { DataSource, ImpactScenario, Recommendation, RemediationAction } from "@/core/domain";

/** Aggregated, serializable output of one assessment run (feeds the API and the cockpit). */
export interface AssessmentResult {
  assessment_id: string;
  scenario: string;
  is_synthetic: true;
  generated_at: string;
  sources: DataSource[];
  evidence: Evidence[];
  findings: Finding[];
  score: Score;
  ai_readiness: AIReadiness;
  impact: ImpactScenario[];
  recommendations: Recommendation[];
  remediation: RemediationAction[];
  /** Trust Score projected if every remediation action is completed. Always SIMULATED. */
  simulated_score: Score;
}

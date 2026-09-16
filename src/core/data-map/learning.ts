import type { ExpertDecision } from "@/core/data-map/decisions";

/** Aggregates expert decisions into Learning Engine KPIs and the reuse history. Pure. */

export interface LearningPropagation {
  sourceObjectId: string;
  targetObjectId: string;
  controlLabel: string;
}

export interface LearningStats {
  proposed: number;
  validated: number;
  rejected: number;
  rulesReused: number;
  objectsEnriched: number;
  propagations: LearningPropagation[];
}

export function summarizeLearning(decisions: ExpertDecision[]): LearningStats {
  const capitalized = decisions.filter((d) => d.status === "Capitalisé");
  const enriched = new Set(capitalized.map((d) => d.targetObjectId));
  const reused = capitalized.filter((d) => d.targetObjectId !== d.sourceObjectId);
  return {
    proposed: decisions.length,
    validated: capitalized.length,
    rejected: decisions.filter((d) => d.status === "Rejeté").length,
    rulesReused: reused.length,
    objectsEnriched: enriched.size,
    propagations: capitalized.map((d) => ({
      sourceObjectId: d.sourceObjectId,
      targetObjectId: d.targetObjectId,
      controlLabel: d.controlLabel,
    })),
  };
}

export function capitalizedByTarget(decisions: ExpertDecision[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const d of decisions) {
    if (d.status === "Capitalisé") counts[d.targetObjectId] = (counts[d.targetObjectId] ?? 0) + 1;
  }
  return counts;
}

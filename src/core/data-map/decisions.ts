import type { CapitalizedDecision } from "@/core/data-map/analysis";
import type { DecisionStatus, GuardianRecommendation } from "@/core/data-map/types";

/**
 * Expert decisions store (capitalization). In-memory and process-scoped: the demonstrator does not
 * require durable persistence (recommendations doc §6). A validated decision becomes reusable
 * knowledge re-injected into the next analysis of the same source object.
 */

export interface ExpertDecision {
  recommendationId: string;
  sourceObjectId: string;
  targetObjectId: string;
  targetTableId?: string;
  controlLabel: string;
  parameter?: string;
  similarityReason: string;
  expectedBusinessImpact: string;
  confidence: number;
  status: DecisionStatus;
  expertComment?: string;
  /** Caller-provided stable timestamp (core stays wall-clock free). */
  decidedAt: string;
}

export interface DecisionInput {
  recommendation: GuardianRecommendation;
  status: DecisionStatus;
  decidedAt: string;
  controlLabel?: string;
  parameter?: string;
  expertComment?: string;
}

export interface DecisionsStore {
  record(input: DecisionInput): ExpertDecision;
  list(): ExpertDecision[];
  capitalizedCount(): number;
  decidedFor(sourceObjectId: string): CapitalizedDecision[];
}

export class InMemoryDecisionsStore implements DecisionsStore {
  private readonly decisions = new Map<string, ExpertDecision>();

  record(input: DecisionInput): ExpertDecision {
    const { recommendation: rec, status } = input;
    const decision: ExpertDecision = {
      recommendationId: rec.id,
      sourceObjectId: rec.sourceObjectId,
      targetObjectId: rec.targetObjectId,
      targetTableId: rec.targetTableId,
      controlLabel: input.controlLabel?.trim() || rec.controlLabel,
      parameter: input.parameter ?? rec.parameter,
      similarityReason: rec.similarityReason,
      expectedBusinessImpact: rec.expectedBusinessImpact,
      confidence: rec.confidence,
      status,
      expertComment: input.expertComment,
      decidedAt: input.decidedAt,
    };
    this.decisions.set(rec.id, decision);
    return decision;
  }

  list(): ExpertDecision[] {
    return [...this.decisions.values()];
  }

  capitalizedCount(): number {
    return this.list().filter((d) => d.status === "Capitalisé").length;
  }

  decidedFor(sourceObjectId: string): CapitalizedDecision[] {
    return this.list()
      .filter((d) => d.status !== "À valider")
      .map<CapitalizedDecision>((d) => ({
        recommendationId: d.recommendationId,
        status: d.status === "Capitalisé" ? "Capitalisé" : "Rejeté",
        controlLabel: d.controlLabel,
        sourceObjectId: d.sourceObjectId,
        expertComment: d.expertComment,
      }))
      .filter((d) => d.sourceObjectId === sourceObjectId || sourceObjectId === "*");
  }
}

// Process-scoped shared instance so the demo accumulates decisions within a run.
const shared = new InMemoryDecisionsStore();

export function getDecisionsStore(): DecisionsStore {
  return shared;
}

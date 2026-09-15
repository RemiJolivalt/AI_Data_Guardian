import type { CoverageResult, Gap } from "@/core/customer/coverage";
import type { KnowledgePack } from "@/core/customer/knowledgePack";

/**
 * Deterministic, grounded suggestion engine (cahier §5.2 A05/A14, §11.2). Every suggestion is
 * PROPOSED, cites its basis (a knowledge-pack entry), and carries a confidence. Nothing is applied
 * without human validation (G2/G6). This is the DEMO_MODE fallback; an LLM may later refine wording
 * only — never the fact.
 */

export type SuggestionType =
  | "DESCRIPTION"
  | "PII_CLASSIFICATION"
  | "DQ_RULE"
  | "LINEAGE";

export type SuggestionStory = "identity" | "consent" | "order_integrity" | "general";

export interface Suggestion {
  suggestion_id: string;
  type: SuggestionType;
  asset: string;
  column: string;
  proposed_value: string;
  basis: string[];
  confidence: number;
  status: "PROPOSED";
  rationale: string;
  story: SuggestionStory;
}

const CONFIDENCE: Record<SuggestionType, number> = {
  DESCRIPTION: 0.9,
  PII_CLASSIFICATION: 0.95,
  DQ_RULE: 0.85,
  LINEAGE: 0.8,
};

function storyOf(asset: string, column: string): SuggestionStory {
  if (column === "marketing_consent" || asset === "CONSENT" || column.startsWith("consent")) {
    return "consent";
  }
  if (asset === "ORDER" && column === "customer_id") return "order_integrity";
  const identity = new Set([
    "customer_id",
    "email",
    "phone_number",
    "first_name",
    "last_name",
    "country_code",
    "postal_code",
  ]);
  if (asset === "CUSTOMER" && identity.has(column)) return "identity";
  return "general";
}

function ruleProposal(kpColumn: KnowledgePack["columns"][string]): string {
  if (kpColumn.expected_pattern) return `PATTERN ${kpColumn.expected_pattern}`;
  return kpColumn.expected_rules.join(", ");
}

export function generateSuggestions(
  coverage: CoverageResult,
  knowledgePack: KnowledgePack,
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const kpId = knowledgePack.knowledge_pack_id;
  let n = 0;
  const nextId = (): string => {
    n += 1;
    return `SUG-${String(n).padStart(3, "0")}`;
  };

  const push = (
    gap: Gap,
    type: SuggestionType,
    proposed: string,
    basis: string[],
    rationale: string,
  ): void => {
    suggestions.push({
      suggestion_id: nextId(),
      type,
      asset: gap.asset,
      column: gap.column,
      proposed_value: proposed,
      basis,
      confidence: CONFIDENCE[type],
      status: "PROPOSED",
      rationale,
      story: storyOf(gap.asset, gap.column),
    });
  };

  for (const gap of coverage.gaps) {
    const kp = knowledgePack.columns[gap.column];

    if (gap.missing_description && kp?.canonical_description) {
      push(
        gap,
        "DESCRIPTION",
        kp.canonical_description,
        [`${kpId}:${gap.column}`],
        "Grounded in the curated knowledge pack for this business term.",
      );
    }
    if (gap.pii_unclassified) {
      push(
        gap,
        "PII_CLASSIFICATION",
        "PII",
        [`${kpId}:${gap.column}`],
        "The knowledge pack marks this attribute as personal data; the catalog leaves it unclassified.",
      );
    }
    if (gap.missing_rule && kp && kp.expected_rules.length > 0) {
      push(
        gap,
        "DQ_RULE",
        ruleProposal(kp),
        [`${kpId}:${gap.column}`],
        "Expected data-quality control for this attribute is not present in the DQ tool.",
      );
    }
    if (gap.missing_lineage && knowledgePack.lineage_chain.length > 0) {
      push(
        gap,
        "LINEAGE",
        knowledgePack.lineage_chain.join(" -> "),
        [`${kpId}:lineage_chain`],
        "No upstream lineage declared; proposing the domain's reference chain for validation.",
      );
    }
  }

  // Highest-confidence, story-grouped first for the demo.
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

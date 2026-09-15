import { columnKey, type CatalogEntry, type RuleIndex } from "@/core/customer/catalog";
import { computeCoverage, type ColumnRef, type CoverageResult } from "@/core/customer/coverage";
import type { KnowledgePack } from "@/core/customer/knowledgePack";
import type { Suggestion } from "@/core/customer/suggestions";

/**
 * Trust Learning Engine (cahier §5.2 A14, §8 "virtuous loop"). A validated suggestion becomes a
 * LearnedRule that PROPAGATES to similar attributes (by semantic token) and augments coverage.
 * Deterministic; no LLM. Write-back is a simulated export, never an external write (MVP).
 */

export type LearnedType = "DESCRIPTION" | "PII_CLASSIFICATION" | "DQ_RULE" | "LINEAGE";

export interface LearnedRule {
  rule_id: string;
  type: LearnedType;
  /** TOKEN propagates to every column whose name contains the token; COLUMN is exact. */
  match: { mode: "TOKEN" | "COLUMN"; value: string };
  proposed_value: string;
  source_suggestion_id: string;
  approved_by: string;
  approved_at: string;
}

/** Contact tokens that legitimately propagate a classification across similar columns. */
const PROPAGATION_TOKENS = ["email", "phone", "iban", "ssn", "vat"];

/** Derive a learned rule from an approved suggestion (chooses TOKEN propagation when relevant). */
export function ruleFromSuggestion(s: Suggestion, approvedBy: string, approvedAt: string): LearnedRule {
  const lower = s.column.toLowerCase();
  const token = PROPAGATION_TOKENS.find((tk) => lower.includes(tk));
  return {
    rule_id: `LRN-${s.suggestion_id}`,
    type: s.type,
    match: token ? { mode: "TOKEN", value: token } : { mode: "COLUMN", value: s.column },
    proposed_value: s.proposed_value,
    source_suggestion_id: s.suggestion_id,
    approved_by: approvedBy,
    approved_at: approvedAt,
  };
}

export function columnMatchesRule(column: string, rule: LearnedRule): boolean {
  const c = column.toLowerCase();
  return rule.match.mode === "COLUMN"
    ? c === rule.match.value.toLowerCase()
    : c.includes(rule.match.value.toLowerCase());
}

/** Columns in the universe a rule would touch. */
export function propagatedColumns(universe: ColumnRef[], rule: LearnedRule): ColumnRef[] {
  return universe.filter((u) => columnMatchesRule(u.column, rule));
}

/** Returns a coverage result computed as if the learned rules were applied to the catalog/rules. */
export function computeCoverageWithLearning(
  universe: ColumnRef[],
  catalog: Map<string, CatalogEntry>,
  rules: RuleIndex,
  knowledgePack: KnowledgePack,
  learned: LearnedRule[],
): CoverageResult {
  const augmentedCatalog = new Map(catalog);
  const activeKeys = new Set(rules.activeKeys);

  for (const { asset, column } of universe) {
    const key = columnKey(asset, column);
    for (const rule of learned) {
      if (!columnMatchesRule(column, rule)) continue;
      const base: CatalogEntry = augmentedCatalog.get(key) ?? {
        asset,
        column,
        business_description: "",
        data_owner: "",
        sensitivity: "",
        upstream_asset: "",
      };
      const patched: CatalogEntry = { ...base };
      if (rule.type === "DESCRIPTION") {
        patched.business_description = patched.business_description || rule.proposed_value || "learned";
      } else if (rule.type === "PII_CLASSIFICATION") {
        patched.sensitivity = "PII";
      } else if (rule.type === "LINEAGE") {
        patched.upstream_asset = patched.upstream_asset || rule.proposed_value || "learned";
      } else if (rule.type === "DQ_RULE") {
        activeKeys.add(key);
      }
      augmentedCatalog.set(key, patched);
    }
  }

  return computeCoverage(universe, augmentedCatalog, { activeKeys, typesByKey: rules.typesByKey }, knowledgePack);
}

export interface LearningImpact {
  approved: number;
  propagated_columns: number;
  knowledge_gain: { definitions: number; pii: number; rules: number; lineage: number };
  coverage_before: number;
  coverage_after: number;
  governance_before: number;
  governance_after: number;
}

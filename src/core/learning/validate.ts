import { loadDomainInputs } from "@/core/domain-pack/runDomainAssessment";
import { computeCoverage, type ColumnRef } from "@/core/customer/coverage";
import { generateSuggestions } from "@/core/customer/suggestions";
import {
  computeCoverageWithLearning,
  propagatedColumns,
  ruleFromSuggestion,
  type LearnedRule,
  type LearningImpact,
} from "@/core/learning/engine";

/**
 * Validates (approves) one suggestion: derives a LearnedRule, propagates it to similar attributes,
 * and returns the before/after coverage impact. Deterministic; the write-back is a simulated export.
 */

export interface ValidationResult {
  domain_id: string;
  suggestion_id: string;
  learned_rule: LearnedRule;
  propagated: ColumnRef[];
  impact: LearningImpact;
}

export interface ValidateOptions {
  rootDir: string;
  domainId: string;
  suggestionId: string;
  existing?: LearnedRule[];
  approvedBy?: string;
  now?: Date;
}

export function validateSuggestion(options: ValidateOptions): ValidationResult {
  const existing = options.existing ?? [];
  const approvedBy = options.approvedBy ?? "data.steward@corp.example";
  const now = options.now ?? new Date();

  const inputs = loadDomainInputs(options.rootDir, options.domainId);
  const baseCoverage = computeCoverage(inputs.universe, inputs.catalog, inputs.rules, inputs.knowledgePack);
  const suggestions = generateSuggestions(baseCoverage, inputs.knowledgePack, inputs.manifest.stories);
  const suggestion = suggestions.find((s) => s.suggestion_id === options.suggestionId);
  if (!suggestion) {
    throw new Error(`Unknown suggestion: ${options.suggestionId}`);
  }

  const rule = ruleFromSuggestion(suggestion, approvedBy, now.toISOString());

  const before = computeCoverageWithLearning(
    inputs.universe,
    inputs.catalog,
    inputs.rules,
    inputs.knowledgePack,
    existing,
  );
  const after = computeCoverageWithLearning(
    inputs.universe,
    inputs.catalog,
    inputs.rules,
    inputs.knowledgePack,
    [...existing, rule],
  );
  const propagated = propagatedColumns(inputs.universe, rule);

  const gain = { definitions: 0, pii: 0, rules: 0, lineage: 0 };
  if (rule.type === "DESCRIPTION") gain.definitions = propagated.length;
  else if (rule.type === "PII_CLASSIFICATION") gain.pii = propagated.length;
  else if (rule.type === "DQ_RULE") gain.rules = propagated.length;
  else gain.lineage = propagated.length;

  const impact: LearningImpact = {
    approved: 1,
    propagated_columns: propagated.length,
    knowledge_gain: gain,
    coverage_before: before.coverage.overall,
    coverage_after: after.coverage.overall,
    governance_before: before.coverage.governance.ratio,
    governance_after: after.coverage.governance.ratio,
  };

  return {
    domain_id: options.domainId,
    suggestion_id: options.suggestionId,
    learned_rule: rule,
    propagated,
    impact,
  };
}

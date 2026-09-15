import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv } from "@/core/ingestion/csv";
import { loadCatalog, loadRules, type CatalogEntry, type RuleIndex } from "@/core/customer/catalog";
import { parseKnowledgePack, type KnowledgePack } from "@/core/customer/knowledgePack";
import { computeCoverage, type ColumnRef, type CoverageResult } from "@/core/customer/coverage";
import { generateSuggestions, type Suggestion } from "@/core/customer/suggestions";
import { computeCoverageWithLearning, type LearnedRule } from "@/core/learning/engine";
import { getDomain } from "@/core/domain-pack/registry";
import type { DomainManifest, DomainStory } from "@/core/domain-pack/manifest";

/**
 * Generic Domain Pack assessment: any registered business object (Customer, Product, HR, ...)
 * is evaluated by the same deterministic engine, driven entirely by its manifest.
 */

export interface DomainInputs {
  manifest: DomainManifest;
  universe: ColumnRef[];
  catalog: Map<string, CatalogEntry>;
  rules: RuleIndex;
  knowledgePack: KnowledgePack;
}

/** Loads and parses all inputs for a domain (shared by assessment and the learning engine). */
export function loadDomainInputs(rootDir: string, domainId: string): DomainInputs {
  const domain = getDomain(rootDir, domainId);
  if (!domain) {
    throw new Error(`Unknown domain: ${domainId}`);
  }
  const { manifest, dir } = domain;
  const domainDir = join(rootDir, dir);

  const universe: ColumnRef[] = [];
  for (const spec of manifest.assets) {
    const table = parseCsv(readFileSync(join(domainDir, spec.file), "utf8"));
    for (const column of table.headers) {
      universe.push({ asset: spec.asset, column });
    }
  }

  const catalog = loadCatalog(readFileSync(join(domainDir, manifest.catalog_file), "utf8"));
  const rules = loadRules(readFileSync(join(domainDir, manifest.rules_file), "utf8"));
  const knowledgePack = parseKnowledgePack(
    readFileSync(join(domainDir, manifest.knowledge_pack_file), "utf8"),
  );

  return { manifest, universe, catalog, rules, knowledgePack };
}

export interface DomainAssessmentResult extends CoverageResult {
  domain_id: string;
  label: string;
  object_type: string;
  is_synthetic: true;
  knowledge_pack_id: string;
  generated_at: string;
  stories: Record<string, DomainStory>;
  suggestions: Suggestion[];
}

export interface DomainRunOptions {
  rootDir: string;
  domainId: string;
  now?: Date;
  /** Optional supervision scope: only these assets (tables) are assessed. Empty/undefined = all. */
  assets?: string[];
  /** Capitalized knowledge applied before assessing (improves coverage over time). */
  learned?: LearnedRule[];
}

export function runDomainAssessment(options: DomainRunOptions): DomainAssessmentResult {
  const now = options.now ?? new Date();
  const inputs = loadDomainInputs(options.rootDir, options.domainId);

  const scope = options.assets?.filter((a) => a.length > 0) ?? [];
  const universe =
    scope.length > 0 ? inputs.universe.filter((u) => scope.includes(u.asset)) : inputs.universe;

  const learned = options.learned ?? [];
  const coverage =
    learned.length > 0
      ? computeCoverageWithLearning(universe, inputs.catalog, inputs.rules, inputs.knowledgePack, learned)
      : computeCoverage(universe, inputs.catalog, inputs.rules, inputs.knowledgePack);
  const suggestions = generateSuggestions(coverage, inputs.knowledgePack, inputs.manifest.stories);

  return {
    domain_id: inputs.manifest.domain_id,
    label: inputs.manifest.label,
    object_type: inputs.manifest.object_type,
    is_synthetic: true,
    knowledge_pack_id: inputs.knowledgePack.knowledge_pack_id,
    generated_at: now.toISOString(),
    stories: inputs.manifest.stories,
    suggestions,
    ...coverage,
  };
}

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv } from "@/core/ingestion/csv";
import { loadCatalog, loadRules } from "@/core/customer/catalog";
import { parseKnowledgePack } from "@/core/customer/knowledgePack";
import { computeCoverage, type ColumnRef, type CoverageResult } from "@/core/customer/coverage";
import { generateSuggestions, type Suggestion } from "@/core/customer/suggestions";
import { getDomain } from "@/core/domain-pack/registry";
import type { DomainStory } from "@/core/domain-pack/manifest";

/**
 * Generic Domain Pack assessment: any registered business object (Customer, Product, HR, ...)
 * is evaluated by the same deterministic engine, driven entirely by its manifest.
 */

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
}

export function runDomainAssessment(options: DomainRunOptions): DomainAssessmentResult {
  const now = options.now ?? new Date();
  const domain = getDomain(options.rootDir, options.domainId);
  if (!domain) {
    throw new Error(`Unknown domain: ${options.domainId}`);
  }
  const { manifest, dir } = domain;
  const domainDir = join(options.rootDir, dir);

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

  const coverage = computeCoverage(universe, catalog, rules, knowledgePack);
  const suggestions = generateSuggestions(coverage, knowledgePack, manifest.stories);

  return {
    domain_id: manifest.domain_id,
    label: manifest.label,
    object_type: manifest.object_type,
    is_synthetic: true,
    knowledge_pack_id: knowledgePack.knowledge_pack_id,
    generated_at: now.toISOString(),
    stories: manifest.stories,
    suggestions,
    ...coverage,
  };
}

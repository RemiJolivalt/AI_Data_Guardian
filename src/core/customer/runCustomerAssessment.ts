import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseCsv } from "@/core/ingestion/csv";
import { loadCatalog, loadRules } from "@/core/customer/catalog";
import { parseKnowledgePack } from "@/core/customer/knowledgePack";
import { computeCoverage, type ColumnRef, type CoverageResult } from "@/core/customer/coverage";

/**
 * Orchestrates the deterministic Customer Trust coverage assessment: reads the CRM tables,
 * the simulated catalog and DQ rules, and the curated knowledge pack, then computes coverage
 * and gaps. No LLM involvement.
 */

const ASSET_FILES: { file: string; asset: string }[] = [
  { file: "customer.csv", asset: "CUSTOMER" },
  { file: "customer_address.csv", asset: "CUSTOMER_ADDRESS" },
  { file: "orders.csv", asset: "ORDER" },
  { file: "customer_interaction.csv", asset: "CUSTOMER_INTERACTION" },
  { file: "consent.csv", asset: "CONSENT" },
];

export interface CustomerAssessmentResult extends CoverageResult {
  scenario: "customer_trust_assessment";
  is_synthetic: true;
  knowledge_pack_id: string;
  generated_at: string;
}

export interface CustomerRunOptions {
  rootDir: string;
  now?: Date;
}

export function runCustomerAssessment(options: CustomerRunOptions): CustomerAssessmentResult {
  const now = options.now ?? new Date();
  const dir = join(options.rootDir, "demo_data", "customer_domain");

  const universe: ColumnRef[] = [];
  for (const { file, asset } of ASSET_FILES) {
    const table = parseCsv(readFileSync(join(dir, file), "utf8"));
    for (const column of table.headers) {
      universe.push({ asset, column });
    }
  }

  const catalog = loadCatalog(readFileSync(join(dir, "governance_metadata.csv"), "utf8"));
  const rules = loadRules(readFileSync(join(dir, "data_quality_rules.csv"), "utf8"));
  const knowledgePack = parseKnowledgePack(
    readFileSync(join(dir, "industry_customer_context.yaml"), "utf8"),
  );

  const coverage = computeCoverage(universe, catalog, rules, knowledgePack);

  return {
    scenario: "customer_trust_assessment",
    is_synthetic: true,
    knowledge_pack_id: knowledgePack.knowledge_pack_id,
    generated_at: now.toISOString(),
    ...coverage,
  };
}

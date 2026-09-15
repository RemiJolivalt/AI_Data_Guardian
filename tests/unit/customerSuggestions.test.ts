import { describe, it, expect } from "vitest";
import { loadCatalog, loadRules } from "@/core/customer/catalog";
import { parseKnowledgePack } from "@/core/customer/knowledgePack";
import { computeCoverage, type ColumnRef } from "@/core/customer/coverage";
import { generateSuggestions } from "@/core/customer/suggestions";

const catalogCsv = [
  "asset_name,column_name,technical_type,business_name,business_description,business_term,data_owner,data_steward,sensitivity,source_system,upstream_asset,transformation,downstream_usage,critical_data_element,status",
  "CUSTOMER,email,VARCHAR,Email,,Contact,,,,CRM,,,C360,false,ACTIVE",
  "",
].join("\n");

const rulesCsv = [
  "rule_id,asset_name,column_name,quality_dimension,rule_description,rule_type,expected_pattern,threshold,severity,status,last_result,validation_status",
  "",
].join("\n");

const kp = parseKnowledgePack(`
knowledge_pack_id: KP-TEST
version: "1.0.0"
is_curated: true
industry: Retail
domain: Customer
lineage_chain: [CRM_CUSTOMER, CUSTOMER_360]
columns:
  email:
    canonical_description: "Primary email contact point of the customer."
    is_pii: true
    expected_pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'
    expected_rules: [PATTERN]
`);

describe("Grounded suggestion engine (§11.2)", () => {
  const universe: ColumnRef[] = [{ asset: "CUSTOMER", column: "email" }];
  const coverage = computeCoverage(universe, loadCatalog(catalogCsv), loadRules(rulesCsv), kp);
  const suggestions = generateSuggestions(coverage, kp);

  it("proposes description, PII, DQ rule and lineage for an uncovered PII column", () => {
    const types = suggestions.map((s) => s.type).sort();
    expect(types).toEqual(["DESCRIPTION", "DQ_RULE", "LINEAGE", "PII_CLASSIFICATION"]);
  });

  it("every suggestion is PROPOSED, grounded (basis) and has a confidence", () => {
    for (const s of suggestions) {
      expect(s.status).toBe("PROPOSED");
      expect(s.basis.length).toBeGreaterThan(0);
      expect(s.confidence).toBeGreaterThan(0);
    }
  });

  it("grounds the description in the knowledge pack value", () => {
    const desc = suggestions.find((s) => s.type === "DESCRIPTION");
    expect(desc?.proposed_value).toBe("Primary email contact point of the customer.");
    expect(desc?.basis).toContain("KP-TEST:email");
  });

  it("tags the email column with the identity story", () => {
    expect(suggestions.every((s) => s.story === "identity")).toBe(true);
  });
});

import { describe, it, expect } from "vitest";
import { loadCatalog, loadRules } from "@/core/customer/catalog";
import { parseKnowledgePack } from "@/core/customer/knowledgePack";
import { computeCoverage, type ColumnRef } from "@/core/customer/coverage";

const catalogCsv = [
  "asset_name,column_name,technical_type,business_name,business_description,business_term,data_owner,data_steward,sensitivity,source_system,upstream_asset,transformation,downstream_usage,critical_data_element,status",
  "CUSTOMER,customer_id,VARCHAR,Id,Unique id,Customer,owner@x,steward@x,INTERNAL,CRM,CRM_CUSTOMER,,C360,true,ACTIVE",
  "CUSTOMER,email,VARCHAR,Email,,Contact,,,,CRM,,,C360,false,ACTIVE",
  "",
].join("\n");

const rulesCsv = [
  "rule_id,asset_name,column_name,quality_dimension,rule_description,rule_type,expected_pattern,threshold,severity,status,last_result,validation_status",
  "R1,CUSTOMER,customer_id,COMPLETENESS,req,NOT_NULL,,1,HIGH,ACTIVE,PASS,VALIDATED",
  "",
].join("\n");

const kp = parseKnowledgePack(`
knowledge_pack_id: KP-TEST
version: "1.0.0"
is_curated: true
industry: Retail
domain: Customer
lineage_chain: [A, B]
columns:
  customer_id: { is_pii: false, expected_rules: [NOT_NULL] }
  email: { is_pii: true, expected_rules: [PATTERN] }
`);

describe("Customer coverage (deterministic)", () => {
  const universe: ColumnRef[] = [
    { asset: "CUSTOMER", column: "customer_id" },
    { asset: "CUSTOMER", column: "email" },
  ];
  const catalog = loadCatalog(catalogCsv);
  const rules = loadRules(rulesCsv);
  const result = computeCoverage(universe, catalog, rules, kp);

  it("counts metadata coverage only for described columns", () => {
    expect(result.coverage.metadata).toMatchObject({ covered: 1, total: 2 });
  });

  it("flags an unclassified PII column", () => {
    const emailGap = result.gaps.find((g) => g.column === "email");
    expect(emailGap?.pii_unclassified).toBe(true);
    expect(result.gap_counts.pii).toBe(1);
  });

  it("flags a missing expected rule (email PATTERN) but not a satisfied one", () => {
    const emailGap = result.gaps.find((g) => g.column === "email");
    expect(emailGap?.missing_rule).toBe(true);
    // customer_id is fully covered (has its NOT_NULL rule), so it is not a gap at all.
    expect(result.gaps.find((g) => g.column === "customer_id")).toBeUndefined();
  });

  it("computes overall as the average of the four ratios", () => {
    // metadata 1/2, governance 1/2, quality 1/2, lineage 1/2 -> 0.5
    expect(result.coverage.overall).toBe(0.5);
  });
});

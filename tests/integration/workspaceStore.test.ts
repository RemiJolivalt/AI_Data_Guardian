import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { InMemoryWorkspaceStore } from "@/core/memory/workspaceStore";
import { runDomainAssessment } from "@/core/domain-pack/runDomainAssessment";
import { ruleFromSuggestion } from "@/core/learning/engine";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("WorkspaceStore (in-memory)", () => {
  it("persists and reads scope", async () => {
    const store = new InMemoryWorkspaceStore();
    expect(await store.getScope("customer")).toBeNull();
    await store.setScope("customer", ["CUSTOMER"]);
    expect(await store.getScope("customer")).toEqual(["CUSTOMER"]);
  });

  it("persists learned rules and context documents", async () => {
    const store = new InMemoryWorkspaceStore();
    await store.saveLearnedRule("customer", {
      rule_id: "LRN-1",
      type: "PII_CLASSIFICATION",
      match: { mode: "TOKEN", value: "email" },
      proposed_value: "PII",
      source_suggestion_id: "SUG-1",
      approved_by: "steward",
      approved_at: now.toISOString(),
    });
    expect(await store.listLearnedRules()).toHaveLength(1);

    await store.addDocument({
      document_id: "DOC-1",
      domain_id: "customer",
      name: "GDPR policy",
      doc_type: "policy",
      text: "…",
      is_synthetic: true,
      created_at: now.toISOString(),
    });
    expect((await store.listDocuments("customer")).map((d) => d.name)).toContain("GDPR policy");
  });
});

describe("Learned rules improve subsequent assessments (capitalization)", () => {
  it("applying an email PII learned rule raises governance coverage", () => {
    const base = runDomainAssessment({ rootDir, domainId: "customer", now });
    const emailPii = base.suggestions.find(
      (s) => s.type === "PII_CLASSIFICATION" && s.column === "email",
    );
    expect(emailPii).toBeDefined();
    const learned = [ruleFromSuggestion(emailPii!, "steward", now.toISOString())];

    const after = runDomainAssessment({ rootDir, domainId: "customer", now, learned });
    expect(after.coverage.governance.ratio).toBeGreaterThan(base.coverage.governance.ratio);
    expect(after.gap_counts.pii).toBeLessThanOrEqual(base.gap_counts.pii);
  });
});

import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { runDomainAssessment } from "@/core/domain-pack/runDomainAssessment";
import { validateSuggestion } from "@/core/learning/validate";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

function emailPiiSuggestionId(): string {
  const r = runDomainAssessment({ rootDir, domainId: "customer", now });
  const s = r.suggestions.find(
    (x) => x.type === "PII_CLASSIFICATION" && x.asset === "CUSTOMER" && x.column === "email",
  );
  if (!s) throw new Error("expected an email PII suggestion");
  return s.suggestion_id;
}

describe("Trust Learning Engine — approve & propagate (§8 virtuous loop)", () => {
  const result = validateSuggestion({ rootDir, domainId: "customer", suggestionId: emailPiiSuggestionId(), now });

  it("propagates the approved PII classification to all email-like attributes", () => {
    const cols = result.propagated.map((p) => p.column);
    expect(cols).toContain("email");
    expect(cols).toContain("contact_email");
    expect(cols).toContain("billing_email");
    expect(result.impact.propagated_columns).toBeGreaterThanOrEqual(4);
    expect(result.impact.knowledge_gain.pii).toBe(result.impact.propagated_columns);
  });

  it("increases governance coverage after validation (learning improves the whole estate)", () => {
    expect(result.impact.governance_after).toBeGreaterThan(result.impact.governance_before);
    expect(result.impact.coverage_after).toBeGreaterThanOrEqual(result.impact.coverage_before);
  });

  it("is deterministic", () => {
    const again = validateSuggestion({ rootDir, domainId: "customer", suggestionId: emailPiiSuggestionId(), now });
    expect(again.impact).toEqual(result.impact);
  });

  it("throws on an unknown suggestion", () => {
    expect(() => validateSuggestion({ rootDir, domainId: "customer", suggestionId: "SUG-999", now })).toThrow();
  });
});

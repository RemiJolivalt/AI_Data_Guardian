import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { listDomains, getDomain } from "@/core/domain-pack/registry";
import { runDomainAssessment } from "@/core/domain-pack/runDomainAssessment";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("Domain registry & generic runner (extensibility)", () => {
  it("lists the registered business objects", () => {
    const ids = listDomains(rootDir).map((d) => d.domain_id).sort();
    expect(ids).toContain("customer");
    expect(ids).toContain("product");
  });

  it("resolves a domain manifest by id", () => {
    const product = getDomain(rootDir, "product");
    expect(product?.manifest.label).toBe("Product");
    expect(product?.manifest.object_type).toBe("MASTER_DATA");
  });

  it("assesses the Product domain deterministically via the same engine", () => {
    const r = runDomainAssessment({ rootDir, domainId: "product", now });
    expect(r.totals.assets).toBe(2);
    expect(r.coverage.overall).toBeGreaterThan(0);
    expect(r.suggestions.length).toBeGreaterThan(0);
    // category has no description in the catalog and a canonical one in the KP.
    expect(
      r.suggestions.some((s) => s.column === "category" && s.type === "DESCRIPTION"),
    ).toBe(true);
  });

  it("throws on an unknown domain", () => {
    expect(() => runDomainAssessment({ rootDir, domainId: "nope", now })).toThrow();
  });
});

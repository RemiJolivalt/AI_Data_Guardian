import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { runDomainAssessment } from "@/core/domain-pack/runDomainAssessment";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("Supervision scope (target tables under AI Data Guardian)", () => {
  const full = runDomainAssessment({ rootDir, domainId: "customer", now });
  const scoped = runDomainAssessment({ rootDir, domainId: "customer", now, assets: ["CUSTOMER"] });

  it("restricts the assessed universe to the selected assets", () => {
    expect(scoped.totals.assets).toBe(1);
    expect(scoped.totals.columns).toBeLessThan(full.totals.columns);
  });

  it("empty scope assesses all assets", () => {
    const all = runDomainAssessment({ rootDir, domainId: "customer", now, assets: [] });
    expect(all.totals.assets).toBe(full.totals.assets);
  });

  it("is deterministic for a given scope", () => {
    const again = runDomainAssessment({ rootDir, domainId: "customer", now, assets: ["CUSTOMER"] });
    expect(again.coverage.overall).toBe(scoped.coverage.overall);
  });
});

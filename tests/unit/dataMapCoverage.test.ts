import { describe, it, expect } from "vitest";
import { loadDataMap } from "@/core/data-map/registry";
import { analyzeObject } from "@/core/data-map/analysis";
import { InMemoryDecisionsStore } from "@/core/data-map/decisions";
import { computeGuardianCoverage } from "@/core/data-map/coverage";
import { summarizeLearning, capitalizedByTarget } from "@/core/data-map/learning";

const rootDir = process.cwd();

describe("Guardian coverage (deterministic)", () => {
  const map = loadDataMap(rootDir);

  it("computes control coverage as in-place / recommended", () => {
    const cov = computeGuardianCoverage(map, {});
    // (6+2+5+4) in-place / (9+6+6+7) recommended = 17/28 = 61%.
    expect(cov.coveragePercent).toBe(61);
    expect(cov.totalObjects).toBe(map.businessObjects.length);
  });

  it("recommends the highest-criticality object with the largest gap", () => {
    const cov = computeGuardianCoverage(map, {});
    expect(cov.recommendedNext?.objectId).toBe("customer_contact");
    expect(cov.recommendedNext?.trustGainPercent).toBeGreaterThan(0);
  });

  it("increases coverage when a target object gains a capitalized control", () => {
    const before = computeGuardianCoverage(map, {});
    const after = computeGuardianCoverage(map, { customer_contact: 1 });
    expect(after.coveragePercent).toBeGreaterThan(before.coveragePercent);
  });
});

describe("Learning summary (deterministic)", () => {
  const map = loadDataMap(rootDir);

  it("counts proposed, validated, reused and enriched from decisions", () => {
    const store = new InMemoryDecisionsStore();
    const analysis = analyzeObject(map, "customer_360", [], []);
    const rec = analysis.recommendations[0];
    if (!rec) throw new Error("expected a recommendation");
    store.record({ recommendation: rec, status: "À valider", decidedAt: "2026-09-16T00:00:00.000Z" });
    store.record({ recommendation: rec, status: "Capitalisé", decidedAt: "2026-09-16T00:00:00.000Z" });

    const stats = summarizeLearning(store.list());
    expect(stats.proposed).toBe(1);
    expect(stats.validated).toBe(1);
    expect(stats.rulesReused).toBe(1); // target (customer_contact) != source (customer_360)
    expect(stats.objectsEnriched).toBe(1);
    expect(capitalizedByTarget(store.list())).toMatchObject({ customer_contact: 1 });
  });
});

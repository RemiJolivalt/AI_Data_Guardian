import { describe, it, expect } from "vitest";
import { loadDataMap, objectsForDomain, tablesForObject, getObject } from "@/core/data-map/registry";
import { analyzeObject } from "@/core/data-map/analysis";
import { InMemoryDecisionsStore } from "@/core/data-map/decisions";

const rootDir = process.cwd();

describe("Enterprise data map (contracts + loader)", () => {
  const map = loadDataMap(rootDir);

  it("validates the synthetic map fixture against the schema", () => {
    expect(map.is_synthetic).toBe(true);
    expect(map.domains.length).toBeGreaterThan(0);
    expect(map.businessObjects.length).toBeGreaterThan(0);
    expect(map.dataTables.length).toBeGreaterThan(0);
  });

  it("resolves objects for a domain and tables for an object", () => {
    const customerObjects = objectsForDomain(map, "customer");
    expect(customerObjects.map((o) => o.id)).toContain("customer_360");
    const tables = tablesForObject(map, "customer_360");
    expect(tables.map((tbl) => tbl.name)).toEqual([
      "customer_master",
      "customer_contact",
      "customer_address",
      "customer_consent",
    ]);
  });
});

describe("Guardian analysis (deterministic)", () => {
  const map = loadDataMap(rootDir);

  it("returns the same recommendations for the same object (reproducible)", () => {
    const a = analyzeObject(map, "customer_360", []);
    const b = analyzeObject(map, "customer_360", []);
    expect(a).toEqual(b);
    expect(a.recommendations.length).toBeGreaterThanOrEqual(2);
    expect(a.recommendations.every((r) => r.status === "À valider")).toBe(true);
  });

  it("explains risk in business language and qualifies exposure without a euro figure", () => {
    const a = analyzeObject(map, "customer_360", []);
    expect(a.riskExplanation).toMatch(/Customer 360/);
    expect(["Faible", "Modérée", "Élevée"]).toContain(a.exposure.level);
    expect(JSON.stringify(a)).not.toMatch(/€|\bEUR\b/);
  });

  it("derives a deterministic fallback for objects without a curated scenario", () => {
    const obj = getObject(map, "product_catalog");
    expect(obj).not.toBeNull();
    const a = analyzeObject(map, "product_catalog", []);
    expect(a.recommendations.length).toBeGreaterThanOrEqual(1);
    expect(a.recommendations.every((r) => r.sourceObjectId === "product_catalog")).toBe(true);
  });
});

describe("Capitalization loop", () => {
  const map = loadDataMap(rootDir);

  it("re-injects a validated decision as reusable expertise and drops it from pending", () => {
    const store = new InMemoryDecisionsStore();
    const before = analyzeObject(map, "customer_360", [], store.decidedFor("customer_360"));
    const target = before.recommendations[0];
    if (!target) throw new Error("expected at least one recommendation");

    store.record({
      recommendation: target,
      status: "Capitalisé",
      decidedAt: "2026-09-16T00:00:00.000Z",
    });
    expect(store.capitalizedCount()).toBe(1);

    const after = analyzeObject(map, "customer_360", [], store.decidedFor("customer_360"));
    expect(after.recommendations.find((r) => r.id === target.id)).toBeUndefined();
    expect(after.reusableExpertise.some((e) => e.type === "expert_decision" && e.label === target.controlLabel)).toBe(
      true,
    );
  });

  it("keeps a rejected decision out of the reusable knowledge", () => {
    const store = new InMemoryDecisionsStore();
    const before = analyzeObject(map, "customer_360", [], store.decidedFor("customer_360"));
    const target = before.recommendations[0];
    if (!target) throw new Error("expected at least one recommendation");
    store.record({ recommendation: target, status: "Rejeté", decidedAt: "2026-09-16T00:00:00.000Z" });
    expect(store.capitalizedCount()).toBe(0);
    const after = analyzeObject(map, "customer_360", [], store.decidedFor("customer_360"));
    expect(after.reusableExpertise.some((e) => e.type === "expert_decision")).toBe(false);
    expect(after.recommendations.find((r) => r.id === target.id)).toBeUndefined();
  });
});

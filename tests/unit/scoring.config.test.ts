import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { loadScoringConfig } from "@/core/scoring/config";
import { ScoreDimension } from "@/core/domain";

const repoPath = (rel: string): string =>
  fileURLToPath(new URL(`../../${rel}`, import.meta.url));

const fixturePath = (name: string): string =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

describe("Scoring configuration (§6, ADR-0005)", () => {
  it("loads the shipped config with all 8 dimensions and a version", () => {
    const cfg = loadScoringConfig(repoPath("config/scoring.yaml"));
    expect(cfg.score_version).toBe("1.0.0");
    for (const dim of ScoreDimension.options) {
      expect(cfg.dimensions[dim]).toBeDefined();
    }
  });

  it("has dimension weights that sum to weights_total", () => {
    const cfg = loadScoringConfig(repoPath("config/scoring.yaml"));
    const sum = Object.values(cfg.dimensions).reduce((acc, d) => acc + d.weight, 0);
    expect(Math.abs(sum - cfg.weights_total)).toBeLessThan(1e-6);
  });

  it("is deterministic: loading twice yields identical config", () => {
    const a = loadScoringConfig(repoPath("config/scoring.yaml"));
    const b = loadScoringConfig(repoPath("config/scoring.yaml"));
    expect(a).toEqual(b);
  });

  it("fails on a missing dimension (no silent default)", () => {
    expect(() => loadScoringConfig(fixturePath("scoring.invalid-missing-dimension.yaml"))).toThrow();
  });

  it("fails when weights do not sum to weights_total", () => {
    expect(() => loadScoringConfig(fixturePath("scoring.invalid-bad-weights.yaml"))).toThrow();
  });
});

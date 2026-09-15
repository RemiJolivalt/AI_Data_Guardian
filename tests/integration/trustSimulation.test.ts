import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { runAssessment } from "@/core/assessment/runAssessment";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("Trust Improvement Simulator (US-061)", () => {
  const { trust_simulation: sim } = runAssessment({ rootDir, now, assessmentId: "ASM-SIM" });

  it("computes a baseline below the recommended projected trust", () => {
    expect(sim.projected_overall).toBeGreaterThan(sim.baseline_overall);
  });

  it("gives a positive trust gain and an effort for each action", () => {
    expect(sim.actions.length).toBe(4);
    for (const a of sim.actions) {
      expect(a.effort_days).toBeGreaterThan(0);
      expect(a.trust_gain).toBeGreaterThanOrEqual(0);
    }
  });

  it("recommends a plan reaching at least the target trust", () => {
    expect(sim.recommended_action_ids.length).toBeGreaterThan(0);
    expect(sim.projected_overall).toBeGreaterThanOrEqual(sim.target);
    expect(sim.total_effort_days).toBeGreaterThan(0);
  });

  it("is deterministic", () => {
    const again = runAssessment({ rootDir, now, assessmentId: "ASM-SIM" }).trust_simulation;
    expect(again).toEqual(sim);
  });
});

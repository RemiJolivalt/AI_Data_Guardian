import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { runAssessment } from "@/core/assessment/runAssessment";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("runAssessment — Revenue Forecasting demo (integration)", () => {
  const result = runAssessment({ rootDir, now, assessmentId: "ASM-DEMO" });

  it("produces the four expected findings against the golden scenario", () => {
    const titles = result.findings.map((f) => f.title).sort();
    expect(result.findings).toHaveLength(4);
    expect(titles).toContain("Duplicate customer identifiers");
    expect(titles).toContain("Stale transactions feed");
    expect(titles).toContain("Business-critical dataset has no owner");
    expect(titles).toContain("KPI definition not governed");
  });

  it("every finding cites at least one evidence record", () => {
    for (const f of result.findings) {
      expect(f.evidence_ids.length).toBeGreaterThan(0);
      for (const id of f.evidence_ids) {
        expect(result.evidence.some((e) => e.evidence_id === id)).toBe(true);
      }
    }
  });

  it("scores NOT_TRUSTED and NOT_READY", () => {
    expect(result.score.status).toBe("NOT_TRUSTED");
    expect(result.ai_readiness.status).toBe("NOT_READY");
  });

  it("quantifies a SIMULATED exposure and a prioritized remediation plan", () => {
    expect(result.impact.map((s) => s.label)).toEqual(["LOW", "CENTRAL", "HIGH"]);
    expect(result.impact.every((s) => s.simulated)).toBe(true);
    expect(result.remediation).toHaveLength(4);
    for (let i = 1; i < result.remediation.length; i++) {
      expect(result.remediation[i - 1]!.priority).toBeGreaterThanOrEqual(result.remediation[i]!.priority);
    }
  });

  it("simulates a SIMULATED TRUSTED score after full remediation", () => {
    expect(result.simulated_score.simulated).toBe(true);
    expect(result.simulated_score.status).toBe("TRUSTED");
    expect(result.simulated_score.overall).not.toBeNull();
    expect(result.simulated_score.overall! > (result.score.overall ?? 0)).toBe(true);
  });

  it("is fully deterministic for the same inputs", () => {
    const again = runAssessment({ rootDir, now, assessmentId: "ASM-DEMO" });
    expect(again).toEqual(result);
  });
});

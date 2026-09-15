import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { runAssessment } from "@/core/assessment/runAssessment";
import { certifyDecision } from "@/core/certification/certify";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));
const now = new Date("2026-09-15T00:00:00Z");

describe("Decision certification (Act 4 — prove trust)", () => {
  const { score, simulated_score } = runAssessment({ rootDir, now, assessmentId: "ASM-CERT" });

  it("does NOT certify an untrusted decision", () => {
    const cert = certifyDecision(score);
    expect(cert.certified).toBe(false);
    expect(cert.decision_ready).toBe(false);
    expect(cert.ai_ready).toBe(false);
    expect(cert.compliance_risk).toBe("HIGH");
    expect(cert.missing.length).toBeGreaterThan(0);
  });

  it("certifies after full remediation (SIMULATED trusted)", () => {
    const cert = certifyDecision(simulated_score);
    expect(cert.certified).toBe(true);
    expect(cert.ai_ready).toBe(true);
    expect(cert.uses.every((u) => u.certified)).toBe(true);
  });
});

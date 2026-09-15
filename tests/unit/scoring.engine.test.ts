import { describe, it, expect } from "vitest";
import { computeTrustScore } from "@/core/scoring/engine";
import { parseScoringConfig } from "@/core/scoring/config";
import { Finding, type Finding as FindingT } from "@/core/domain";

const config = parseScoringConfig(`
score_version: "1.0.0"
weights_total: 1.0
dimensions:
  DATA_QUALITY: { weight: 0.20, min_evidence: 1 }
  GOVERNANCE: { weight: 0.15, min_evidence: 1 }
  METADATA: { weight: 0.10, min_evidence: 1 }
  LINEAGE: { weight: 0.10, min_evidence: 1 }
  COMPLIANCE: { weight: 0.15, min_evidence: 1 }
  BUSINESS_FITNESS: { weight: 0.10, min_evidence: 1 }
  AI_READINESS: { weight: 0.10, min_evidence: 1 }
  EVIDENCE_STRENGTH: { weight: 0.10, min_evidence: 1 }
status_thresholds: { TRUSTED: 0.85, CONDITIONALLY_TRUSTED: 0.70, AT_RISK: 0.50 }
`);

const now = new Date("2026-09-15T00:00:00Z");

const finding = (category: FindingT["category"], severity: FindingT["severity"]): FindingT =>
  Finding.parse({
    finding_id: `FND-${category}-${severity}`,
    assessment_id: "ASM-1",
    category,
    severity,
    title: "t",
    evidence_ids: ["EVD-1"],
    confidence: 0.9,
    created_by: "agent:test",
  });

describe("Trust Score engine (§6)", () => {
  it("marks unevaluated dimensions as INSUFFICIENT_EVIDENCE, never guessed", () => {
    const score = computeTrustScore({
      assessmentId: "ASM-1",
      findings: [finding("DATA_QUALITY", "HIGH")],
      evaluatedDimensions: ["DATA_QUALITY"],
      config,
      now,
    });
    const metadata = score.dimensions.find((d) => d.dimension === "METADATA");
    expect(metadata?.value).toBeNull();
    expect(metadata?.status).toBe("INSUFFICIENT_EVIDENCE");
  });

  it("scores the demo scenario NOT_TRUSTED", () => {
    const score = computeTrustScore({
      assessmentId: "ASM-1",
      findings: [
        finding("DATA_QUALITY", "HIGH"),
        finding("DATA_QUALITY", "HIGH"),
        finding("GOVERNANCE", "HIGH"),
        finding("GOVERNANCE", "MEDIUM"),
      ],
      evaluatedDimensions: ["DATA_QUALITY", "GOVERNANCE"],
      config,
      now,
    });
    expect(score.status).toBe("NOT_TRUSTED");
    expect(score.overall).not.toBeNull();
  });

  it("is reproducible for identical inputs", () => {
    const args = {
      assessmentId: "ASM-1",
      findings: [finding("DATA_QUALITY", "LOW")],
      evaluatedDimensions: ["DATA_QUALITY"] as const,
      config,
      now,
    };
    expect(computeTrustScore({ ...args, evaluatedDimensions: ["DATA_QUALITY"] })).toEqual(
      computeTrustScore({ ...args, evaluatedDimensions: ["DATA_QUALITY"] }),
    );
  });
});

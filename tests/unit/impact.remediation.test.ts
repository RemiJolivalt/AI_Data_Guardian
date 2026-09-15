import { describe, it, expect } from "vitest";
import { parseCsv } from "@/core/ingestion/csv";
import { duplicateBookingEur, computeImpactScenarios } from "@/core/impact/impact";
import { buildRemediationPlan, priorityOf } from "@/core/remediation/plan";
import { simulateAfterRemediation } from "@/core/remediation/simulate";
import { parseScoringConfig } from "@/core/scoring/config";
import { Finding, type Finding as FindingT } from "@/core/domain";

const txns = parseCsv(
  [
    "transaction_id,customer_id,amount_eur,booked_at,source_system,last_refreshed_at",
    "T-1,C-1,12500.00,2026-06-01,ERP_A,2026-06-02",
    "T-2,C-1,12500.00,2026-06-01,ERP_B,2026-06-05",
    "T-3,C-2,4300.00,2026-06-10,ERP_A,2026-06-11",
    "",
  ].join("\n"),
);

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

const finding = (title: string, category: FindingT["category"], severity: FindingT["severity"]): FindingT =>
  Finding.parse({
    finding_id: `FND-${title}`,
    assessment_id: "ASM-1",
    category,
    severity,
    title,
    evidence_ids: ["EVD-1"],
    confidence: 0.9,
    created_by: "agent:test",
  });

describe("Business impact (§6, US-051)", () => {
  it("computes double-counted euros deterministically", () => {
    expect(duplicateBookingEur(txns)).toBe(12500);
  });

  it("produces LOW/CENTRAL/HIGH scenarios, all SIMULATED with assumptions", () => {
    const scenarios = computeImpactScenarios("ASM-1", txns);
    expect(scenarios.map((s) => s.label)).toEqual(["LOW", "CENTRAL", "HIGH"]);
    expect(scenarios.every((s) => s.simulated)).toBe(true);
    expect(scenarios.every((s) => s.assumptions.length > 0)).toBe(true);
    const central = scenarios.find((s) => s.label === "CENTRAL");
    expect(central?.estimated_value).toBe(12500);
  });
});

describe("Remediation plan (US-060)", () => {
  const findings = [
    finding("Duplicate customer identifiers", "DATA_QUALITY", "HIGH"),
    finding("Business-critical dataset has no owner", "GOVERNANCE", "HIGH"),
  ];

  it("uses a versioned impact/effort priority formula", () => {
    expect(priorityOf("HIGH", "LOW")).toBe(3);
    expect(priorityOf("HIGH", "MEDIUM")).toBe(1.5);
  });

  it("builds one action per finding, sorted by descending priority", () => {
    const plan = buildRemediationPlan("ASM-1", findings);
    expect(plan.actions).toHaveLength(2);
    expect(plan.actions[0]!.priority).toBeGreaterThanOrEqual(plan.actions[1]!.priority);
    expect(plan.actions[0]!.target_problem).toBe("Business-critical dataset has no owner");
  });
});

describe("Before/after simulation (US-061)", () => {
  it("resolving all findings yields a SIMULATED TRUSTED score", () => {
    const findings = [
      finding("Duplicate customer identifiers", "DATA_QUALITY", "HIGH"),
      finding("KPI definition not governed", "GOVERNANCE", "MEDIUM"),
    ];
    const sim = simulateAfterRemediation({
      assessmentId: "ASM-1",
      findings,
      resolvedFindingIds: findings.map((f) => f.finding_id),
      evaluatedDimensions: ["DATA_QUALITY", "GOVERNANCE"],
      config,
      now,
    });
    expect(sim.simulated).toBe(true);
    expect(sim.status).toBe("TRUSTED");
  });
});

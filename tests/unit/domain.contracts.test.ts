import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import { Finding, Evidence, Score, TrustStatus } from "@/core/domain";

const fixture = (name: string): unknown =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url)), "utf8"));

describe("Evidence contract (§7.3)", () => {
  it("accepts a valid evidence record", () => {
    const parsed = Evidence.parse(fixture("evidence.valid.json"));
    expect(parsed.evidence_id).toBe("EVD-001");
    expect(parsed.is_synthetic).toBe(true);
  });

  it("rejects evidence missing the synthetic flag", () => {
    const bad = { ...(fixture("evidence.valid.json") as Record<string, unknown>) };
    delete bad.is_synthetic;
    expect(() => Evidence.parse(bad)).toThrow();
  });
});

describe("Finding contract (§7.2)", () => {
  it("accepts a valid finding", () => {
    const parsed = Finding.parse(fixture("finding.valid.json"));
    expect(parsed.finding_id).toBe("FND-001");
    expect(parsed.evidence_ids.length).toBeGreaterThan(0);
  });

  it("rejects a finding with no evidence", () => {
    expect(() => Finding.parse(fixture("finding.invalid.json"))).toThrow();
  });

  it("rejects an invalid category enum", () => {
    const bad = { ...(fixture("finding.valid.json") as Record<string, unknown>), category: "NOPE" };
    expect(() => Finding.parse(bad)).toThrow();
  });

  it("round-trips through JSON unchanged", () => {
    const parsed = Finding.parse(fixture("finding.valid.json"));
    const roundTripped = Finding.parse(JSON.parse(JSON.stringify(parsed)));
    expect(roundTripped).toEqual(parsed);
  });
});

describe("Score contract (§6.2)", () => {
  it("carries version, timestamp, and allows a null overall (INSUFFICIENT_EVIDENCE)", () => {
    const score = Score.parse({
      score_id: "SCR-001",
      assessment_id: "ASM-001",
      score_version: "1.0.0",
      calculation_timestamp: "2026-09-15T08:00:00Z",
      overall: null,
      status: TrustStatus.enum.INSUFFICIENT_EVIDENCE,
      dimensions: [],
    });
    expect(score.overall).toBeNull();
    expect(score.simulated).toBe(false);
  });

  it("rejects an out-of-range confidence", () => {
    expect(() =>
      Score.parse({
        score_id: "SCR-002",
        assessment_id: "ASM-001",
        score_version: "1.0.0",
        calculation_timestamp: "2026-09-15T08:00:00Z",
        overall: 0.5,
        status: "AT_RISK",
        dimensions: [],
        confidence: 1.5,
      }),
    ).toThrow();
  });
});

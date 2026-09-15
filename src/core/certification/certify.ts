import type { Score } from "@/core/domain";

/**
 * Deterministic decision/AI certification (cahier §6, §8 "prove trust"). A use is certified only
 * when the Trust Score clears its threshold — the platform never certifies untrusted data.
 */

export interface CertifiedUse {
  key: string;
  label: string;
  threshold: number;
  certified: boolean;
}

export interface Certification {
  overall: number | null;
  status: string;
  certified: boolean;
  decision_ready: boolean;
  ai_ready: boolean;
  compliance_risk: "LOW" | "MEDIUM" | "HIGH";
  uses: CertifiedUse[];
  missing: string[];
}

const USES: { key: string; label: string; threshold: number }[] = [
  { key: "executive_reporting", label: "Executive Reporting", threshold: 0.7 },
  { key: "business_analytics", label: "Business Analytics", threshold: 0.7 },
  { key: "ai_agent", label: "AI Agent Consumption", threshold: 0.85 },
  { key: "regulatory", label: "Regulatory Reporting", threshold: 0.85 },
];

export function certifyDecision(score: Score): Certification {
  const overall = score.overall;
  const uses: CertifiedUse[] = USES.map((u) => ({
    ...u,
    certified: overall !== null && overall >= u.threshold,
  }));
  const certified = uses.every((u) => u.certified);
  const decision_ready = overall !== null && overall >= 0.7;
  const ai_ready = overall !== null && overall >= 0.85;
  const compliance_risk: Certification["compliance_risk"] =
    score.status === "NOT_TRUSTED" ? "HIGH" : score.status === "AT_RISK" ? "MEDIUM" : "LOW";

  return {
    overall,
    status: score.status,
    certified,
    decision_ready,
    ai_ready,
    compliance_risk,
    uses,
    missing: uses.filter((u) => !u.certified).map((u) => u.label),
  };
}

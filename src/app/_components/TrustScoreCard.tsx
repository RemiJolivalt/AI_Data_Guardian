import { t } from "@/app/_components/theme";

const pct = (v: number | null): string => (v === null ? "—" : `${Math.round(v * 100)}%`);

function YesNo({ ok }: { ok: boolean }) {
  return (
    <span style={{ color: ok ? t.ok : t.danger, fontWeight: 800 }}>{ok ? "YES" : "NO"}</span>
  );
}

/** AI Trust Score™ card — a credit-score-style summary an executive reads in 10 seconds. */
export function TrustScoreCard({
  label,
  trust,
  decisionReady,
  aiReady,
  complianceRisk,
  exposure,
  simulated = false,
}: {
  label: string;
  trust: number | null;
  decisionReady: boolean;
  aiReady: boolean;
  complianceRisk: "LOW" | "MEDIUM" | "HIGH";
  exposure: number | null;
  simulated?: boolean;
}) {
  const trustColor = trust === null ? t.muted : trust >= 0.85 ? t.ok : trust >= 0.7 ? t.warn : t.danger;
  const riskColor = complianceRisk === "LOW" ? t.ok : complianceRisk === "MEDIUM" ? t.warn : t.danger;

  return (
    <div style={{ background: "#0b1e42", color: "#eaf0fb", borderRadius: 14, padding: "1.25rem 1.5rem", minWidth: 300 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: t.accent, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>AI TRUST SCORE™</span>
        {simulated ? (
          <span style={{ background: t.proposed, color: "#fff", fontSize: 11, padding: "1px 7px", borderRadius: 4 }}>SIMULÉ</span>
        ) : null}
      </div>
      <div style={{ fontSize: 13, color: "#aebfe0", marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 46, fontWeight: 900, color: trustColor, lineHeight: 1.1 }}>
        {trust === null ? "—" : Math.round(trust * 100)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 8, fontSize: 14 }}>
        <div>Decision Ready&nbsp; <YesNo ok={decisionReady} /></div>
        <div>AI Ready&nbsp; <YesNo ok={aiReady} /></div>
        <div>Compliance Risk&nbsp; <span style={{ color: riskColor, fontWeight: 800 }}>{complianceRisk}</span></div>
        <div>Financial Exposure&nbsp; <strong>{exposure ? `€${exposure.toLocaleString()}` : "€0"}</strong></div>
      </div>
    </div>
  );
}

export const trustPct = pct;

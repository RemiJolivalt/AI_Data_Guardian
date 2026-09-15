import { runAssessment } from "@/core/assessment/runAssessment";
import { certifyDecision, type Certification } from "@/core/certification/certify";
import { Shell, Card, Tag } from "@/app/_components/Shell";
import { t } from "@/app/_components/theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE = "15 Sept 2026";

function Passport({ title, cert, simulated }: { title: string; cert: Certification; simulated?: boolean }) {
  const ok = cert.certified;
  const trust = cert.overall === null ? "—" : Math.round(cert.overall * 100);
  const trustColor = ok ? t.ok : cert.overall !== null && cert.overall >= 0.7 ? t.warn : t.danger;

  return (
    <div style={{ border: `2px solid ${ok ? t.ok : t.border}`, borderRadius: 14, padding: "1.25rem 1.5rem", background: "#fff", minWidth: 320, flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: t.accent, fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>AI READINESS PASSPORT</span>
        {simulated ? <Tag label="SIMULÉ" color={t.proposed} /> : null}
      </div>
      <h3 style={{ margin: "6px 0 2px", color: t.title }}>{title}</h3>
      <p style={{ margin: 0, color: t.muted, fontSize: 13 }}>Sujet : Net Revenue (Revenue Forecasting)</p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "10px 0" }}>
        <span style={{ fontSize: 44, fontWeight: 900, color: trustColor }}>{trust}</span>
        <span style={{ fontWeight: 800, color: ok ? t.ok : t.danger }}>{ok ? "CERTIFIED" : "NOT CERTIFIED"}</span>
      </div>

      <p style={{ margin: "0 0 4px", fontWeight: 700, color: t.title }}>Certified for</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {cert.uses.map((u) => (
          <li key={u.key} style={{ padding: "3px 0", color: t.text }}>
            <span style={{ color: u.certified ? t.ok : t.danger, fontWeight: 800 }}>{u.certified ? "✓" : "✗"}</span>{" "}
            {u.label} <span style={{ color: t.muted, fontSize: 12 }}>(≥ {Math.round(u.threshold * 100)}%)</span>
          </li>
        ))}
      </ul>

      <p style={{ margin: "10px 0 0", color: t.muted, fontSize: 12 }}>
        {DATE} · Certified by AI Data Guardian · Compliance risk {cert.compliance_risk}
      </p>
    </div>
  );
}

export default function CertificatePage() {
  const r = runAssessment({ rootDir: process.cwd() });
  const current = certifyDecision(r.score);
  const future = certifyDecision(r.simulated_score);

  return (
    <Shell active="certificate" title="AI Trust Certificate" subtitle="Prouver la confiance pour la décision et l’IA" scope="Revenue Forecasting">
      <Card style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, color: t.text }}>
          AI Data Guardian ne certifie que ce qui est fiable. Aujourd’hui la décision{" "}
          <strong style={{ color: t.danger }}>n’est pas certifiée</strong> ; après remédiation, le
          passeport projeté (SIMULÉ) débloque les usages exécutifs, analytics, IA et réglementaires.
        </p>
      </Card>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Passport title="Aujourd’hui" cert={current} />
        <Passport title="Après remédiation" cert={future} simulated />
      </div>
    </Shell>
  );
}

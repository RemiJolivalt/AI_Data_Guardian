import type { Route } from "next";
import Link from "next/link";
import { runAssessment } from "@/core/assessment/runAssessment";
import { certifyDecision } from "@/core/certification/certify";
import { Shell, Card, Chip, Tag } from "@/app/_components/Shell";
import { TrustScoreCard } from "@/app/_components/TrustScoreCard";
import { t, severityColor } from "@/app/_components/theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pct = (v: number | null): string => (v === null ? "—" : `${Math.round(v * 100)}%`);

export default function DecisionPage() {
  const r = runAssessment({ rootDir: process.cwd() });
  const cert = certifyDecision(r.score);
  const central = r.impact.find((s) => s.label === "CENTRAL");
  const sim = r.trust_simulation;
  const recommended = sim.actions.filter((a) => sim.recommended_action_ids.includes(a.action_id));

  const verdict =
    r.score.status === "TRUSTED" ? { label: "OUI", color: t.ok } :
    r.score.status === "CONDITIONALLY_TRUSTED" ? { label: "SOUS CONDITIONS", color: t.warn } :
    { label: "NON", color: t.danger };

  return (
    <Shell active="decision" title="Trust Copilot" subtitle="Can I trust this decision?" scope="Revenue Forecasting">
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ margin: 0, color: t.muted, fontSize: 13 }}>Question du décideur</p>
            <h2 style={{ margin: "4px 0", color: t.title, fontSize: 22 }}>
              « Peut-on utiliser le KPI Net Revenue dans le comité demain ? »
            </h2>
            <p style={{ margin: 0, color: t.text }}>
              Réponse d’AI Data Guardian :{" "}
              <span style={{ color: verdict.color, fontWeight: 900, fontSize: 20 }}>{verdict.label}</span>
              {" · "}Trust {pct(r.score.overall)} · Exposition {central?.estimated_value ? `€${central.estimated_value.toLocaleString()}` : "—"}
            </p>
          </div>
          <TrustScoreCard
            label="Net Revenue — Executive Reporting"
            trust={r.score.overall}
            decisionReady={cert.decision_ready}
            aiReady={cert.ai_ready}
            complianceRisk={cert.compliance_risk}
            exposure={central?.estimated_value ?? null}
          />
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ margin: "0 0 8px", color: t.title }}>Feux rouges</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {r.findings.map((f) => (
              <li key={f.finding_id} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${t.border}` }}>
                <Chip label={f.severity} color={severityColor(f.severity)} />
                <span>{f.title}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 style={{ margin: "0 0 8px", color: t.title }}>
            Que corriger pour redevenir fiable <Tag label="SIMULÉ" color={t.proposed} />
          </h3>
          <ol style={{ margin: "0 0 10px", paddingLeft: 18, color: t.text }}>
            {recommended.map((a) => (
              <li key={a.action_id} style={{ padding: "2px 0" }}>
                {a.target_problem} <span style={{ color: t.ok, fontWeight: 700 }}>+{Math.round(a.trust_gain * 100)}%</span>{" "}
                <span style={{ color: t.muted }}>({a.effort_days} j)</span>
              </li>
            ))}
          </ol>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div><span style={{ color: t.muted, fontSize: 12 }}>Effort</span><div style={{ fontWeight: 800, color: t.title }}>{sim.total_effort_days} jours</div></div>
            <div><span style={{ color: t.muted, fontSize: 12 }}>Trust projeté</span><div style={{ fontWeight: 800, color: t.ok }}>{pct(sim.projected_overall)}</div></div>
            <Link href={"/certificate" as Route} style={{ marginLeft: "auto", background: t.cta, color: "#fff", padding: "8px 16px", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
              Voir le certificat →
            </Link>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

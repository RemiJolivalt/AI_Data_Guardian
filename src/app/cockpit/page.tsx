import { runAssessment } from "@/core/assessment/runAssessment";
import { Shell, Card, Stat, Chip, Legend, Tag } from "@/app/_components/Shell";
import { t, severityColor } from "@/app/_components/theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  TRUSTED: "Trusted",
  CONDITIONALLY_TRUSTED: "Conditionally trusted",
  AT_RISK: "At risk",
  NOT_TRUSTED: "Not trusted",
  INSUFFICIENT_EVIDENCE: "Insufficient evidence",
  REVIEW_REQUIRED: "Review required",
};

const pct = (value: number | null): string => (value === null ? "—" : `${Math.round(value * 100)}%`);

export default function CockpitPage() {
  const result = runAssessment({ rootDir: process.cwd() });
  const { score, simulated_score, ai_readiness, findings, evidence, impact, remediation, trust_simulation } = result;
  const central = impact.find((s) => s.label === "CENTRAL");
  const sim = trust_simulation;
  const recommended = sim.actions.filter((a) => sim.recommended_action_ids.includes(a.action_id));
  const statusColor =
    score.status === "NOT_TRUSTED" ? t.danger : score.status === "AT_RISK" ? t.warn : t.ok;

  return (
    <Shell
      active="exec"
      title="Cockpit de confiance"
      subtitle="Ce qui menace les décisions et l’usage de l’IA aujourd’hui"
      scope="Revenue Forecasting"
    >
      <Legend />
      <p style={{ margin: "0 0 14px", color: t.muted, fontStyle: "italic" }}>
        We don’t assess data quality. We quantify trust for decisions, analytics and AI.
      </p>
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}
      >
        <Stat
          label="Trust Score"
          value={pct(score.overall)}
          sub={STATUS_LABEL[score.status]}
          subColor={statusColor}
        />
        <Stat
          label="AI Readiness"
          value={ai_readiness.status.replace(/_/g, " ")}
          sub={`${ai_readiness.blockers.length} blockers`}
          subColor={t.danger}
        />
        <Stat
          label="Exposition (simulée)"
          value={central?.estimated_value ? `€${central.estimated_value.toLocaleString()}` : "—"}
          sub="double-comptage"
          subColor={t.proposed}
        />
        <Stat label="Findings" value={String(findings.length)} sub={`score ${score.score_version}`} />
      </section>

      <Card style={{ marginBottom: 16, borderLeft: `4px solid ${t.proposed}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18, color: t.title }}>
            Trust Improvement Simulator <Tag label="SIMULÉ" color={t.proposed} />
          </h2>
          <span style={{ fontSize: 13, color: t.muted }}>
            Plan recommandé par l’IA · cible {Math.round(sim.target * 100)}%
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, margin: "12px 0" }}>
          <Big label="Trust" value={`${Math.round(sim.baseline_overall * 100)}% → ${Math.round(sim.projected_overall * 100)}%`} color={t.ok} />
          <Big label="Effort" value={`${sim.total_effort_days} j`} color={t.title} />
          <Big label="Exposition" value={`€${central?.estimated_value?.toLocaleString() ?? "—"} → €0`} color={t.ok} />
          <Big label="AI Readiness" value={`${ai_readiness.status.replace(/_/g, " ")} → READY`} color={t.ok} />
        </div>
        <p style={{ margin: "0 0 6px", fontWeight: 700, color: t.title }}>Recommandé par l’IA</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {recommended.map((a) => (
            <li key={a.action_id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ color: t.ok }}>✔</span>
              <span style={{ flex: 1 }}>{a.target_problem}</span>
              <Chip label={`+${Math.round(a.trust_gain * 100)}% trust`} color={t.ok} />
              <Chip label={`${a.effort_days} j`} color={t.muted} />
            </li>
          ))}
        </ul>
        <p style={{ color: t.muted, fontSize: 12, marginTop: 10 }}>
          Gains et efforts calculés (marginaux) ; l’exposition €0 et READY sont des projections après
          exécution du plan. Aucune valeur comptable certifiée.
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card>
          <h2 style={{ margin: "0 0 10px", fontSize: 18, color: t.title }}>Why not trusted?</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {findings.map((f) => {
              const ev = evidence.find((e) => e.evidence_id === f.evidence_ids[0]);
              return (
                <li
                  key={f.finding_id}
                  style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.7rem 0.9rem", marginBottom: 10 }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Chip label={f.severity} color={severityColor(f.severity)} />
                    <strong style={{ color: t.title }}>{f.title}</strong>
                  </div>
                  <p style={{ margin: "6px 0", color: t.text }}>{f.business_consequence}</p>
                  <div style={{ color: t.ok, fontSize: 12 }}>
                    ● Fait · evidence {f.evidence_ids.join(", ")}
                    {ev
                      ? ` · ${ev.method} = ${String(ev.observed_value)}${ev.unit ? ` ${ev.unit}` : ""}`
                      : ""}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, color: t.title }}>
            Exposition business <Tag label="SIMULÉ" color={t.proposed} />
          </h2>
          <p style={{ margin: "0 0 8px", color: t.text }}>
            Central:{" "}
            <strong>
              {central?.estimated_value ? `€${central.estimated_value.toLocaleString()}` : "—"}
            </strong>
          </p>
          {impact.map((s) => (
            <div
              key={s.scenario_id}
              style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0", borderBottom: `1px solid ${t.border}` }}
            >
              <span>◆ {s.label}</span>
              <span style={{ fontWeight: 700 }}>€{s.estimated_value?.toLocaleString()}</span>
            </div>
          ))}
          <p style={{ color: t.muted, fontSize: 12, marginTop: 8 }}>{central?.assumptions.join(" ")}</p>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: t.title }}>Plan de remédiation</h2>
          <span style={{ fontSize: 14 }}>
            Trust <strong>{pct(score.overall)}</strong> →{" "}
            <strong style={{ color: t.ok }}>{pct(simulated_score.overall)}</strong>
            <Tag label="SIMULÉ" color={t.proposed} />
          </span>
        </div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <Th>Priorité</Th>
              <Th>Action</Th>
              <Th>Owner</Th>
              <Th>Effort</Th>
              <Th>Impact</Th>
            </tr>
          </thead>
          <tbody>
            {remediation.map((a) => (
              <tr key={a.action_id}>
                <Td>{a.priority}</Td>
                <Td>{a.target_problem}</Td>
                <Td>{a.owner_type}</Td>
                <Td>{a.effort}</Td>
                <Td>{a.impact}</Td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ color: t.muted, fontSize: 12, marginTop: 12 }}>
          Résultat déterministe · données synthétiques. Les faits sont adossés à une evidence ; les
          dimensions non évaluées restent Insufficient evidence, jamais devinées.
        </p>
      </Card>
    </Shell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", borderBottom: `2px solid ${t.border}`, padding: "6px 8px", fontSize: 13, color: t.muted }}>
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ borderBottom: `1px solid ${t.border}`, padding: "6px 8px", fontSize: 14 }}>{children}</td>;
}

function Big({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ background: "#f7f9fc", border: `1px solid ${t.border}`, borderRadius: 8, padding: "0.6rem 0.8rem" }}>
      <div style={{ color: t.muted, fontSize: 12 }}>{label}</div>
      <div style={{ color, fontSize: 18, fontWeight: 800, marginTop: 2 }}>{value}</div>
    </div>
  );
}
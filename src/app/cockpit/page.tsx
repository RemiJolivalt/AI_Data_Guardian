import { runAssessment } from "@/core/assessment/runAssessment";

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

function pct(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)}%`;
}

export default function CockpitPage() {
  const result = runAssessment({ rootDir: process.cwd() });
  const { score, ai_readiness, findings, evidence } = result;

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 900 }}>
      <p style={{ color: "#666", margin: 0 }}>Scenario: Revenue Forecasting Agent · SYNTHETIC</p>
      <h1 style={{ marginTop: 4 }}>Executive Cockpit</h1>

      <section style={{ display: "flex", gap: "2rem", margin: "1rem 0 2rem" }}>
        <Metric label="Trust Score" value={pct(score.overall)} sub={`[${STATUS_LABEL[score.status]}]`} />
        <Metric label="AI Readiness" value="" sub={`[${ai_readiness.status}]`} />
        <Metric label="Score version" value={score.score_version} sub={`${findings.length} findings`} />
      </section>

      <h2>Why not trusted?</h2>
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {findings.map((f) => {
          const ev = evidence.find((e) => e.evidence_id === f.evidence_ids[0]);
          return (
            <li
              key={f.finding_id}
              style={{ border: "1px solid #ddd", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: 12 }}
            >
              <strong>
                [{f.severity}] {f.title}
              </strong>
              <p style={{ margin: "0.4rem 0" }}>{f.business_consequence}</p>
              <p style={{ margin: 0, color: "#555", fontSize: 13 }}>
                FACT · evidence {f.evidence_ids.join(", ")}
                {ev ? ` · ${ev.method} = ${String(ev.observed_value)}${ev.unit ? ` ${ev.unit}` : ""}` : ""}
                {" · "}assets: {f.affected_assets.join(", ")}
              </p>
            </li>
          );
        })}
      </ul>

      <h2>Dimensions</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <Th>Dimension</Th>
            <Th>Weight</Th>
            <Th>Score</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {score.dimensions.map((d) => (
            <tr key={d.dimension}>
              <Td>{d.dimension}</Td>
              <Td>{Math.round(d.weight * 100)}%</Td>
              <Td>{pct(d.value)}</Td>
              <Td>{STATUS_LABEL[d.status] ?? d.status}</Td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ color: "#888", fontSize: 12, marginTop: 16 }}>
        Deterministic result. Facts are evidence-backed; unassessed dimensions are shown as
        Insufficient evidence, never guessed.
      </p>
    </main>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div style={{ color: "#666", fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value || sub}</div>
      {value ? <div style={{ color: "#555", fontSize: 13 }}>{sub}</div> : null}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", borderBottom: "2px solid #ccc", padding: "6px 8px", fontSize: 13 }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ borderBottom: "1px solid #eee", padding: "6px 8px", fontSize: 14 }}>{children}</td>;
}

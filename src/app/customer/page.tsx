import { runCustomerAssessment } from "@/core/customer/runCustomerAssessment";
import { Shell, Card, Stat, Chip } from "@/app/_components/Shell";
import { t } from "@/app/_components/theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const pct = (ratio: number): string => `${Math.round(ratio * 100)}%`;

const TYPE_COLOR: Record<string, string> = {
  DESCRIPTION: t.cta,
  PII_CLASSIFICATION: t.danger,
  DQ_RULE: t.warn,
  LINEAGE: t.proposed,
};

const STORY_LABEL: Record<string, string> = {
  identity: "Identity",
  consent: "Consent",
  order_integrity: "Order integrity",
  general: "General",
};

export default function CustomerPage() {
  const r = runCustomerAssessment({ rootDir: process.cwd() });
  const overall = r.coverage.overall;

  return (
    <Shell
      active="customer"
      title="Customer Trust Assessment"
      subtitle="Sait-on suffisamment décrire, gouverner et contrôler la donnée client ?"
      scope="Customer Domain"
    >
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 16 }}
      >
        <Stat
          label="Knowledge coverage"
          value={pct(overall)}
          sub={`${r.totals.columns} colonnes · ${r.totals.assets} actifs`}
          subColor={overall < 0.5 ? t.danger : t.ok}
        />
        <Stat label="Metadata" value={pct(r.coverage.metadata.ratio)} />
        <Stat label="Governance" value={pct(r.coverage.governance.ratio)} />
        <Stat label="Quality" value={pct(r.coverage.quality.ratio)} />
        <Stat label="Lineage" value={pct(r.coverage.lineage.ratio)} />
        <Stat label="Suggestions IA" value={String(r.suggestions.length)} sub="à valider" subColor={t.proposed} />
      </section>

      <Card style={{ marginBottom: 16, borderLeft: `4px solid ${t.danger}` }}>
        <strong style={{ color: t.title }}>Customer data is not ready for autonomous use.</strong>
        <p style={{ margin: "6px 0 0", color: t.text }}>
          Seulement <strong>{pct(overall)}</strong> de la donnée client nécessaire à une vue fiable
          est décrite, gouvernée et contrôlée. {r.gap_counts.pii} attribut(s) personnel(s) non
          classé(s), {r.gap_counts.description} description(s) et {r.gap_counts.rule} règle(s)
          attendue(s) manquantes.
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: 18, color: t.title }}>Suggestions de l’IA</h2>
            <Chip label={`${r.suggestions.length} PROPOSED`} color={t.proposed} />
          </div>
          <p style={{ color: t.muted, fontSize: 13, margin: "4px 0 12px" }}>
            Propositions groundées (jamais appliquées sans validation humaine). Chaque proposition
            cite sa base et sa confiance.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {r.suggestions.slice(0, 8).map((s) => (
              <li
                key={s.suggestion_id}
                style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.7rem 0.9rem", marginBottom: 10 }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <Chip label={s.type.replace("_", " ")} color={TYPE_COLOR[s.type] ?? t.cta} />
                  <Chip label={STORY_LABEL[s.story] ?? s.story} color={t.muted} />
                  <strong style={{ color: t.title }}>
                    {s.asset}.{s.column}
                  </strong>
                  <span style={{ marginLeft: "auto", color: t.ok, fontWeight: 700, fontSize: 13 }}>
                    Confiance {Math.round(s.confidence * 100)}%
                  </span>
                </div>
                <div style={{ margin: "6px 0", color: t.text }}>{s.proposed_value}</div>
                <div style={{ color: t.muted, fontSize: 12 }}>
                  PROPOSED · basis {s.basis.join(", ")} · {s.rationale}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Btn label="Approve" bg={t.ok} />
                  <Btn label="Edit" bg="#ffffff" fg={t.cta} border={t.cta} />
                  <Btn label="Reject" bg="#ffffff" fg={t.danger} border={t.danger} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 style={{ margin: "0 0 10px", fontSize: 18, color: t.title }}>Couverture par dimension</h2>
          <Bar label="Metadata" ratio={r.coverage.metadata.ratio} />
          <Bar label="Governance" ratio={r.coverage.governance.ratio} />
          <Bar label="Quality" ratio={r.coverage.quality.ratio} />
          <Bar label="Lineage" ratio={r.coverage.lineage.ratio} />
          <h3 style={{ margin: "16px 0 6px", fontSize: 15, color: t.title }}>Gaps détectés</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: t.text, fontSize: 14, lineHeight: 1.8 }}>
            <li>{r.gap_counts.description} descriptions manquantes</li>
            <li>{r.gap_counts.pii} attributs PII non classés</li>
            <li>{r.gap_counts.rule} règles de qualité attendues manquantes</li>
            <li>{r.gap_counts.lineage} lineage non déclaré</li>
            <li>{r.gap_counts.owner} propriétaires manquants</li>
          </ul>
          <p style={{ color: t.muted, fontSize: 12, marginTop: 12 }}>
            Résultat déterministe · données synthétiques. La validation régénère un export
            governance dans outputs/ (write-back simulé).
          </p>
        </Card>
      </div>
    </Shell>
  );
}

function Btn({ label, bg, fg = "#fff", border }: { label: string; bg: string; fg?: string; border?: string }) {
  return (
    <span
      style={{
        background: bg,
        color: fg,
        border: border ? `1px solid ${border}` : "none",
        padding: "6px 14px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}

function Bar({ label, ratio }: { label: string; ratio: number }) {
  const color = ratio < 0.3 ? t.danger : ratio < 0.6 ? t.warn : t.ok;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: t.text }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700 }}>{Math.round(ratio * 100)}%</span>
      </div>
      <div style={{ height: 8, background: "#eef1f6", borderRadius: 999, marginTop: 4 }}>
        <div style={{ width: `${Math.round(ratio * 100)}%`, height: 8, background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

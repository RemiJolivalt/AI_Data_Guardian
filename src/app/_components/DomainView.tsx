import { Shell, Card, Stat, Chip } from "@/app/_components/Shell";
import { SuggestionInbox } from "@/app/_components/SuggestionInbox";
import { t } from "@/app/_components/theme";
import type { DomainAssessmentResult } from "@/core/domain-pack/runDomainAssessment";

const pct = (ratio: number): string => `${Math.round(ratio * 100)}%`;

const FLYWHEEL = [
  "Outils (catalogue, DQ, policies)",
  "AI Guardian — assessment",
  "Recommandations groundées",
  "Validation humaine",
  "Capitalisation (knowledge)",
  "Write-back (governance, DQ) — simulé",
  "Meilleures analyses futures",
];

/** Presentational view for any Domain Pack assessment (Customer, Product, HR, ...). */
export function DomainView({ result: r }: { result: DomainAssessmentResult }) {
  const overall = r.coverage.overall;
  const storyLabels: Record<string, string> = Object.fromEntries(
    Object.entries(r.stories).map(([k, v]) => [k, v.label]),
  );

  return (
    <Shell
      active={`domain:${r.domain_id}`}
      title={`${r.label} Trust Assessment`}
      subtitle="Sait-on suffisamment décrire, gouverner et contrôler cette donnée ?"
      scope={`${r.label} · ${r.object_type.replace("_", " ")}`}
    >
      <p style={{ margin: "0 0 12px", color: t.muted, fontStyle: "italic" }}>
        We don’t assess data quality. We quantify trust for decisions, analytics and AI.
      </p>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginBottom: 16 }}>
        <Stat label="Knowledge coverage" value={pct(overall)} sub={`${r.totals.columns} colonnes · ${r.totals.assets} actifs`} subColor={overall < 0.5 ? t.danger : t.ok} />
        <Stat label="Business Glossary" value={pct(r.coverage.metadata.ratio)} sub="Metadata" />
        <Stat label="Accountability" value={pct(r.coverage.governance.ratio)} sub="Governance" />
        <Stat label="Control Coverage" value={pct(r.coverage.quality.ratio)} sub="Quality" />
        <Stat label="Impact Traceability" value={pct(r.coverage.lineage.ratio)} sub="Lineage" />
        <Stat label="Suggestions IA" value={String(r.suggestions.length)} sub="à valider" subColor={t.proposed} />
      </section>

      <Card style={{ marginBottom: 16, borderLeft: `4px solid ${t.danger}` }}>
        <strong style={{ color: t.title }}>{r.label} data is not ready for autonomous use.</strong>
        <p style={{ margin: "6px 0 0", color: t.text }}>
          Seulement <strong>{pct(overall)}</strong> de la donnée nécessaire à une vue fiable est décrite,
          gouvernée et contrôlée. {r.gap_counts.pii} attribut(s) personnel(s) non classé(s),{" "}
          {r.gap_counts.description} description(s) et {r.gap_counts.rule} règle(s) attendue(s) manquantes.
        </p>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <SuggestionInbox domainId={r.domain_id} suggestions={r.suggestions} storyLabels={storyLabels} />

        <Card>
          <h2 style={{ margin: "0 0 10px", fontSize: 18, color: t.title }}>Couverture par dimension</h2>
          <Bar label="Business Glossary (Metadata)" ratio={r.coverage.metadata.ratio} />
          <Bar label="Accountability (Governance)" ratio={r.coverage.governance.ratio} />
          <Bar label="Control Coverage (Quality)" ratio={r.coverage.quality.ratio} />
          <Bar label="Impact Traceability (Lineage)" ratio={r.coverage.lineage.ratio} />
          <h3 style={{ margin: "16px 0 6px", fontSize: 15, color: t.title }}>Gaps détectés</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: t.text, fontSize: 14, lineHeight: 1.8 }}>
            <li>{r.gap_counts.description} descriptions manquantes</li>
            <li>{r.gap_counts.pii} attributs PII non classés</li>
            <li>{r.gap_counts.rule} règles de qualité attendues manquantes</li>
            <li>{r.gap_counts.lineage} lineage non déclaré</li>
          </ul>
        </Card>
      </div>

      <Card>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, color: t.title }}>Knowledge Flywheel</h2>
        <p style={{ margin: "0 0 12px", color: t.muted, fontSize: 13 }}>
          Chaque validation enrichit le patrimoine et améliore les prochaines analyses — une mémoire
          organisationnelle auto-apprenante.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {FLYWHEEL.map((step, i) => (
            <span key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ background: "#f2f5fb", border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 13, color: t.text }}>
                {step}
              </span>
              {i < FLYWHEEL.length - 1 ? <span style={{ color: t.accent, fontWeight: 800 }}>→</span> : null}
            </span>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <Chip label="Enterprise Knowledge Growth" color={t.proposed} />
          <span style={{ color: t.muted, fontSize: 13 }}>
            Chaque PII validée se propage aux attributs similaires (ex. *_email) — l’entreprise
            n’améliore plus une colonne, mais tout le patrimoine.
          </span>
        </div>
      </Card>
    </Shell>
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

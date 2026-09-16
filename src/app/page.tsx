import type { Route } from "next";
import Link from "next/link";
import { Shell, Card, Stat, Chip } from "@/app/_components/Shell";
import { t } from "@/app/_components/theme";
import { loadDataMap } from "@/core/data-map/registry";
import { getDecisionsStore } from "@/core/data-map/decisions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const scoreColor = (score: number): string => (score >= 75 ? t.ok : score >= 60 ? t.warn : t.danger);

export default function CockpitPage() {
  const map = loadDataMap(process.cwd());
  const criticalObjects = map.businessObjects.filter((o) => o.businessCriticality === "Élevée").length;
  const controlsToExtend = map.businessObjects.reduce(
    (sum, o) => sum + Math.max(0, o.recommendedControls - o.existingControls),
    0,
  );
  const pendingDecisions = getDecisionsStore()
    .list()
    .filter((d) => d.status === "À valider").length;

  const priority = map.businessObjects.find((o) => o.id === "customer_360");

  return (
    <Shell
      active="cockpit"
      title="Trust Cockpit"
      subtitle="Identifiez où vos données fragilisent les décisions et où l’expertise peut être étendue."
    >
      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
        <Card>
          <div style={{ color: t.muted, fontSize: 13 }}>Score global de confiance</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 44, fontWeight: 800, color: scoreColor(map.globalTrustScore) }}>
              {map.globalTrustScore}
            </span>
            <span style={{ color: t.muted, fontSize: 18 }}>/ 100</span>
          </div>
          <div style={{ marginTop: 6 }}>
            <Chip label={map.trustStatus} color={t.warn} />
          </div>
        </Card>
        <Stat label="Objets critiques" value={String(criticalObjects)} sub="Criticité élevée" subColor={t.danger} />
        <Stat label="Contrôles à étendre" value={String(controlsToExtend)} sub="Réutilisables" subColor={t.cta} />
        <Stat
          label="Décisions expertes en attente"
          value={String(pendingDecisions)}
          sub="File de validation"
          subColor={t.proposed}
        />
      </section>

      {priority ? (
        <Card style={{ borderLeft: `4px solid ${t.danger}`, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 800, color: t.title, fontSize: 18 }}>⚠ {priority.name}</span>
                <Chip label="Exposition Élevée" color={t.danger} />
              </div>
              <p style={{ margin: "8px 0 0", color: t.text, maxWidth: 720 }}>
                Les contrôles de complétude ne couvrent pas les données de contact utilisées par les
                campagnes et le service client, ce qui fragilise les décisions clients et les usages IA.
              </p>
              <p style={{ margin: "8px 0 0", color: t.muted, fontSize: 13 }}>
                Action recommandée : étendre les contrôles éprouvés aux objets de contact similaires.
              </p>
            </div>
            <span style={{ fontSize: 26, fontWeight: 800, color: scoreColor(priority.trustScore) }}>
              {priority.trustScore}
            </span>
          </div>
        </Card>
      ) : null}

      <div style={{ display: "flex", gap: 12 }}>
        <Link
          href={"/analysis?object=customer_360" as Route}
          style={{
            padding: "0.8rem 1.2rem",
            background: `linear-gradient(90deg, ${t.cta}, #3a6ef0)`,
            color: "#fff",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Comprendre et agir →
        </Link>
        <Link
          href={"/map?domain=customer" as Route}
          style={{
            padding: "0.8rem 1.2rem",
            background: "#fff",
            color: t.cta,
            border: `1px solid ${t.border}`,
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Voir la couverture (Data Scope)
        </Link>
      </div>

      <p style={{ marginTop: 26, color: t.muted, fontSize: 13, maxWidth: 760 }}>
        Transformez l’expertise Data Office en une capacité d’AI Trust réutilisable et scalable.
        <br />
        Données synthétiques · prototype de démonstration.
      </p>
    </Shell>
  );
}

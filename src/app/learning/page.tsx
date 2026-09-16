import type { Route } from "next";
import Link from "next/link";
import { Shell, Card, Stat } from "@/app/_components/Shell";
import { t } from "@/app/_components/theme";
import { getDecisionsStore } from "@/core/data-map/decisions";
import { summarizeLearning } from "@/core/data-map/learning";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function LearningPage() {
  const stats = summarizeLearning(getDecisionsStore().list());

  return (
    <Shell
      active="learning"
      title="Learning Engine"
      subtitle="L’entreprise capitalise l’expertise et la réutilise. Chaque décision experte améliore les futures recommandations."
    >
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <Stat label="Suggestions proposées" value={String(stats.proposed)} />
        <Stat label="Suggestions validées" value={String(stats.validated)} sub="Capitalisées" subColor={t.ok} />
        <Stat label="Règles réutilisées" value={String(stats.rulesReused)} sub="Étendues à d’autres objets" subColor={t.cta} />
        <Stat label="Objets enrichis" value={String(stats.objectsEnriched)} subColor={t.proposed} />
      </section>

      <Card>
        <div style={{ fontWeight: 800, color: t.title, marginBottom: 10 }}>Historique de réutilisation</div>
        {stats.propagations.length === 0 ? (
          <div style={{ color: t.muted }}>
            <p style={{ margin: "0 0 10px" }}>
              Aucune connaissance capitalisée pour l’instant. Lancez une analyse depuis le Trust Cockpit, puis
              validez une extension.
            </p>
            <Link href={"/analysis?object=customer_360" as Route} style={{ color: t.cta, fontWeight: 700 }}>
              ⚡ Lancer une analyse Guardian →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {stats.propagations.map((p, i) => (
              <div
                key={`${p.sourceObjectId}-${p.targetObjectId}-${i}`}
                style={{ borderLeft: `3px solid ${t.ok}`, padding: "0.4rem 0.8rem", background: "#f7fbf9" }}
              >
                <span style={{ fontWeight: 700, color: t.title }}>{p.sourceObjectId}</span>
                <span style={{ color: t.muted }}> → règle validée → appliquée à </span>
                <span style={{ fontWeight: 700, color: t.title }}>{p.targetObjectId}</span>
                <div style={{ fontSize: 13, color: t.muted }}>{p.controlLabel}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <p style={{ marginTop: 18, color: t.muted, fontSize: 13, maxWidth: 760 }}>
        AI Data Guardian transforme l’expertise humaine en connaissances réutilisables et étend progressivement
        la confiance sur le patrimoine de données.
      </p>
    </Shell>
  );
}

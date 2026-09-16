import type { Route } from "next";
import Link from "next/link";
import { Shell, Card, Chip } from "@/app/_components/Shell";
import { t } from "@/app/_components/theme";
import { MapExplorer } from "@/app/_components/MapExplorer";
import { loadDataMap } from "@/core/data-map/registry";
import { getDecisionsStore } from "@/core/data-map/decisions";
import { capitalizedByTarget } from "@/core/data-map/learning";
import { computeGuardianCoverage } from "@/core/data-map/coverage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DataScopePage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;
  const map = loadDataMap(process.cwd());
  const coverage = computeGuardianCoverage(map, capitalizedByTarget(getDecisionsStore().list()));

  return (
    <Shell
      active="scope"
      title="Data Scope — sous Guardian"
      subtitle="Choisissez le périmètre, mesurez la couverture et identifiez les prochains objets à protéger."
      scope={`GUARDIAN COVERAGE ${coverage.coveragePercent}%`}
    >
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12, marginBottom: 18 }}>
        <Card>
          <div style={{ color: t.muted, fontSize: 13 }}>Guardian Coverage</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: t.cta }}>{coverage.coveragePercent}%</span>
            <span style={{ color: t.muted, fontSize: 14 }}>
              {coverage.guardedObjects}/{coverage.totalObjects} objets couverts
            </span>
          </div>
          <p style={{ margin: "6px 0 0", color: t.muted, fontSize: 12 }}>
            Part des contrôles recommandés déjà en place · valeur calculée.
          </p>
        </Card>

        {coverage.recommendedNext ? (
          <Card style={{ borderLeft: `4px solid ${t.proposed}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 800, color: t.title, fontSize: 17 }}>
                    ⭐ Prochain objet recommandé : {coverage.recommendedNext.name}
                  </span>
                </div>
                <p style={{ margin: "6px 0 0", color: t.muted, fontSize: 13 }}>
                  Voici où étendre la confiance en priorité.
                </p>
              </div>
              <Chip label={`+${coverage.recommendedNext.trustGainPercent}% couverture`} color={t.proposed} />
            </div>
            <Link
              href={`/analysis?object=${coverage.recommendedNext.objectId}` as Route}
              style={{
                display: "inline-block",
                marginTop: 12,
                padding: "0.6rem 1rem",
                borderRadius: 10,
                background: `linear-gradient(90deg, ${t.cta}, #3a6ef0)`,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Analyser et étendre →
            </Link>
          </Card>
        ) : (
          <Card>
            <div style={{ fontWeight: 700, color: t.ok }}>Tous les objets cartographiés sont couverts.</div>
          </Card>
        )}
      </section>

      <MapExplorer initialDomainId={domain} />
    </Shell>
  );
}

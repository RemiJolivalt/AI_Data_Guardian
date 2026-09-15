import type { Route } from "next";
import Link from "next/link";
import { t } from "@/app/_components/theme";
import { listDomains } from "@/core/domain-pack/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JOURNEY = [
  "1. Voir le risque business",
  "2. Comprendre la cause",
  "3. Décider et remédier",
  "4. Prouver la confiance",
];

function ScenarioCard({
  href,
  badge,
  title,
  desc,
  metric,
}: {
  href: Route;
  badge: string;
  title: string;
  desc: string;
  metric: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: "1.5rem",
        textDecoration: "none",
        color: "#eaf0fb",
      }}
    >
      <span style={{ color: t.accent, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{badge}</span>
      <h2 style={{ margin: "0.5rem 0", color: "#fff", fontSize: 22 }}>{title}</h2>
      <p style={{ margin: "0 0 0.75rem", color: "#aebfe0" }}>{desc}</p>
      <p style={{ margin: 0, color: "#7f92bd", fontSize: 13 }}>{metric}</p>
      <p style={{ margin: "1rem 0 0", color: t.accent, fontWeight: 700 }}>Ouvrir →</p>
    </Link>
  );
}

export default function HomePage() {
  let domains: { domain_id: string; label: string; object_type: string; description: string }[] = [];
  try {
    domains = listDomains(process.cwd()).map((d) => ({
      domain_id: d.domain_id,
      label: d.manifest.label,
      object_type: d.manifest.object_type,
      description: d.manifest.description,
    }));
  } catch {
    domains = [];
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${t.sidebarBg} 0%, #0c2550 100%)`,
        color: "#eaf0fb",
        fontFamily: "system-ui, sans-serif",
        padding: "3rem 4rem",
      }}
    >
      <div style={{ height: 4, background: `linear-gradient(90deg, ${t.accent}, ${t.cta})`, marginBottom: 40 }} />
      <span style={{ background: "#0f2a55", color: t.accent, padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
        AI TRUST PLATFORM
      </span>

      <h1 style={{ fontSize: 48, margin: "1.5rem 0 0.5rem", color: "#fff" }}>AI Data Guardian</h1>
      <p style={{ fontSize: 20, color: "#aebfe0", maxWidth: 720, margin: 0 }}>
        Puis-je faire confiance à cette donnée pour cet usage ? Quel est le risque métier ? Quelles
        actions donnent le plus de confiance au moindre effort ?
      </p>

      <p style={{ color: t.accent, fontWeight: 700, margin: "2.5rem 0 0.75rem" }}>Scénario par décision (KPI)</p>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 980 }}>
        <ScenarioCard
          href={"/cockpit" as Route}
          badge="KPI & DÉCISION"
          title="Executive Trust — Revenue"
          desc="Le KPI Net Revenue est-il fiable pour le comité ? Causes, exposition et remédiation."
          metric="Trust Score · Why not trusted · Exposition simulée"
        />
      </section>

      <p style={{ color: t.accent, fontWeight: 700, margin: "2.5rem 0 0.75rem" }}>
        Objets métier (Domain Packs) — ajout par simple dépôt d’un dossier
      </p>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 980 }}>
        {domains.map((d) => (
          <ScenarioCard
            key={d.domain_id}
            href={`/domain/${d.domain_id}` as Route}
            badge={d.object_type.replace("_", " ")}
            title={`${d.label} Trust Assessment`}
            desc={d.description || "Connaissance, gouvernance, qualité et lineage de l’objet métier."}
            metric="Knowledge coverage · Gaps · Suggestions IA groundées"
          />
        ))}
      </section>

      <p style={{ color: t.accent, fontWeight: 700, margin: "2.5rem 0 0.75rem" }}>Parcours démonstrateur</p>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 980 }}>
        {JOURNEY.map((step) => (
          <div key={step} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "1rem 1.1rem", fontWeight: 600 }}>
            {step}
          </div>
        ))}
      </section>

      <p style={{ color: "#7f92bd", fontSize: 13, marginTop: 40 }}>
        Prototype haute fidélité · Données synthétiques ·{" "}
        <Link href={"/runs" as Route} style={{ color: t.accent }}>
          Historique des runs
        </Link>
      </p>
    </main>
  );
}

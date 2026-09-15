import type { Route } from "next";
import Link from "next/link";
import { t } from "@/app/_components/theme";

export const dynamic = "force-static";

const SCENARIOS: {
  href: Route;
  badge: string;
  title: string;
  desc: string;
  metric: string;
}[] = [
  {
    href: "/cockpit" as Route,
    badge: "KPI & DÉCISION",
    title: "Executive Trust — Revenue",
    desc: "Le KPI Net Revenue est-il fiable pour le comité ? Causes, exposition et remédiation.",
    metric: "Trust Score · Why not trusted · Exposition simulée",
  },
  {
    href: "/customer" as Route,
    badge: "CONNAISSANCE DONNÉE",
    title: "Customer Trust Assessment",
    desc: "Sait-on décrire, gouverner et contrôler la donnée client ? L’IA complète les lacunes.",
    metric: "Knowledge coverage · Gaps · Suggestions IA groundées",
  },
];

const JOURNEY = [
  "1. Voir le risque business",
  "2. Comprendre la cause",
  "3. Décider et remédier",
  "4. Prouver la confiance",
];

export default function HomePage() {
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
      <span
        style={{
          background: "#0f2a55",
          color: t.accent,
          padding: "6px 14px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        AI TRUST PLATFORM
      </span>

      <h1 style={{ fontSize: 48, margin: "1.5rem 0 0.5rem", color: "#fff" }}>AI Data Guardian</h1>
      <p style={{ fontSize: 20, color: "#aebfe0", maxWidth: 720, margin: 0 }}>
        Puis-je faire confiance à cette donnée pour cet usage ? Quel est le risque métier ? Quelles
        actions donnent le plus de confiance au moindre effort ?
      </p>

      <p style={{ color: t.accent, fontWeight: 700, margin: "2.5rem 0 0.75rem" }}>Choisir un scénario</p>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 980 }}>
        {SCENARIOS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
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
            <span style={{ color: t.accent, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{s.badge}</span>
            <h2 style={{ margin: "0.5rem 0", color: "#fff", fontSize: 22 }}>{s.title}</h2>
            <p style={{ margin: "0 0 0.75rem", color: "#aebfe0" }}>{s.desc}</p>
            <p style={{ margin: 0, color: "#7f92bd", fontSize: 13 }}>{s.metric}</p>
            <p style={{ margin: "1rem 0 0", color: t.accent, fontWeight: 700 }}>Ouvrir →</p>
          </Link>
        ))}
      </section>

      <p style={{ color: t.accent, fontWeight: 700, margin: "2.5rem 0 0.75rem" }}>Parcours démonstrateur</p>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, maxWidth: 980 }}>
        {JOURNEY.map((step) => (
          <div
            key={step}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              padding: "1rem 1.1rem",
              fontWeight: 600,
            }}
          >
            {step}
          </div>
        ))}
      </section>

      <p style={{ color: "#7f92bd", fontSize: 13, marginTop: 40 }}>
        Prototype haute fidélité · Données synthétiques · <Link href={"/runs" as Route} style={{ color: t.accent }}>Historique des runs</Link>
      </p>
    </main>
  );
}

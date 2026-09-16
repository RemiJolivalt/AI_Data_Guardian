import type { Route } from "next";
import Link from "next/link";
import { Shell } from "@/app/_components/Shell";
import { ExpertDecisionQueue } from "@/app/_components/ExpertDecisionQueue";
import { t } from "@/app/_components/theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ExpertDecisionsPage() {
  return (
    <Shell
      active="cockpit"
      title="Décisions expertes"
      subtitle="Validez, ajustez ou rejetez les extensions proposées — chaque décision devient réutilisable."
    >
      <ExpertDecisionQueue />
      <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
        <Link href={"/learning" as Route} style={{ color: t.cta, fontWeight: 700 }}>
          🧠 Voir le Learning Engine →
        </Link>
        <Link href={"/map" as Route} style={{ color: t.cta, fontWeight: 700 }}>
          🗺️ Voir la couverture (Data Scope) →
        </Link>
      </div>
    </Shell>
  );
}

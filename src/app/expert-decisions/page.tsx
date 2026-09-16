import { Shell } from "@/app/_components/Shell";
import { ExpertDecisionQueue } from "@/app/_components/ExpertDecisionQueue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function ExpertDecisionsPage() {
  return (
    <Shell
      active="decisions"
      title="Décisions expertes"
      subtitle="Validez, ajustez ou rejetez les extensions proposées — chaque décision devient réutilisable."
    >
      <ExpertDecisionQueue />
    </Shell>
  );
}

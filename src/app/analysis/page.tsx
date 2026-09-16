import { Shell } from "@/app/_components/Shell";
import { GuardianAnalysis } from "@/app/_components/GuardianAnalysis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ object?: string }>;
}) {
  const { object } = await searchParams;
  const objectId = object ?? "customer_360";
  return (
    <Shell
      active="cockpit"
      title="Analyse Guardian"
      subtitle="Ce que l’IA comprend, explique et recommande pour le périmètre choisi."
    >
      <GuardianAnalysis objectId={objectId} />
    </Shell>
  );
}

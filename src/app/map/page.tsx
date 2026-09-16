import { Shell } from "@/app/_components/Shell";
import { MapExplorer } from "@/app/_components/MapExplorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;
  return (
    <Shell
      active="map"
      title="Carte du patrimoine de données"
      subtitle="Visualisez l’entreprise, choisissez le périmètre et étendez progressivement la confiance."
    >
      <MapExplorer initialDomainId={domain} />
    </Shell>
  );
}

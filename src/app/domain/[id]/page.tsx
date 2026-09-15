import { notFound } from "next/navigation";
import { runDomainAssessment } from "@/core/domain-pack/runDomainAssessment";
import { DomainView } from "@/app/_components/DomainView";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DomainPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ assets?: string }>;
}) {
  const { id } = await params;
  const { assets } = await searchParams;
  const scope = assets ? assets.split(",").filter((a) => a.length > 0) : undefined;
  try {
    const result = runDomainAssessment({ rootDir: process.cwd(), domainId: id, assets: scope });
    return <DomainView result={result} scope={scope} />;
  } catch {
    notFound();
  }
}

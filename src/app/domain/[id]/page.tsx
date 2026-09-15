import { notFound } from "next/navigation";
import { runDomainAssessment } from "@/core/domain-pack/runDomainAssessment";
import { DomainView } from "@/app/_components/DomainView";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DomainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = runDomainAssessment({ rootDir: process.cwd(), domainId: id });
    return <DomainView result={result} />;
  } catch {
    notFound();
  }
}

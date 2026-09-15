import { notFound } from "next/navigation";
import { runDomainAssessment } from "@/core/domain-pack/runDomainAssessment";
import { getWorkspaceStore } from "@/core/memory";
import type { LearnedRule } from "@/core/learning/engine";
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
  const store = getWorkspaceStore();

  let learned: LearnedRule[] = [];
  let persistedScope: string[] | null = null;
  try {
    learned = (await store.listLearnedRules()).map(({ domain_id: _d, ...rule }) => rule);
  } catch {
    learned = [];
  }
  try {
    persistedScope = await store.getScope(id);
  } catch {
    persistedScope = null;
  }

  const queryScope = assets ? assets.split(",").filter((a) => a.length > 0) : undefined;
  const scope = queryScope ?? persistedScope ?? undefined;

  try {
    const result = runDomainAssessment({ rootDir: process.cwd(), domainId: id, assets: scope, learned });
    return <DomainView result={result} scope={scope} learnedCount={learned.length} />;
  } catch {
    notFound();
  }
}

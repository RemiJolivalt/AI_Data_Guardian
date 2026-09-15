import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getWorkspaceStore } from "@/core/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/domain/[id]/scope — persists the supervision scope (tables under supervision). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const correlationId = randomUUID();
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { assets?: string[] };
  const assets = Array.isArray(body.assets) ? body.assets.filter((a) => typeof a === "string") : [];
  try {
    await getWorkspaceStore().setScope(id, assets);
    return NextResponse.json({ correlation_id: correlationId, domain_id: id, assets });
  } catch (err) {
    return NextResponse.json(
      { correlation_id: correlationId, error: err instanceof Error ? err.message : "error" },
      { status: 400 },
    );
  }
}

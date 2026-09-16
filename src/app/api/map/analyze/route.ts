import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { loadDataMap, getObject } from "@/core/data-map/registry";
import { analyzeObject } from "@/core/data-map/analysis";
import { getDecisionsStore } from "@/core/data-map/decisions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  objectId: z.string().min(1),
  includedTableIds: z.array(z.string()).default([]),
});

/** POST /api/map/analyze — runs the deterministic Guardian analysis for a selected object. */
export async function POST(req: Request) {
  const correlationId = randomUUID();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { correlation_id: correlationId, error: "objectId required" },
      { status: 400 },
    );
  }
  try {
    const map = loadDataMap(process.cwd());
    if (!getObject(map, parsed.data.objectId)) {
      return NextResponse.json(
        { correlation_id: correlationId, error: "unknown objectId" },
        { status: 404 },
      );
    }
    const decided = getDecisionsStore().decidedFor(parsed.data.objectId);
    const analysis = analyzeObject(map, parsed.data.objectId, parsed.data.includedTableIds, decided);
    return NextResponse.json(
      { correlation_id: correlationId, analysis },
      { headers: { "x-correlation-id": correlationId } },
    );
  } catch (err) {
    return NextResponse.json(
      { correlation_id: correlationId, error: err instanceof Error ? err.message : "error" },
      { status: 500 },
    );
  }
}

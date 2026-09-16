import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { loadDataMap } from "@/core/data-map/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/map — returns the synthetic Enterprise Data Map (Carte du patrimoine). */
export async function GET() {
  const correlationId = randomUUID();
  try {
    const map = loadDataMap(process.cwd());
    return NextResponse.json(
      { correlation_id: correlationId, map },
      { headers: { "x-correlation-id": correlationId } },
    );
  } catch (err) {
    return NextResponse.json(
      { correlation_id: correlationId, error: err instanceof Error ? err.message : "error" },
      { status: 500 },
    );
  }
}

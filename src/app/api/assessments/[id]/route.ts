import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAssessmentRepository } from "@/core/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/assessments/[id] — returns one persisted assessment run (cahier §13). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const correlationId = randomUUID();
  const { id } = await params;
  const run = await getAssessmentRepository().get(id);
  if (!run) {
    return NextResponse.json(
      { correlation_id: correlationId, error: "not_found" },
      { status: 404, headers: { "x-correlation-id": correlationId } },
    );
  }
  return NextResponse.json(
    { correlation_id: correlationId, ...run },
    { headers: { "x-correlation-id": correlationId } },
  );
}

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAssessmentRepository } from "@/core/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/assessments — lists persisted assessment runs (cahier §13). */
export async function GET() {
  const correlationId = randomUUID();
  const runs = await getAssessmentRepository().list();
  return NextResponse.json(
    { correlation_id: correlationId, runs },
    { headers: { "x-correlation-id": correlationId } },
  );
}

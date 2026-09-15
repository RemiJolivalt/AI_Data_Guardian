import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { runAssessment } from "@/core/assessment/runAssessment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/assessments/demo — runs the deterministic demo assessment (cahier §13). */
export function GET() {
  const correlationId = randomUUID();
  const result = runAssessment({ rootDir: process.cwd() });
  return NextResponse.json(
    { correlation_id: correlationId, ...result },
    { headers: { "x-correlation-id": correlationId } },
  );
}

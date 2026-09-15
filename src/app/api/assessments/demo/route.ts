import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { runAssessment } from "@/core/assessment/runAssessment";
import { getAssessmentRepository } from "@/core/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/assessments/demo — runs the deterministic demo assessment and persists it
 * (cahier §13). Persistence failures do not fail the request; `persisted` reports the outcome.
 */
export async function GET() {
  const correlationId = randomUUID();
  const now = new Date();
  const assessmentId = `ASM-${now.getTime()}`;
  const result = runAssessment({ rootDir: process.cwd(), now, assessmentId });

  let persisted = false;
  let persistError: string | null = null;
  try {
    await getAssessmentRepository().save(result);
    persisted = true;
  } catch (err) {
    persistError = err instanceof Error ? err.message : "unknown error";
  }

  return NextResponse.json(
    { correlation_id: correlationId, persisted, persist_error: persistError, ...result },
    { headers: { "x-correlation-id": correlationId } },
  );
}

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getDecisionsStore } from "@/core/data-map/decisions";
import { GuardianRecommendation, DecisionStatus } from "@/core/data-map/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function snapshot() {
  const store = getDecisionsStore();
  return { decisions: store.list(), capitalizedCount: store.capitalizedCount() };
}

/** GET /api/map/decisions — lists expert decisions and the capitalized counter. */
export async function GET() {
  const correlationId = randomUUID();
  return NextResponse.json(
    { correlation_id: correlationId, ...snapshot() },
    { headers: { "x-correlation-id": correlationId } },
  );
}

const Body = z.object({
  recommendation: GuardianRecommendation,
  status: DecisionStatus,
  decidedAt: z.string().min(1),
  controlLabel: z.string().optional(),
  parameter: z.string().optional(),
  expertComment: z.string().optional(),
});

/** POST /api/map/decisions — records an expert decision (Valider / Modifier / Rejeter). */
export async function POST(req: Request) {
  const correlationId = randomUUID();
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { correlation_id: correlationId, error: "invalid decision payload" },
      { status: 400 },
    );
  }
  const decision = getDecisionsStore().record(parsed.data);
  return NextResponse.json(
    { correlation_id: correlationId, decision, ...snapshot() },
    { headers: { "x-correlation-id": correlationId } },
  );
}

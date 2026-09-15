import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

/**
 * GET /health (cahier §13). Returns a lightweight liveness payload with a correlation id.
 */
export function GET() {
  const correlationId = randomUUID();
  return NextResponse.json(
    {
      status: "ok",
      service: "ai-data-guardian",
      demo_mode: process.env.DEMO_MODE !== "false",
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
    },
    { headers: { "x-correlation-id": correlationId } },
  );
}

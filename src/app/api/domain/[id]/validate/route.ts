import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { validateSuggestion } from "@/core/learning/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/domain/[id]/validate — approves a suggestion, propagates it, returns before/after. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const correlationId = randomUUID();
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { suggestion_id?: string };
  if (!body.suggestion_id) {
    return NextResponse.json(
      { correlation_id: correlationId, error: "suggestion_id required" },
      { status: 400 },
    );
  }
  try {
    const result = validateSuggestion({
      rootDir: process.cwd(),
      domainId: id,
      suggestionId: body.suggestion_id,
    });
    // Simulated write-back targets — no external write in the MVP (cahier §3.2, §10.1).
    const writeback_simulated = ["Governance catalog", "Business Glossary", "PII Registry"];
    return NextResponse.json(
      { correlation_id: correlationId, ...result, writeback_simulated },
      { headers: { "x-correlation-id": correlationId } },
    );
  } catch (err) {
    return NextResponse.json(
      { correlation_id: correlationId, error: err instanceof Error ? err.message : "error" },
      { status: 400 },
    );
  }
}

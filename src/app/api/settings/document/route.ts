import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getWorkspaceStore } from "@/core/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/settings/document — ingests a context document as DATA (never as instructions).
 * Text is stored for grounding; binary/PDF parsing is on the roadmap.
 */
export async function POST(req: Request) {
  const correlationId = randomUUID();
  const body = (await req.json().catch(() => ({}))) as {
    domain?: string;
    name?: string;
    doc_type?: string;
    text?: string;
  };
  if (!body.domain || !body.name) {
    return NextResponse.json(
      { correlation_id: correlationId, error: "domain and name are required" },
      { status: 400 },
    );
  }
  const doc = {
    document_id: `DOC-${Date.now()}`,
    domain_id: body.domain,
    name: body.name,
    doc_type: body.doc_type || "document",
    text: (body.text ?? "").slice(0, 20000),
    is_synthetic: true,
    created_at: new Date().toISOString(),
  };
  try {
    await getWorkspaceStore().addDocument(doc);
    return NextResponse.json({ correlation_id: correlationId, document: { ...doc, text: undefined } });
  } catch (err) {
    return NextResponse.json(
      { correlation_id: correlationId, error: err instanceof Error ? err.message : "error" },
      { status: 400 },
    );
  }
}

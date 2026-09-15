import Link from "next/link";
import { getAssessmentRepository } from "@/core/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function RunsPage() {
  let rows: { id: string; scenario: string; status: string; overall: number | null; created_at: string }[] = [];
  let error: string | null = null;
  try {
    rows = await getAssessmentRepository().list();
  } catch (err) {
    error = err instanceof Error ? err.message : "unknown error";
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 900 }}>
      <h1>Assessment runs</h1>
      <p>
        <Link href={"/api/assessments/demo" as never}>Run a new assessment</Link> · then refresh
        this page. Persisted in Supabase when configured.
      </p>

      {error ? (
        <p style={{ color: "#a33" }}>
          Could not load runs: {error}. If the table is missing, run
          <code> supabase/migrations/0001_assessment_runs.sql</code> in the Supabase SQL editor.
        </p>
      ) : rows.length === 0 ? (
        <p style={{ color: "#666" }}>No runs yet. Trigger one via /api/assessments/demo.</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <Th>Run id</Th>
              <Th>Scenario</Th>
              <Th>Trust status</Th>
              <Th>Overall</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <Td>{r.id}</Td>
                <Td>{r.scenario}</Td>
                <Td>{r.status}</Td>
                <Td>{r.overall === null ? "—" : `${Math.round(r.overall * 100)}%`}</Td>
                <Td>{r.created_at}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", borderBottom: "2px solid #ccc", padding: "6px 8px", fontSize: 13 }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ borderBottom: "1px solid #eee", padding: "6px 8px", fontSize: 14 }}>{children}</td>;
}

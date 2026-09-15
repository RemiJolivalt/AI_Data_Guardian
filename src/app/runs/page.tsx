import type { Route } from "next";
import Link from "next/link";
import { getAssessmentRepository } from "@/core/memory";
import { Shell, Card } from "@/app/_components/Shell";
import { t } from "@/app/_components/theme";

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
    <Shell active="runs" title="Assessment runs" subtitle="Historique persisté des évaluations">
      <Card>
        <p style={{ marginTop: 0 }}>
          <Link href={"/api/assessments/demo" as Route} style={{ color: t.cta }}>
            Lancer une évaluation
          </Link>{" "}
          puis rafraîchir. Persisté dans Supabase quand configuré.
        </p>

        {error ? (
          <p style={{ color: t.danger }}>
            Impossible de charger les runs : {error}. Si la table manque, exécuter{" "}
            <code>supabase/migrations/0001_assessment_runs.sql</code> dans le SQL editor Supabase.
          </p>
        ) : rows.length === 0 ? (
          <p style={{ color: t.muted }}>Aucun run pour l’instant. Déclenchez-en un via /api/assessments/demo.</p>
        ) : (
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <Th>Run id</Th>
                <Th>Scénario</Th>
                <Th>Trust status</Th>
                <Th>Overall</Th>
                <Th>Créé</Th>
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
      </Card>
    </Shell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", borderBottom: `2px solid ${t.border}`, padding: "6px 8px", fontSize: 13, color: t.muted }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ borderBottom: `1px solid ${t.border}`, padding: "6px 8px", fontSize: 14 }}>{children}</td>;
}

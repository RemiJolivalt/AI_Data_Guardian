import type { Route } from "next";
import Link from "next/link";
import { Shell, Card, Chip } from "@/app/_components/Shell";
import { ScopeSelector } from "@/app/_components/ScopeSelector";
import { DeclareForm } from "@/app/_components/DeclareForm";
import { AddDocumentForm } from "@/app/_components/AddDocumentForm";
import { t } from "@/app/_components/theme";
import { listDomains } from "@/core/domain-pack/registry";
import { getWorkspaceStore } from "@/core/memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string }>;
}) {
  const { domain } = await searchParams;
  const domains = listDomains(process.cwd());
  const selected = domains.find((d) => d.domain_id === domain) ?? domains[0];

  if (!selected) {
    return (
      <Shell active="settings" title="Paramètres & Connexions" subtitle="Aucun domaine enregistré">
        <Card>Enregistrez un Domain Pack dans config/domains.yaml.</Card>
      </Shell>
    );
  }

  const m = selected.manifest;
  const documents = await getWorkspaceStore()
    .listDocuments(selected.domain_id)
    .catch(() => []);
  const connections = [
    { tool: "Data Governance (catalogue)", source: m.catalog_file, kind: "Collibra / Purview / DataGalaxy" },
    { tool: "Data Quality", source: m.rules_file, kind: "DQ engine" },
    { tool: "Knowledge & Contexte", source: m.knowledge_pack_file, kind: "Industry knowledge pack (curated)" },
  ];

  return (
    <Shell
      active="settings"
      title="Paramètres & Connexions"
      subtitle="Connecter les outils, ajouter du contexte, cibler les tables sous supervision"
      scope={selected.manifest.label}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {domains.map((d) => (
          <Link
            key={d.domain_id}
            href={`/settings?domain=${d.domain_id}` as Route}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 13,
              background: d.domain_id === selected.domain_id ? t.cta : "#fff",
              color: d.domain_id === selected.domain_id ? "#fff" : t.cta,
              border: `1px solid ${t.cta}`,
            }}
          >
            {d.manifest.label}
          </Link>
        ))}
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, color: t.title }}>Connexions aux outils</h2>
        <p style={{ margin: "0 0 12px", color: t.muted, fontSize: 13 }}>
          Sources actuellement branchées (simulées par des exports fichiers). Les connecteurs réels
          sont sur la roadmap, derrière la même interface.
        </p>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <Th>Outil</Th>
              <Th>Type</Th>
              <Th>Source</Th>
              <Th>Statut</Th>
            </tr>
          </thead>
          <tbody>
            {connections.map((c) => (
              <tr key={c.tool}>
                <Td><strong>{c.tool}</strong></Td>
                <Td style={{ color: t.muted }}>{c.kind}</Td>
                <Td style={{ color: t.muted }}>{c.source}</Td>
                <Td><Chip label="Connecté · SIMULÉ" color={t.ok} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: "12px 0 4px", fontWeight: 700, color: t.title }}>Ajouter un connecteur (déclaratif)</p>
        <DeclareForm fields={["Type d'outil", "URL", "Token (non stocké)"]} cta="Déclarer la connexion" placeholder="connecteur" />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, color: t.title }}>Base de données & périmètre de supervision</h2>
        <p style={{ margin: "0 0 12px", color: t.muted, fontSize: 13 }}>
          Choisir les tables à placer sous supervision d’AI Data Guardian (ou toute la base). La
          sélection re-calcule réellement l’assessment.
        </p>
        <ScopeSelector
          domainId={selected.domain_id}
          assets={m.assets.map((a) => ({ asset: a.asset, file: a.file, role: a.role }))}
        />
        <p style={{ margin: "12px 0 4px", fontWeight: 700, color: t.title }}>Connecter une base (déclaratif)</p>
        <DeclareForm fields={["Type (Postgres/Snowflake/…)", "Host", "Schéma", "Tables (ou *)"]} cta="Déclarer la base" placeholder="base" />
      </Card>

      <Card>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, color: t.title }}>Documents de contexte</h2>
        <p style={{ margin: "0 0 12px", color: t.muted, fontSize: 13 }}>
          Le contexte métier (knowledge pack curé, politiques) enrichit les suggestions. Contenu
          traité comme <strong>donnée</strong>, jamais comme instruction (défense prompt-injection).
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, color: t.text, fontSize: 14, lineHeight: 1.8 }}>
          <li>{m.knowledge_pack_file} — <Chip label="curated" color={t.proposed} /></li>
          {documents.map((d) => (
            <li key={d.document_id}>
              {d.name} — <Chip label={d.doc_type} color={t.cta} />{" "}
              <span style={{ color: t.muted, fontSize: 12 }}>(persisté)</span>
            </li>
          ))}
        </ul>
        <p style={{ margin: "12px 0 4px", fontWeight: 700, color: t.title }}>Ajouter un document</p>
        <AddDocumentForm domainId={selected.domain_id} />
      </Card>
    </Shell>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", borderBottom: `2px solid ${t.border}`, padding: "6px 8px", fontSize: 13, color: t.muted }}>{children}</th>;
}
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ borderBottom: `1px solid ${t.border}`, padding: "6px 8px", fontSize: 14, ...style }}>{children}</td>;
}

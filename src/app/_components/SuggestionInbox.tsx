"use client";

import { useState } from "react";
import { t } from "@/app/_components/theme";

interface Suggestion {
  suggestion_id: string;
  type: string;
  asset: string;
  column: string;
  proposed_value: string;
  basis: string[];
  confidence: number;
  status: string;
  rationale: string;
  story: string;
}

interface ValidationImpact {
  approved: number;
  propagated_columns: number;
  knowledge_gain: { definitions: number; pii: number; rules: number; lineage: number };
  coverage_before: number;
  coverage_after: number;
  governance_before: number;
  governance_after: number;
}

interface ValidationResponse {
  impact: ValidationImpact;
  propagated: { asset: string; column: string }[];
  writeback_simulated: string[];
  error?: string;
}

const TYPE_COLOR: Record<string, string> = {
  DESCRIPTION: t.cta,
  PII_CLASSIFICATION: t.danger,
  DQ_RULE: t.warn,
  LINEAGE: t.proposed,
};

const pct = (r: number): string => `${Math.round(r * 100)}%`;

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ background: `${color}1a`, color, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export function SuggestionInbox({
  domainId,
  suggestions,
  storyLabels,
}: {
  domainId: string;
  suggestions: Suggestion[];
  storyLabels: Record<string, string>;
}) {
  const [approved, setApproved] = useState<Record<string, ValidationResponse>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const approve = async (id: string) => {
    setBusy(id);
    try {
      const res = await fetch(`/api/domain/${domainId}/validate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ suggestion_id: id }),
      });
      const data = (await res.json()) as ValidationResponse;
      if (!data.error) setApproved((prev) => ({ ...prev, [id]: data }));
    } finally {
      setBusy(null);
    }
  };

  const totals = Object.values(approved).reduce(
    (acc, r) => {
      acc.approved += 1;
      acc.propagated += r.impact.propagated_columns;
      acc.definitions += r.impact.knowledge_gain.definitions;
      acc.pii += r.impact.knowledge_gain.pii;
      acc.rules += r.impact.knowledge_gain.rules;
      acc.lineage += r.impact.knowledge_gain.lineage;
      acc.govAfter = Math.max(acc.govAfter, r.impact.governance_after);
      return acc;
    },
    { approved: 0, propagated: 0, definitions: 0, pii: 0, rules: 0, lineage: 0, govAfter: 0 },
  );

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "1.1rem 1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: 18, color: t.title }}>Suggestions de l’IA</h2>
        <Chip label={`${suggestions.length} PROPOSED`} color={t.proposed} />
      </div>

      {totals.approved > 0 ? (
        <div style={{ marginTop: 10, background: "#eefaf3", border: `1px solid ${t.ok}55`, borderRadius: 10, padding: "0.6rem 0.9rem" }}>
          <strong style={{ color: t.ok }}>Learning Impact</strong> · {totals.approved} validée(s) ·{" "}
          {totals.propagated} attributs enrichis · +{totals.definitions} définitions · +{totals.pii} PII ·
          +{totals.rules} règles · +{totals.lineage} lineage · Accountability → {pct(totals.govAfter)}{" "}
          <span style={{ background: t.proposed, color: "#fff", fontSize: 11, padding: "1px 6px", borderRadius: 4 }}>SIMULÉ</span>
        </div>
      ) : null}

      <p style={{ color: t.muted, fontSize: 13, margin: "10px 0 12px" }}>
        Approuver capitalise la connaissance et la propage aux attributs similaires (write-back simulé).
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {suggestions.slice(0, 8).map((s) => {
          const res = approved[s.suggestion_id];
          return (
            <li key={s.suggestion_id} style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.7rem 0.9rem", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={s.type.replace("_", " ")} color={TYPE_COLOR[s.type] ?? t.cta} />
                <Chip label={storyLabels[s.story] ?? s.story} color={t.muted} />
                <strong style={{ color: t.title }}>
                  {s.asset}.{s.column}
                </strong>
                <span style={{ marginLeft: "auto", color: t.ok, fontWeight: 700, fontSize: 13 }}>
                  Confiance {Math.round(s.confidence * 100)}%
                </span>
              </div>
              <div style={{ margin: "6px 0", color: t.text }}>{s.proposed_value}</div>
              <div style={{ color: t.muted, fontSize: 12 }}>
                PROPOSED · basis {s.basis.join(", ")}
              </div>

              {res ? (
                <div style={{ marginTop: 8, background: "#eefaf3", borderRadius: 8, padding: "0.5rem 0.7rem", fontSize: 13 }}>
                  <strong style={{ color: t.ok }}>Approved ✓</strong> · {res.impact.propagated_columns} attributs
                  similaires enrichis ({res.propagated.map((p) => `${p.asset}.${p.column}`).slice(0, 4).join(", ")}
                  {res.propagated.length > 4 ? "…" : ""}) · Accountability {pct(res.impact.governance_before)} →{" "}
                  <strong>{pct(res.impact.governance_after)}</strong>
                  <div style={{ color: t.muted, marginTop: 2 }}>
                    Mis à jour (simulé) : {res.writeback_simulated.join(" · ")}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={() => approve(s.suggestion_id)} disabled={busy === s.suggestion_id}
                    style={{ background: t.ok, color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    {busy === s.suggestion_id ? "…" : "Approve"}
                  </button>
                  <button style={{ background: "#fff", color: t.cta, border: `1px solid ${t.cta}`, padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Edit</button>
                  <button style={{ background: "#fff", color: t.danger, border: `1px solid ${t.danger}`, padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Reject</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

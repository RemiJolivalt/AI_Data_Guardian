"use client";

import { useEffect, useState } from "react";
import { t } from "@/app/_components/theme";
import type { DecisionStatus, GuardianRecommendation } from "@/core/data-map/types";

interface ExpertDecision {
  recommendationId: string;
  sourceObjectId: string;
  targetObjectId: string;
  targetTableId?: string;
  controlLabel: string;
  parameter?: string;
  similarityReason: string;
  expectedBusinessImpact: string;
  confidence: number;
  status: DecisionStatus;
  expertComment?: string;
  decidedAt: string;
}

const statusColor = (s: DecisionStatus): string =>
  s === "Capitalisé" ? t.ok : s === "Rejeté" ? t.danger : t.warn;

function toRecommendation(d: ExpertDecision): GuardianRecommendation {
  return {
    id: d.recommendationId,
    sourceObjectId: d.sourceObjectId,
    targetObjectId: d.targetObjectId,
    targetTableId: d.targetTableId,
    controlLabel: d.controlLabel,
    similarityReason: d.similarityReason,
    expectedBusinessImpact: d.expectedBusinessImpact,
    confidence: d.confidence,
    status: d.status,
  };
}

export function ExpertDecisionQueue() {
  const [decisions, setDecisions] = useState<ExpertDecision[]>([]);
  const [capitalizedCount, setCapitalizedCount] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<ExpertDecision | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editParam, setEditParam] = useState("");
  const [editComment, setEditComment] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    fetch("/api/map/decisions")
      .then((r) => r.json())
      .then((data) => {
        setDecisions(data.decisions ?? []);
        setCapitalizedCount(data.capitalizedCount ?? 0);
      })
      .catch(() => undefined);
  }

  useEffect(load, []);

  async function decide(
    d: ExpertDecision,
    status: DecisionStatus,
    overrides?: { controlLabel?: string; parameter?: string; expertComment?: string },
  ) {
    setBusy(true);
    try {
      const res = await fetch("/api/map/decisions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          recommendation: toRecommendation(d),
          status,
          decidedAt: new Date().toISOString(),
          ...overrides,
        }),
      });
      const data = await res.json();
      setDecisions(data.decisions ?? []);
      setCapitalizedCount(data.capitalizedCount ?? 0);
      if (status === "Capitalisé") {
        setMessage("La décision experte enrichit maintenant la connaissance réutilisable d’AI Data Guardian.");
      } else if (status === "Rejeté") {
        setMessage("Recommandation rejetée. Elle n’est pas ajoutée aux connaissances réutilisables.");
      }
    } finally {
      setBusy(false);
    }
  }

  function openEdit(d: ExpertDecision) {
    setEditing(d);
    setEditLabel(d.controlLabel);
    setEditParam(d.parameter ?? "");
    setEditComment(d.expertComment ?? "");
  }

  async function confirmEdit() {
    if (!editing) return;
    await decide(editing, "Capitalisé", {
      controlLabel: editLabel,
      parameter: editParam || undefined,
      expertComment: editComment || undefined,
    });
    setEditing(null);
  }

  const pending = decisions.filter((d) => d.status === "À valider");
  const resolved = decisions.filter((d) => d.status !== "À valider");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: "0.8rem 1.1rem",
          }}
        >
          <span style={{ color: t.muted, fontSize: 13 }}>Décisions capitalisées</span>
          <div style={{ fontSize: 30, fontWeight: 800, color: t.ok }}>{capitalizedCount}</div>
        </div>
        <p style={{ color: t.muted, fontSize: 13, margin: 0 }}>Chaque décision experte renforce les prochaines recommandations.</p>
      </div>

      {message ? (
        <div
          role="status"
          style={{
            background: `${t.ok}14`,
            border: `1px solid ${t.ok}`,
            color: t.title,
            borderRadius: 10,
            padding: "0.7rem 1rem",
          }}
        >
          {message}
        </div>
      ) : null}

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "1.1rem 1.25rem" }}>
        <div style={{ fontWeight: 800, color: t.title, marginBottom: 10 }}>
          Recommandations en attente ({pending.length})
        </div>
        {pending.length === 0 ? (
          <p style={{ color: t.muted, margin: 0 }}>
            Aucune recommandation en attente. Lancez une analyse Guardian puis « Soumettre aux experts ».
          </p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {pending.map((d) => (
              <div key={d.recommendationId} style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.9rem 1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ fontWeight: 700, color: t.title }}>{d.controlLabel}</span>
                  <span style={{ fontSize: 12, color: t.proposed, fontWeight: 700 }}>
                    Confiance {Math.round(d.confidence * 100)}%
                  </span>
                </div>
                <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>
                  Source : <b style={{ color: t.text }}>{d.sourceObjectId}</b> · Cible :{" "}
                  <b style={{ color: t.text }}>{d.targetObjectId}</b>
                  {d.targetTableId ? ` · ${d.targetTableId}` : ""}
                </div>
                <div style={{ fontSize: 13, color: t.text, marginTop: 6 }}>
                  <span style={{ color: t.muted }}>Justification IA : </span>
                  {d.similarityReason}
                </div>
                <div style={{ fontSize: 13, color: t.text, marginTop: 4 }}>
                  <span style={{ color: t.muted }}>Impact : </span>
                  {d.expectedBusinessImpact}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => decide(d, "Capitalisé")} disabled={busy} style={btn(t.ok)}>
                    Valider
                  </button>
                  <button onClick={() => openEdit(d)} disabled={busy} style={btn(t.cta)}>
                    Modifier
                  </button>
                  <button onClick={() => decide(d, "Rejeté")} disabled={busy} style={btn(t.danger)}>
                    Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {resolved.length > 0 ? (
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "1.1rem 1.25rem" }}>
          <div style={{ fontWeight: 800, color: t.title, marginBottom: 10 }}>Historique des décisions</div>
          <div style={{ display: "grid", gap: 8 }}>
            {resolved.map((d) => (
              <div key={d.recommendationId} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span style={{ color: t.text }}>{d.controlLabel}</span>
                <span style={{ color: statusColor(d.status), fontWeight: 700, fontSize: 13 }}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {editing ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Modifier la recommandation"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11,30,66,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem", width: 480, maxWidth: "100%" }}>
            <div style={{ fontWeight: 800, color: t.title, marginBottom: 12 }}>Modifier la recommandation</div>
            <Field label="Libellé du contrôle">
              <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} style={input} />
            </Field>
            <Field label="Seuil ou paramètre principal">
              <input value={editParam} onChange={(e) => setEditParam(e.target.value)} style={input} />
            </Field>
            <Field label="Commentaire expert">
              <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} rows={3} style={input} />
            </Field>
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button onClick={() => setEditing(null)} style={btn(t.muted)}>
                Annuler
              </button>
              <button onClick={confirmEdit} disabled={busy || !editLabel.trim()} style={btn(t.ok)}>
                Valider les modifications
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function btn(color: string): React.CSSProperties {
  return {
    padding: "0.5rem 0.9rem",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: color,
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
  };
}

const input: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.6rem",
  borderRadius: 8,
  border: `1px solid ${t.border}`,
  fontFamily: "inherit",
  fontSize: 14,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <span style={{ display: "block", color: t.muted, fontSize: 13, marginBottom: 4 }}>{label}</span>
      {children}
    </label>
  );
}

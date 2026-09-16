"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { t } from "@/app/_components/theme";
import type { GuardianAnalysis as Analysis, GuardianRecommendation, TrustLevel } from "@/core/data-map/types";

const PROGRESS_STEPS = [
  "Lecture des contrôles et règles existants",
  "Analyse du contexte métier et des métadonnées",
  "Recherche d’objets similaires",
  "Préparation des recommandations",
];

const STEP_MS = 550;

const levelColor = (level: TrustLevel): string =>
  level === "Élevée" ? t.danger : level === "Modérée" ? t.warn : t.ok;

type Phase = "idle" | "running" | "done";

export function GuardianAnalysis({ objectId }: { objectId: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function readPerimeter(): string[] {
    try {
      const raw = window.localStorage.getItem("adg_perimeter");
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { objectId?: string; includedTableIds?: string[] };
      return parsed.objectId === objectId && Array.isArray(parsed.includedTableIds)
        ? parsed.includedTableIds
        : [];
    } catch {
      return [];
    }
  }

  function run() {
    setPhase("running");
    setStep(0);
    setError(null);
    const includedTableIds = readPerimeter();
    PROGRESS_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i + 1), STEP_MS * (i + 1)));
    });
    timers.current.push(
      setTimeout(
        () => {
          fetch("/api/map/analyze", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ objectId, includedTableIds }),
          })
            .then((r) => r.json())
            .then((data) => {
              if (data.analysis) {
                setAnalysis(data.analysis as Analysis);
                setPhase("done");
              } else {
                setError(data.error ?? "Analyse impossible");
                setPhase("idle");
              }
            })
            .catch(() => {
              setError("Analyse impossible");
              setPhase("idle");
            });
        },
        STEP_MS * (PROGRESS_STEPS.length + 1),
      ),
    );
  }

  async function submitToExperts() {
    if (!analysis || analysis.recommendations.length === 0) return;
    setSubmitting(true);
    const decidedAt = new Date().toISOString();
    try {
      for (const rec of analysis.recommendations) {
        await fetch("/api/map/decisions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ recommendation: rec, status: "À valider", decidedAt }),
        });
      }
      router.push("/expert-decisions" as Route);
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === "running") {
    return (
      <div style={{ maxWidth: 560 }}>
        <p style={{ color: t.muted, marginBottom: 16 }}>Analyse Guardian en cours…</p>
        {PROGRESS_STEPS.map((label, i) => {
          const state = i < step ? "done" : i === step ? "active" : "todo";
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0.6rem 0",
                color: state === "todo" ? t.muted : t.text,
              }}
            >
              <span style={{ color: state === "done" ? t.ok : t.cta }}>
                {state === "done" ? "✓" : state === "active" ? "◐" : "○"}
              </span>
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  if (phase === "idle" || !analysis) {
    return (
      <div style={{ maxWidth: 620 }}>
        {error ? <p style={{ color: t.danger }}>{error}</p> : null}
        <div
          style={{
            background: t.card,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: "1.25rem",
          }}
        >
          <div style={{ color: t.muted, fontSize: 13 }}>Périmètre sélectionné</div>
          <div style={{ fontWeight: 800, color: t.title, fontSize: 20, margin: "4px 0 12px" }}>{objectId}</div>
          <p style={{ color: t.muted, fontSize: 14, margin: "0 0 16px" }}>
            Guardian va lire les contrôles existants, comprendre le contexte métier, rechercher des objets
            similaires et proposer des extensions à valider.
          </p>
          <button
            onClick={run}
            style={{
              padding: "0.8rem 1.2rem",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(90deg, ${t.cta}, #3a6ef0)`,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ⚡ Lancer l’analyse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Block title="A. Pourquoi ce périmètre est à risque">
        <p style={{ margin: 0, color: t.text }}>{analysis.riskExplanation}</p>
      </Block>

      <Block title="B. Exposition métier">
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: t.muted, fontSize: 13 }}>Niveau d’exposition : </span>
          <span style={{ color: levelColor(analysis.exposure.level), fontWeight: 800 }}>
            {analysis.exposure.level}
          </span>
        </div>
        <ExposureRow label="Décisions / KPI" items={analysis.exposure.decisions} />
        <ExposureRow label="Processus métier" items={analysis.exposure.processes} />
        <div style={{ color: t.text, marginTop: 6 }}>
          <span style={{ color: t.muted, fontSize: 13 }}>Conformité / usage IA : </span>
          {analysis.exposure.compliance}
        </div>
      </Block>

      <Block title="C. Expertise existante comprise">
        {analysis.reusableExpertise.length === 0 ? (
          <p style={{ margin: 0, color: t.muted }}>Aucune expertise réutilisable détectée pour ce périmètre.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {analysis.reusableExpertise.map((e, i) => (
              <div key={`${e.label}-${i}`} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <span style={{ color: t.text }}>
                  {e.type === "expert_decision" ? "★ " : "• "}
                  {e.label}
                </span>
                <span style={{ color: t.muted, fontSize: 12 }}>{e.source}</span>
              </div>
            ))}
          </div>
        )}
      </Block>

      <Block title="D. Extension recommandée">
        <div style={{ display: "grid", gap: 10 }}>
          {analysis.recommendations.length === 0 ? (
            <p style={{ margin: 0, color: t.muted }}>
              Toutes les recommandations de ce périmètre ont déjà été traitées par les experts.
            </p>
          ) : (
            analysis.recommendations.map((rec) => <RecCard key={rec.id} rec={rec} />)
          )}
        </div>
      </Block>

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={submitToExperts}
          disabled={submitting || analysis.recommendations.length === 0}
          style={{
            padding: "0.8rem 1.2rem",
            borderRadius: 10,
            border: "none",
            cursor: analysis.recommendations.length === 0 ? "not-allowed" : "pointer",
            opacity: analysis.recommendations.length === 0 ? 0.5 : 1,
            background: `linear-gradient(90deg, ${t.cta}, #3a6ef0)`,
            color: "#fff",
            fontWeight: 700,
          }}
        >
          {submitting ? "Envoi…" : "Soumettre aux experts →"}
        </button>
        <button
          onClick={() => router.push("/map" as Route)}
          style={{
            padding: "0.8rem 1.2rem",
            borderRadius: 10,
            border: `1px solid ${t.border}`,
            cursor: "pointer",
            background: "#fff",
            color: t.cta,
            fontWeight: 700,
          }}
        >
          Modifier le périmètre
        </button>
      </div>

      <p style={{ color: t.muted, fontSize: 13, margin: 0 }}>
        Guardian a identifié des contrôles déjà éprouvés qui peuvent être étendus à des objets similaires avec
        validation humaine.
      </p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "1.1rem 1.25rem" }}>
      <div style={{ fontWeight: 800, color: t.title, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function ExposureRow({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div style={{ color: t.text, marginBottom: 4 }}>
      <span style={{ color: t.muted, fontSize: 13 }}>{label} : </span>
      {items.join(" · ")}
    </div>
  );
}

function RecCard({ rec }: { rec: GuardianRecommendation }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "0.9rem 1rem", background: "#fafbfe" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 700, color: t.title }}>{rec.controlLabel}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: t.warn,
            background: `${t.warn}1a`,
            padding: "2px 8px",
            borderRadius: 999,
          }}
        >
          {rec.status}
        </span>
      </div>
      <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>
        Cible : <b style={{ color: t.text }}>{rec.targetObjectId}</b>
        {rec.targetTableId ? ` · ${rec.targetTableId}` : ""}
      </div>
      <div style={{ fontSize: 13, color: t.text, marginTop: 6 }}>
        <span style={{ color: t.muted }}>Similarité : </span>
        {rec.similarityReason}
      </div>
      <div style={{ fontSize: 13, color: t.text, marginTop: 4 }}>
        <span style={{ color: t.muted }}>Impact : </span>
        {rec.expectedBusinessImpact}
      </div>
      <div style={{ fontSize: 12, color: t.proposed, marginTop: 6, fontWeight: 700 }}>
        Confiance {Math.round(rec.confidence * 100)}%
      </div>
    </div>
  );
}

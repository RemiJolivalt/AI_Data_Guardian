"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { t } from "@/app/_components/theme";
import type { EnterpriseDataMap, TrustLevel } from "@/core/data-map/types";

const levelColor = (level: TrustLevel): string =>
  level === "Élevée" ? t.ok : level === "Modérée" ? t.warn : t.danger;

const scoreColor = (score: number): string => (score >= 75 ? t.ok : score >= 60 ? t.warn : t.danger);

export function MapExplorer({ initialDomainId }: { initialDomainId?: string }) {
  const router = useRouter();
  const [map, setMap] = useState<EnterpriseDataMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [domainId, setDomainId] = useState<string | undefined>(initialDomainId);
  const [objectId, setObjectId] = useState<string | undefined>(undefined);
  const [included, setIncluded] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    fetch("/api/map")
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        if (data.map) setMap(data.map as EnterpriseDataMap);
        else setError(data.error ?? "Chargement impossible");
      })
      .catch(() => active && setError("Chargement impossible"));
    return () => {
      active = false;
    };
  }, []);

  const objects = useMemo(
    () => (map && domainId ? map.businessObjects.filter((o) => o.domainId === domainId) : []),
    [map, domainId],
  );
  const selectedObject = useMemo(
    () => map?.businessObjects.find((o) => o.id === objectId) ?? null,
    [map, objectId],
  );
  const tables = useMemo(() => {
    if (!map || !selectedObject) return [];
    const byId = new Map(map.dataTables.map((tbl) => [tbl.id, tbl] as const));
    return selectedObject.tableIds.map((id) => byId.get(id)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [map, selectedObject]);

  function selectObject(id: string) {
    setObjectId(id);
    const obj = map?.businessObjects.find((o) => o.id === id);
    setIncluded(new Set(obj?.tableIds ?? []));
  }

  function toggleTable(id: string) {
    setIncluded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function analyze() {
    if (!objectId) return;
    const perimeter = { objectId, includedTableIds: [...included] };
    try {
      window.localStorage.setItem("adg_perimeter", JSON.stringify(perimeter));
    } catch {
      /* localStorage optional */
    }
    router.push(`/analysis?object=${encodeURIComponent(objectId)}` as Route);
  }

  if (error) return <div style={{ color: t.danger }}>{error}</div>;
  if (!map) return <div style={{ color: t.muted }}>Chargement de la carte…</div>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
      <div>
        <div style={{ color: t.muted, fontSize: 13, marginBottom: 8, fontWeight: 700 }}>1. Domaine métier</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
          {map.domains.map((d) => {
            const on = d.id === domainId;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setDomainId(d.id);
                  setObjectId(undefined);
                }}
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "0.7rem 0.9rem",
                  minWidth: 150,
                  borderRadius: 10,
                  border: on ? `2px solid ${t.cta}` : `1px solid ${t.border}`,
                  background: on ? "#eef3ff" : t.card,
                  color: t.text,
                }}
              >
                <div style={{ fontWeight: 700, color: t.title }}>{d.name}</div>
                <div style={{ fontSize: 12, color: t.muted }}>
                  Confiance <span style={{ color: scoreColor(d.trustScore), fontWeight: 700 }}>{d.trustScore}</span> ·{" "}
                  {d.criticalObjects} objet(s) critique(s)
                </div>
              </button>
            );
          })}
        </div>

        {domainId ? (
          <>
            <div style={{ color: t.muted, fontSize: 13, marginBottom: 8, fontWeight: 700 }}>2. Objet métier</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {objects.map((o) => {
                const on = o.id === objectId;
                return (
                  <button
                    key={o.id}
                    onClick={() => selectObject(o.id)}
                    style={{
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "0.8rem 1rem",
                      borderRadius: 10,
                      border: on ? `2px solid ${t.cta}` : `1px solid ${t.border}`,
                      background: t.card,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: t.title }}>{o.name}</span>
                      <span style={{ color: scoreColor(o.trustScore), fontWeight: 800 }}>{o.trustScore}</span>
                    </div>
                    <div style={{ fontSize: 12, color: t.muted, marginTop: 2 }}>
                      Criticité{" "}
                      <span style={{ color: levelColor(o.businessCriticality), fontWeight: 700 }}>
                        {o.businessCriticality}
                      </span>{" "}
                      · {o.existingControls} contrôle(s) existant(s) · {o.recommendedControls} recommandé(s)
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <p style={{ color: t.muted }}>Sélectionnez un domaine pour afficher ses objets métier.</p>
        )}
      </div>

      <div
        style={{
          background: t.card,
          border: `1px solid ${t.border}`,
          borderRadius: 12,
          padding: "1.1rem 1.25rem",
          alignSelf: "start",
        }}
      >
        <div style={{ color: t.muted, fontSize: 13, marginBottom: 8, fontWeight: 700 }}>3. Périmètre Guardian</div>
        {selectedObject ? (
          <>
            <div style={{ fontWeight: 800, color: t.title, fontSize: 18 }}>{selectedObject.name}</div>
            <p style={{ color: t.muted, fontSize: 13, margin: "4px 0 12px" }}>{selectedObject.description}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tables.map((tbl) => {
                const on = included.has(tbl.id);
                return (
                  <label
                    key={tbl.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "0.5rem 0.6rem",
                      borderRadius: 8,
                      border: `1px solid ${t.border}`,
                      background: on ? "#f5f8ff" : "#fafbfe",
                    }}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggleTable(tbl.id)} />
                    <span style={{ fontFamily: "monospace", color: t.text, flex: 1 }}>{tbl.name}</span>
                    <span style={{ fontSize: 11, color: levelColor(tbl.qualityStatus), fontWeight: 700 }}>
                      {tbl.qualityStatus}
                    </span>
                    <span style={{ fontSize: 11, color: t.muted }}>gouv. {tbl.governanceCoverage}%</span>
                  </label>
                );
              })}
            </div>
            <button
              onClick={analyze}
              disabled={included.size === 0}
              style={{
                marginTop: 14,
                width: "100%",
                padding: "0.8rem",
                borderRadius: 10,
                border: "none",
                cursor: included.size === 0 ? "not-allowed" : "pointer",
                opacity: included.size === 0 ? 0.5 : 1,
                background: `linear-gradient(90deg, ${t.cta}, #3a6ef0)`,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Analyser ce périmètre →
            </button>
            <p style={{ color: t.muted, fontSize: 12, marginTop: 8 }}>
              {included.size} table(s) incluse(s). Décochez pour retirer une table du périmètre.
            </p>
          </>
        ) : (
          <p style={{ color: t.muted }}>Sélectionnez un objet métier pilote pour définir le périmètre.</p>
        )}
      </div>
    </div>
  );
}

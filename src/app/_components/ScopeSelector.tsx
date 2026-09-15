"use client";

import { useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { t } from "@/app/_components/theme";

interface AssetRow {
  asset: string;
  file: string;
  role: string;
}

/** Lets an admin choose which tables of a domain are placed under supervision, then re-scopes. */
export function ScopeSelector({ domainId, assets }: { domainId: string; assets: AssetRow[] }) {
  const router = useRouter();
  const [checked, setChecked] = useState<Set<string>>(new Set(assets.map((a) => a.asset)));

  const toggle = (asset: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(asset)) next.delete(asset);
      else next.add(asset);
      return next;
    });
  };

  const apply = () => {
    const selected = assets.map((a) => a.asset).filter((a) => checked.has(a));
    const all = selected.length === assets.length;
    const url = all ? `/domain/${domainId}` : `/domain/${domainId}?assets=${selected.join(",")}`;
    router.push(url as Route);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={() => setChecked(new Set(assets.map((a) => a.asset)))} style={ghost}>Tout</button>
        <button onClick={() => setChecked(new Set())} style={ghost}>Aucun</button>
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <Th>Sous supervision</Th>
            <Th>Table</Th>
            <Th>Source</Th>
            <Th>Rôle</Th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.asset}>
              <Td>
                <input type="checkbox" checked={checked.has(a.asset)} onChange={() => toggle(a.asset)} />
              </Td>
              <Td><strong>{a.asset}</strong></Td>
              <Td style={{ color: t.muted }}>{a.file}</Td>
              <Td>{a.role}</Td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={apply} disabled={checked.size === 0} style={{ marginTop: 12, background: t.cta, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
        Superviser {checked.size} table(s) →
      </button>
    </div>
  );
}

const ghost: React.CSSProperties = { background: "#fff", color: t.cta, border: `1px solid ${t.cta}`, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" };

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", borderBottom: `2px solid ${t.border}`, padding: "6px 8px", fontSize: 13, color: t.muted }}>{children}</th>;
}
function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ borderBottom: `1px solid ${t.border}`, padding: "6px 8px", fontSize: 14, ...style }}>{children}</td>;
}

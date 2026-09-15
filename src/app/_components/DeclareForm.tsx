"use client";

import { useState } from "react";
import { t } from "@/app/_components/theme";

/**
 * Declarative action (connect a real tool / add a context document). In the MVP this records the
 * intent locally and is clearly labelled SIMULATED — it never performs a real external connection.
 */
export function DeclareForm({
  placeholder,
  cta,
  fields,
}: {
  placeholder: string;
  cta: string;
  fields: string[];
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [declared, setDeclared] = useState<string | null>(null);

  const submit = () => {
    const summary = fields.map((f) => values[f]).filter(Boolean).join(" · ");
    setDeclared(summary || placeholder);
  };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {fields.map((f) => (
          <input
            key={f}
            placeholder={f}
            value={values[f] ?? ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [f]: e.target.value }))}
            style={{ border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 13, minWidth: 150 }}
          />
        ))}
        <button onClick={submit} style={{ background: t.title, color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {cta}
        </button>
      </div>
      {declared ? (
        <p style={{ marginTop: 8, color: t.ok, fontSize: 13 }}>
          ✓ Déclaré : {declared}{" "}
          <span style={{ background: t.proposed, color: "#fff", fontSize: 11, padding: "1px 6px", borderRadius: 4 }}>SIMULÉ</span>
          <span style={{ color: t.muted }}> — connecteur réel : roadmap</span>
        </p>
      ) : null}
    </div>
  );
}

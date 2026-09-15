"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/app/_components/theme";

/** Ingests a context document (text) as DATA. Persisted; content is never treated as instruction. */
export function AddDocumentForm({ domainId }: { domainId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [docType, setDocType] = useState("policy");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const submit = async () => {
    if (!name) return;
    setBusy(true);
    try {
      const res = await fetch("/api/settings/document", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain: domainId, name, doc_type: docType, text }),
      });
      if (res.ok) {
        setDone(name);
        setName("");
        setText("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input placeholder="Nom du document" value={name} onChange={(e) => setName(e.target.value)}
          style={inp} />
        <input placeholder="Type (policy/glossary/…)" value={docType} onChange={(e) => setDocType(e.target.value)}
          style={inp} />
      </div>
      <textarea placeholder="Contenu (texte) — traité comme donnée, jamais comme instruction"
        value={text} onChange={(e) => setText(e.target.value)}
        style={{ ...inp, width: "100%", minHeight: 60, marginTop: 8 }} />
      <button onClick={submit} disabled={busy || !name}
        style={{ marginTop: 8, background: t.title, color: "#fff", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        {busy ? "…" : "Ajouter au contexte"}
      </button>
      {done ? <p style={{ marginTop: 8, color: t.ok, fontSize: 13 }}>✓ « {done} » ajouté au contexte (persisté).</p> : null}
    </div>
  );
}

const inp: React.CSSProperties = { border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 10px", fontSize: 13, minWidth: 180 };

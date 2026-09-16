"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/app/_components/theme";

function readMode(): "demo" | "full" {
  if (typeof document === "undefined") return "demo";
  const c = document.cookie.split("; ").find((x) => x.startsWith("adg_mode="));
  return c?.split("=")[1] === "full" ? "full" : "demo";
}

/** Switches the sidebar between the clean executive demo and the full product view. */
export function ModeToggle() {
  const router = useRouter();
  const [mode, setMode] = useState<"demo" | "full">(readMode());

  const set = (m: "demo" | "full") => {
    document.cookie = `adg_mode=${m}; path=/; max-age=31536000`;
    setMode(m);
    router.refresh();
  };

  const btn = (m: "demo" | "full", label: string) => (
    <button
      onClick={() => set(m)}
      style={{
        flex: 1,
        background: mode === m ? t.accent : "transparent",
        color: mode === m ? "#0b1e42" : "#c9d4ea",
        border: `1px solid ${t.accent}55`,
        borderRadius: 6,
        padding: "4px 0",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: "0 1.25rem", marginTop: 10 }}>
      <div style={{ color: "#7f92bd", fontSize: 10, marginBottom: 4, letterSpacing: 1 }}>MODE</div>
      <div style={{ display: "flex", gap: 6 }}>
        {btn("demo", "Démo")}
        {btn("full", "Complet")}
      </div>
    </div>
  );
}

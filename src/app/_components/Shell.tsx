import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { t } from "@/app/_components/theme";
import { listDomains } from "@/core/domain-pack/registry";

type NavItem = { key: string; label: string; href: Route };

const BASE_TOP: NavItem[] = [
  { key: "home", label: "Accueil", href: "/" as Route },
  { key: "exec", label: "Vue exécutive", href: "/cockpit" as Route },
];
const BASE_BOTTOM: NavItem[] = [
  { key: "settings", label: "Paramètres", href: "/settings" as Route },
  { key: "runs", label: "Runs", href: "/runs" as Route },
];

function domainNavItems(): NavItem[] {
  try {
    return listDomains(process.cwd()).map((d) => ({
      key: `domain:${d.domain_id}`,
      label: `${d.manifest.label} Trust`,
      href: `/domain/${d.domain_id}` as Route,
    }));
  } catch {
    return [];
  }
}

/** Application shell (navy sidebar + header) matching the hi-fi mockups. */
export function Shell({
  active,
  title,
  subtitle,
  scope,
  children,
}: {
  active: string;
  title: string;
  subtitle: string;
  scope?: string;
  children: ReactNode;
}) {
  const NAV: NavItem[] = [...BASE_TOP, ...domainNavItems(), ...BASE_BOTTOM];
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.contentBg, color: t.text }}>
      <aside
        style={{
          width: 220,
          background: t.sidebarBg,
          color: "#c9d4ea",
          display: "flex",
          flexDirection: "column",
          padding: "1.25rem 0",
        }}
      >
        <div style={{ padding: "0 1.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
          <span style={{ color: t.accent }}>◈</span> AI DATA
          <br />
          GUARDIAN
        </div>
        <nav style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                style={{
                  padding: "0.7rem 1.25rem",
                  color: isActive ? "#fff" : "#c9d4ea",
                  background: isActive ? t.sidebarActive : "transparent",
                  borderLeft: isActive ? `3px solid ${t.accent}` : "3px solid transparent",
                  textDecoration: "none",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", padding: "0 1.25rem", fontSize: 12 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#0f2a55",
              color: t.accent,
              padding: "4px 10px",
              borderRadius: 999,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 999, background: t.accent }} /> LIVE
          </span>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${t.accent}, ${t.cta})` }} />
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "1.5rem 2rem 0.5rem",
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: t.title, fontSize: 26 }}>{title}</h1>
            <p style={{ margin: "4px 0 0", color: t.muted, fontSize: 14 }}>{subtitle}</p>
          </div>
          {scope ? (
            <span
              style={{
                background: "#e4ecff",
                color: t.cta,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              PÉRIMÈTRE {scope}
            </span>
          ) : null}
        </header>
        <main style={{ padding: "1rem 2rem 2rem" }}>{children}</main>
      </div>
    </div>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
        padding: "1.1rem 1.25rem",
        boxShadow: "0 1px 2px rgba(16,32,64,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Stat({ label, value, sub, subColor }: { label: string; value: string; sub?: string; subColor?: string }) {
  return (
    <Card>
      <div style={{ color: t.muted, fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: t.title, marginTop: 4 }}>{value}</div>
      {sub ? <div style={{ fontSize: 13, color: subColor ?? t.muted, marginTop: 2 }}>{sub}</div> : null}
    </Card>
  );
}

export function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        background: `${color}1a`,
        color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

/** Non-color-only legend required by the cahier (§8.2, §10.6): fact vs assumption vs simulation. */
export function Legend() {
  const item = (glyph: string, label: string, color: string) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: t.muted, fontSize: 12 }}>
      <span style={{ color }}>{glyph}</span> {label}
    </span>
  );
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 12 }}>
      {item("\u25CF", "Fait (evidence)", t.ok)}
      {item("\u25C6", "Hypothèse", t.warn)}
      {item("\u25B2", "Simulé", t.proposed)}
    </div>
  );
}

export function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        background: color,
        color: "#fff",
        fontSize: 11,
        fontWeight: 700,
        padding: "1px 7px",
        borderRadius: 4,
        marginLeft: 6,
      }}
    >
      {label}
    </span>
  );
}

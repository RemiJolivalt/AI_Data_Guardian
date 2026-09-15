// Design tokens aligned with the hi-fi mockups (dark navy sidebar, teal accent, light content).
export const t = {
  sidebarBg: "#0b1e42",
  sidebarActive: "#12305f",
  accent: "#2fe0c4",
  cta: "#1a4fd6",
  contentBg: "#eef1f6",
  card: "#ffffff",
  border: "#e6e9f0",
  title: "#16233f",
  text: "#1f2a44",
  muted: "#6b7890",
  danger: "#e2483d",
  warn: "#f0a020",
  ok: "#1faf6a",
  proposed: "#6b5ce7",
} as const;

export const severityColor = (level: string): string => {
  switch (level.toUpperCase()) {
    case "CRITICAL":
    case "HIGH":
      return t.danger;
    case "MEDIUM":
    case "ELEVE":
      return t.warn;
    default:
      return t.ok;
  }
};

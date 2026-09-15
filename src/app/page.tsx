import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 720 }}>
      <h1>AI Data Guardian</h1>
      <p>
        An AI Trust Platform. It answers, in order: can I trust this data for this use? What is the
        business risk if I use it anyway? Which actions give the most trust for the least effort?
      </p>
      <p>
        <Link
          href="/cockpit"
          style={{
            display: "inline-block",
            background: "#1a4fd6",
            color: "#fff",
            padding: "0.6rem 1.1rem",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Open the Executive Cockpit →
        </Link>
      </p>
      <p>
        <Link
          href="/customer"
          style={{
            display: "inline-block",
            background: "#0b1e42",
            color: "#fff",
            padding: "0.6rem 1.1rem",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Open the Customer Trust Assessment →
        </Link>
      </p>
      <p style={{ color: "#666" }}>
        Scenario: Revenue Forecasting Agent (synthetic). Deterministic assessment pipeline live.
      </p>
    </main>
  );
}

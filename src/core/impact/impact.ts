import { ImpactScenario } from "@/core/domain";
import type { CsvTable } from "@/core/ingestion/csv";

/**
 * Business exposure of duplicate bookings (cahier §6, US-050/051). Deterministic base value
 * (double-counted euros), presented as LOW/CENTRAL/HIGH scenarios with explicit assumptions.
 * Always SIMULATED — never a certified accounting figure (§3.2).
 */

const SCENARIO_FACTORS: { label: "LOW" | "CENTRAL" | "HIGH"; factor: number; assumption: string }[] = [
  {
    label: "LOW",
    factor: 0.5,
    assumption: "Assumes ~50% of duplicate bookings are genuine double-counts.",
  },
  {
    label: "CENTRAL",
    factor: 1.0,
    assumption: "Assumes every detected duplicate booking is a genuine double-count.",
  },
  {
    label: "HIGH",
    factor: 1.5,
    assumption: "Adds ~50% for customer-level duplication not visible at booking level.",
  },
];

/** Euros double-counted by transactions sharing customer_id + amount + booking date. */
export function duplicateBookingEur(transactions: CsvTable): number {
  const seen = new Set<string>();
  let total = 0;
  for (const r of transactions.rows) {
    const key = `${r["customer_id"] ?? ""}|${r["amount_eur"] ?? ""}|${r["booked_at"] ?? ""}`;
    if (seen.has(key)) {
      total += Number(r["amount_eur"] ?? "0") || 0;
    } else {
      seen.add(key);
    }
  }
  return total;
}

export function computeImpactScenarios(
  assessmentId: string,
  transactions: CsvTable,
): ImpactScenario[] {
  const base = duplicateBookingEur(transactions);
  return SCENARIO_FACTORS.map(({ label, factor, assumption }) =>
    ImpactScenario.parse({
      scenario_id: `IMP-${assessmentId}-${label}`,
      assessment_id: assessmentId,
      label,
      assumptions: [
        assumption,
        `Base = ${base} EUR double-counted, detected deterministically from transactions.`,
      ],
      estimated_value: Math.round(base * factor * 100) / 100,
      unit: "EUR",
      simulated: true,
    }),
  );
}

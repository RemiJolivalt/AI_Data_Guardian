import { Evidence, Finding, type FindingCategory, type Severity } from "@/core/domain";
import { sha256 } from "@/core/ingestion/hash";
import type { CsvTable } from "@/core/ingestion/csv";
import { detectDuplicates, newestAgeDays } from "@/core/profiling/profile";

/**
 * Deterministic rule evaluation for the Revenue Forecasting scenario (cahier §4, §14).
 * Each finding is created only when an explicit threshold is met (US-012) and cites evidence.
 * No LLM involvement.
 */

export interface CatalogDataset {
  name: string;
  owner: string | null;
  steward: string | null;
  classification: string | null;
  description: string | null;
  freshness_rule: string | null;
}

export interface Catalog {
  catalog_version: string;
  datasets: CatalogDataset[];
}

export interface ScenarioInputs {
  assessmentId: string;
  customers: CsvTable;
  transactions: CsvTable;
  catalog: Catalog;
  kpi: { id: string; owner: string | null; definitionDiverges: boolean };
  now: Date;
}

export interface Evaluation {
  evidence: Evidence[];
  findings: Finding[];
  evaluatedDimensions: FindingCategory[];
}

/** Parses "max_age_days: 2" -> 2. Returns null if absent/unparseable. */
export function parseFreshnessSlaDays(rule: string | null): number | null {
  if (!rule) return null;
  const match = /max_age_days\s*:\s*(\d+)/.exec(rule);
  return match ? Number(match[1]) : null;
}

export function evaluateRevenueScenario(input: ScenarioInputs): Evaluation {
  const evidence: Evidence[] = [];
  const findings: Finding[] = [];
  const now = input.now.toISOString();
  let e = 0;
  let f = 0;

  const addEvidence = (
    sourceId: string,
    sourceLocation: string,
    method: string,
    observed: number | string | boolean,
    unit: string | null,
  ): string => {
    e += 1;
    const id = `EVD-${String(e).padStart(3, "0")}`;
    evidence.push(
      Evidence.parse({
        evidence_id: id,
        source_id: sourceId,
        source_location: sourceLocation,
        method,
        observed_value: observed,
        unit,
        is_synthetic: true,
        hash: sha256(`${method}:${observed}`),
        generated_at: now,
      }),
    );
    return id;
  };

  const addFinding = (
    category: FindingCategory,
    severity: Severity,
    title: string,
    consequence: string,
    assets: string[],
    evidenceIds: string[],
    confidence: number,
  ): void => {
    f += 1;
    findings.push(
      Finding.parse({
        finding_id: `FND-${String(f).padStart(3, "0")}`,
        assessment_id: input.assessmentId,
        category,
        severity,
        title,
        description: consequence,
        business_consequence: consequence,
        affected_assets: assets,
        evidence_ids: evidenceIds,
        confidence,
        status: "OPEN",
        created_by: "agent:evidence",
        requires_human_review: false,
        created_at: now,
      }),
    );
  };

  // --- DATA_QUALITY: duplicate customers (control DQ-UNIQUENESS) ---
  const dup = detectDuplicates(input.customers.rows, "customer_id");
  if (dup.duplicateRowCount > 0) {
    const evId = addEvidence(
      "SRC-customers",
      "demo_data/customers.csv",
      "duplicate_key_check",
      dup.duplicateRowCount,
      "rows",
    );
    addFinding(
      "DATA_QUALITY",
      "HIGH",
      "Duplicate customer identifiers",
      `${dup.duplicateRowCount} rows share a duplicated customer_id across ${dup.duplicateKeyCount} keys; Net Revenue may double-count customers.`,
      ["dataset:customers", "kpi:net_revenue"],
      [evId],
      0.93,
    );
  }

  // --- DATA_QUALITY: transactions freshness (control DQ-FRESHNESS) ---
  const slaDays = parseFreshnessSlaDays(
    input.catalog.datasets.find((d) => d.name === "transactions")?.freshness_rule ?? null,
  );
  const ageDays = newestAgeDays(
    input.transactions.rows.map((r) => r["last_refreshed_at"] ?? ""),
    input.now,
  );
  if (slaDays !== null && ageDays !== null && ageDays > slaDays) {
    const evId = addEvidence(
      "SRC-transactions",
      "demo_data/transactions.csv",
      "freshness_age_days",
      ageDays,
      "days",
    );
    addFinding(
      "DATA_QUALITY",
      "HIGH",
      "Stale transactions feed",
      `The most recent transactions refresh is ${ageDays} days old, exceeding the ${slaDays}-day SLA; the KPI reflects outdated data.`,
      ["dataset:transactions", "kpi:net_revenue"],
      [evId],
      0.9,
    );
  }

  // --- GOVERNANCE: missing dataset owner (control GOV-OWNERSHIP) ---
  const customersCatalog = input.catalog.datasets.find((d) => d.name === "customers");
  if (customersCatalog && !customersCatalog.owner) {
    const evId = addEvidence(
      "SRC-catalog",
      "demo_data/catalog.json",
      "ownership_presence_check",
      "customers.owner=null",
      null,
    );
    addFinding(
      "GOVERNANCE",
      "HIGH",
      "Business-critical dataset has no owner",
      "The customers dataset has no named owner; accountability for its quality is undefined.",
      ["dataset:customers"],
      [evId],
      0.95,
    );
  }

  // --- GOVERNANCE: KPI owner / definition divergence (control GOV-DEFINITION) ---
  if (!input.kpi.owner || input.kpi.definitionDiverges) {
    const evId = addEvidence(
      "SRC-kpi",
      "demo_data/kpi_net_revenue.md",
      "kpi_definition_check",
      input.kpi.owner ? "definition_divergence=true" : "kpi.owner=null",
      null,
    );
    addFinding(
      "GOVERNANCE",
      "MEDIUM",
      "KPI definition not governed",
      "Net Revenue has no owner and its technical calculation diverges from the business definition (no de-duplication, no freshness constraint).",
      ["kpi:net_revenue"],
      [evId],
      0.88,
    );
  }

  return { evidence, findings, evaluatedDimensions: ["DATA_QUALITY", "GOVERNANCE"] };
}

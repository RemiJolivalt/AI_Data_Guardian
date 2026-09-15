import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DataSource, AIReadiness, type AIReadinessStatus } from "@/core/domain";
import { parseCsv } from "@/core/ingestion/csv";
import { sha256 } from "@/core/ingestion/hash";
import { loadScoringConfig } from "@/core/scoring/config";
import { computeTrustScore } from "@/core/scoring/engine";
import { evaluateRevenueScenario, type Catalog } from "@/core/assessment/rules";
import type { AssessmentResult } from "@/core/assessment/types";

/**
 * Orchestrates one deterministic assessment run of the Revenue Forecasting demo scenario:
 * ingest -> profile/evaluate -> score -> AI readiness. No LLM involvement.
 */

export interface RunOptions {
  rootDir: string;
  now?: Date;
  assessmentId?: string;
}

function source(id: string, path: string, type: string, role: DataSource["role"], content: string) {
  return DataSource.parse({
    source_id: id,
    path,
    type,
    role,
    hash: sha256(content),
    is_synthetic: true,
    processing_status: "PROCESSED",
  });
}

export function runAssessment(options: RunOptions): AssessmentResult {
  const now = options.now ?? new Date();
  const assessmentId = options.assessmentId ?? "ASM-DEMO";
  const dataDir = join(options.rootDir, "demo_data");

  const customersRaw = readFileSync(join(dataDir, "customers.csv"), "utf8");
  const transactionsRaw = readFileSync(join(dataDir, "transactions.csv"), "utf8");
  const catalogRaw = readFileSync(join(dataDir, "catalog.json"), "utf8");
  const kpiRaw = readFileSync(join(dataDir, "kpi_net_revenue.md"), "utf8");

  const customers = parseCsv(customersRaw);
  const transactions = parseCsv(transactionsRaw);
  const catalog = JSON.parse(catalogRaw) as Catalog;

  const sources: DataSource[] = [
    source("SRC-customers", "demo_data/customers.csv", "csv", "OPERATIONAL", customersRaw),
    source("SRC-transactions", "demo_data/transactions.csv", "csv", "OPERATIONAL", transactionsRaw),
    source("SRC-catalog", "demo_data/catalog.json", "json", "CATALOG", catalogRaw),
    source("SRC-kpi", "demo_data/kpi_net_revenue.md", "markdown", "REFERENCE", kpiRaw),
  ];

  const evaluation = evaluateRevenueScenario({
    assessmentId,
    customers,
    transactions,
    catalog,
    kpi: { id: "kpi:net_revenue", owner: null, definitionDiverges: true },
    now,
  });

  const config = loadScoringConfig(join(options.rootDir, "config", "scoring.yaml"));
  const score = computeTrustScore({
    assessmentId,
    findings: evaluation.findings,
    evaluatedDimensions: evaluation.evaluatedDimensions,
    config,
    now,
  });

  const readinessStatus: AIReadinessStatus =
    score.status === "TRUSTED"
      ? "READY"
      : score.status === "CONDITIONALLY_TRUSTED"
        ? "READY_WITH_CONDITIONS"
        : "NOT_READY";

  const ai_readiness = AIReadiness.parse({
    assessment_id: assessmentId,
    status: readinessStatus,
    blockers: evaluation.findings.map((finding) => finding.title),
  });

  return {
    assessment_id: assessmentId,
    scenario: "revenue_forecasting_agent",
    is_synthetic: true,
    generated_at: now.toISOString(),
    sources,
    evidence: evaluation.evidence,
    findings: evaluation.findings,
    score,
    ai_readiness,
  };
}

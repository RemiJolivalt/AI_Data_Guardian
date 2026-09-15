import type { AssessmentResult } from "@/core/assessment/types";

/**
 * Repository abstraction for persisting assessment runs (ADR-0003, ADR-0008).
 * Deployed -> Supabase Postgres; local/tests -> in-memory. No LLM involvement.
 */

export interface StoredRun {
  id: string;
  scenario: string;
  status: string;
  overall: number | null;
  created_at: string;
  result: AssessmentResult;
}

export interface RunSummary {
  id: string;
  scenario: string;
  status: string;
  overall: number | null;
  created_at: string;
}

export interface AssessmentRepository {
  save(result: AssessmentResult): Promise<StoredRun>;
  get(id: string): Promise<StoredRun | null>;
  list(limit?: number): Promise<RunSummary[]>;
}

export function toStoredRun(result: AssessmentResult): StoredRun {
  return {
    id: result.assessment_id,
    scenario: result.scenario,
    status: result.score.status,
    overall: result.score.overall,
    created_at: result.generated_at,
    result,
  };
}

/** Deterministic in-memory implementation for local/dev and tests. */
export class InMemoryAssessmentRepository implements AssessmentRepository {
  private readonly runs = new Map<string, StoredRun>();

  async save(result: AssessmentResult): Promise<StoredRun> {
    const run = toStoredRun(result);
    this.runs.set(run.id, run);
    return run;
  }

  async get(id: string): Promise<StoredRun | null> {
    return this.runs.get(id) ?? null;
  }

  async list(limit = 20): Promise<RunSummary[]> {
    return [...this.runs.values()]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, limit)
      .map(({ id, scenario, status, overall, created_at }) => ({
        id,
        scenario,
        status,
        overall,
        created_at,
      }));
  }
}

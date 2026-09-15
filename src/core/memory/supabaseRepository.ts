import { createServiceClient } from "@/lib/supabase";
import type { AssessmentResult } from "@/core/assessment/types";
import {
  type AssessmentRepository,
  type RunSummary,
  type StoredRun,
  toStoredRun,
} from "@/core/memory/assessmentRepository";

const TABLE = "assessment_runs";

/** Supabase Postgres implementation. Uses the service-role client (server-only). */
export class SupabaseAssessmentRepository implements AssessmentRepository {
  async save(result: AssessmentResult): Promise<StoredRun> {
    const run = toStoredRun(result);
    const client = createServiceClient();
    const { error } = await client.from(TABLE).upsert({
      id: run.id,
      scenario: run.scenario,
      status: run.status,
      overall: run.overall,
      is_synthetic: result.is_synthetic,
      result: run.result,
      created_at: run.created_at,
    });
    if (error) {
      throw new Error(`Failed to persist assessment run: ${error.message}`);
    }
    return run;
  }

  async get(id: string): Promise<StoredRun | null> {
    const client = createServiceClient();
    const { data, error } = await client
      .from(TABLE)
      .select("id, scenario, status, overall, created_at, result")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      throw new Error(`Failed to read assessment run: ${error.message}`);
    }
    if (!data) return null;
    return {
      id: data.id as string,
      scenario: data.scenario as string,
      status: data.status as string,
      overall: (data.overall as number | null) ?? null,
      created_at: data.created_at as string,
      result: data.result as AssessmentResult,
    };
  }

  async list(limit = 20): Promise<RunSummary[]> {
    const client = createServiceClient();
    const { data, error } = await client
      .from(TABLE)
      .select("id, scenario, status, overall, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      throw new Error(`Failed to list assessment runs: ${error.message}`);
    }
    return (data ?? []).map((row) => ({
      id: row.id as string,
      scenario: row.scenario as string,
      status: row.status as string,
      overall: (row.overall as number | null) ?? null,
      created_at: row.created_at as string,
    }));
  }
}

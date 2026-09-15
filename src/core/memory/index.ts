import { isSupabaseConfigured } from "@/lib/supabase";
import {
  type AssessmentRepository,
  InMemoryAssessmentRepository,
} from "@/core/memory/assessmentRepository";
import { SupabaseAssessmentRepository } from "@/core/memory/supabaseRepository";

// Shared in-memory instance so local/dev runs accumulate within a process.
const inMemory = new InMemoryAssessmentRepository();

/** Returns Supabase when configured, otherwise the in-memory fallback (ADR-0003/0008). */
export function getAssessmentRepository(): AssessmentRepository {
  return isSupabaseConfigured() ? new SupabaseAssessmentRepository() : inMemory;
}

export * from "@/core/memory/assessmentRepository";

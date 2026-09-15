import { isSupabaseConfigured } from "@/lib/supabase";
import {
  type AssessmentRepository,
  InMemoryAssessmentRepository,
} from "@/core/memory/assessmentRepository";
import { SupabaseAssessmentRepository } from "@/core/memory/supabaseRepository";
import { type WorkspaceStore, InMemoryWorkspaceStore } from "@/core/memory/workspaceStore";
import { SupabaseWorkspaceStore } from "@/core/memory/supabaseWorkspaceStore";

// Shared in-memory instances so local/dev runs accumulate within a process.
const inMemory = new InMemoryAssessmentRepository();
const inMemoryWorkspace = new InMemoryWorkspaceStore();

/** Returns Supabase when configured, otherwise the in-memory fallback (ADR-0003/0008). */
export function getAssessmentRepository(): AssessmentRepository {
  return isSupabaseConfigured() ? new SupabaseAssessmentRepository() : inMemory;
}

export function getWorkspaceStore(): WorkspaceStore {
  return isSupabaseConfigured() ? new SupabaseWorkspaceStore() : inMemoryWorkspace;
}

export * from "@/core/memory/assessmentRepository";
export * from "@/core/memory/workspaceStore";

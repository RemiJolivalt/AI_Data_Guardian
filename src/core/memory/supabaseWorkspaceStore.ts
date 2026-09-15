import { createServiceClient } from "@/lib/supabase";
import type { LearnedRule } from "@/core/learning/engine";
import type { ContextDocument, StoredLearnedRule, WorkspaceStore } from "@/core/memory/workspaceStore";

/** Supabase Postgres implementation (server-only, service-role). */
export class SupabaseWorkspaceStore implements WorkspaceStore {
  async saveLearnedRule(domainId: string, rule: LearnedRule): Promise<void> {
    const client = createServiceClient();
    const { error } = await client.from("learned_rules").upsert({
      id: rule.rule_id,
      domain_id: domainId,
      type: rule.type,
      match_mode: rule.match.mode,
      match_value: rule.match.value,
      proposed_value: rule.proposed_value,
      source_suggestion_id: rule.source_suggestion_id,
      approved_by: rule.approved_by,
      approved_at: rule.approved_at,
    });
    if (error) throw new Error(`saveLearnedRule failed: ${error.message}`);
  }

  async listLearnedRules(): Promise<StoredLearnedRule[]> {
    const client = createServiceClient();
    const { data, error } = await client.from("learned_rules").select("*");
    if (error) throw new Error(`listLearnedRules failed: ${error.message}`);
    return (data ?? []).map((row) => ({
      rule_id: row.id as string,
      domain_id: row.domain_id as string,
      type: row.type as LearnedRule["type"],
      match: { mode: row.match_mode as "TOKEN" | "COLUMN", value: row.match_value as string },
      proposed_value: (row.proposed_value as string) ?? "",
      source_suggestion_id: (row.source_suggestion_id as string) ?? "",
      approved_by: (row.approved_by as string) ?? "",
      approved_at: row.approved_at as string,
    }));
  }

  async getScope(domainId: string): Promise<string[] | null> {
    const client = createServiceClient();
    const { data, error } = await client
      .from("workspace_scope")
      .select("assets")
      .eq("domain_id", domainId)
      .maybeSingle();
    if (error) throw new Error(`getScope failed: ${error.message}`);
    return data ? ((data.assets as string[]) ?? []) : null;
  }

  async setScope(domainId: string, assets: string[]): Promise<void> {
    const client = createServiceClient();
    const { error } = await client
      .from("workspace_scope")
      .upsert({ domain_id: domainId, assets, updated_at: new Date().toISOString() });
    if (error) throw new Error(`setScope failed: ${error.message}`);
  }

  async addDocument(doc: ContextDocument): Promise<void> {
    const client = createServiceClient();
    const { error } = await client.from("context_documents").insert({
      id: doc.document_id,
      domain_id: doc.domain_id,
      name: doc.name,
      doc_type: doc.doc_type,
      text: doc.text,
      is_synthetic: doc.is_synthetic,
      created_at: doc.created_at,
    });
    if (error) throw new Error(`addDocument failed: ${error.message}`);
  }

  async listDocuments(domainId: string): Promise<ContextDocument[]> {
    const client = createServiceClient();
    const { data, error } = await client
      .from("context_documents")
      .select("*")
      .eq("domain_id", domainId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`listDocuments failed: ${error.message}`);
    return (data ?? []).map((row) => ({
      document_id: row.id as string,
      domain_id: row.domain_id as string,
      name: row.name as string,
      doc_type: row.doc_type as string,
      text: (row.text as string) ?? "",
      is_synthetic: Boolean(row.is_synthetic),
      created_at: row.created_at as string,
    }));
  }
}

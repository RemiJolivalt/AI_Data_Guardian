import type { LearnedRule } from "@/core/learning/engine";

/**
 * Workspace persistence (ADR-0003, ADR-0008): learned rules (knowledge capitalization),
 * supervision scope, and context documents. Deployed -> Supabase; local/tests -> in-memory.
 */

export interface StoredLearnedRule extends LearnedRule {
  domain_id: string;
}

export interface ContextDocument {
  document_id: string;
  domain_id: string;
  name: string;
  doc_type: string;
  text: string;
  is_synthetic: boolean;
  created_at: string;
}

export interface WorkspaceStore {
  saveLearnedRule(domainId: string, rule: LearnedRule): Promise<void>;
  listLearnedRules(): Promise<StoredLearnedRule[]>;
  getScope(domainId: string): Promise<string[] | null>;
  setScope(domainId: string, assets: string[]): Promise<void>;
  addDocument(doc: ContextDocument): Promise<void>;
  listDocuments(domainId: string): Promise<ContextDocument[]>;
}

/** Deterministic in-memory implementation for local/dev and tests. */
export class InMemoryWorkspaceStore implements WorkspaceStore {
  private readonly learned = new Map<string, StoredLearnedRule>();
  private readonly scope = new Map<string, string[]>();
  private readonly documents: ContextDocument[] = [];

  async saveLearnedRule(domainId: string, rule: LearnedRule): Promise<void> {
    this.learned.set(rule.rule_id, { ...rule, domain_id: domainId });
  }
  async listLearnedRules(): Promise<StoredLearnedRule[]> {
    return [...this.learned.values()];
  }
  async getScope(domainId: string): Promise<string[] | null> {
    return this.scope.get(domainId) ?? null;
  }
  async setScope(domainId: string, assets: string[]): Promise<void> {
    this.scope.set(domainId, assets);
  }
  async addDocument(doc: ContextDocument): Promise<void> {
    this.documents.push(doc);
  }
  async listDocuments(domainId: string): Promise<ContextDocument[]> {
    return this.documents.filter((d) => d.domain_id === domainId);
  }
}

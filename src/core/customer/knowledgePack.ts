import { z } from "zod";
import { parse as parseYaml } from "yaml";

/** Curated, versioned industry knowledge pack (grounding source for AI suggestions). */
export const KnowledgePackColumn = z.object({
  canonical_description: z.string().optional(),
  is_pii: z.boolean().default(false),
  expected_pattern: z.string().optional(),
  expected_rules: z.array(z.string()).default([]),
  critical: z.boolean().default(false),
});
export type KnowledgePackColumn = z.infer<typeof KnowledgePackColumn>;

export const KnowledgePack = z.object({
  knowledge_pack_id: z.string().min(1),
  version: z.string().min(1),
  is_curated: z.literal(true),
  industry: z.string().min(1),
  domain: z.string().min(1),
  definition: z.string().optional(),
  lineage_chain: z.array(z.string()).default([]),
  columns: z.record(z.string(), KnowledgePackColumn),
  business_risks: z.array(z.string()).default([]),
});
export type KnowledgePack = z.infer<typeof KnowledgePack>;

export function parseKnowledgePack(yamlText: string): KnowledgePack {
  return KnowledgePack.parse(parseYaml(yamlText));
}

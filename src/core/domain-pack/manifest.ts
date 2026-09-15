import { z } from "zod";
import { parse as parseYaml } from "yaml";

/**
 * A Domain Pack manifest turns a "business object" (Customer, Product, HR, ...) into a
 * config-driven unit. Adding a domain = dropping a folder with data + this manifest and
 * registering it in config/domains.yaml. The engine stays generic (no per-domain code).
 */

export const DomainAssetSpec = z.object({
  file: z.string().min(1),
  asset: z.string().min(1),
  role: z.enum(["MASTER", "TRANSACTIONAL", "REFERENCE"]).default("MASTER"),
  key: z.string().optional(),
});
export type DomainAssetSpec = z.infer<typeof DomainAssetSpec>;

export const DomainStory = z.object({
  label: z.string().min(1),
  columns: z.array(z.string()).default([]),
  assets: z.array(z.string()).default([]),
});
export type DomainStory = z.infer<typeof DomainStory>;

export const DomainManifest = z.object({
  domain_id: z.string().min(1),
  label: z.string().min(1),
  object_type: z.enum(["MASTER_DATA", "TRANSACTIONAL", "MIXED"]),
  description: z.string().default(""),
  assets: z.array(DomainAssetSpec).min(1),
  catalog_file: z.string().min(1),
  rules_file: z.string().min(1),
  knowledge_pack_file: z.string().min(1),
  stories: z.record(z.string(), DomainStory).default({}),
});
export type DomainManifest = z.infer<typeof DomainManifest>;

export function parseDomainManifest(yamlText: string): DomainManifest {
  return DomainManifest.parse(parseYaml(yamlText));
}

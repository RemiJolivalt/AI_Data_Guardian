import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { parse as parseYaml } from "yaml";
import { parseDomainManifest, type DomainManifest } from "@/core/domain-pack/manifest";

/**
 * Domain registry: the single explicit list of registered business objects.
 * Serverless-friendly (no directory globbing). Add a domain by appending one entry.
 */

const RegistryEntry = z.object({
  domain_id: z.string().min(1),
  dir: z.string().min(1),
});

const Registry = z.object({
  domains: z.array(RegistryEntry).default([]),
});

export interface RegisteredDomain {
  domain_id: string;
  dir: string;
  manifest: DomainManifest;
}

function loadRegistry(rootDir: string): z.infer<typeof Registry> {
  return Registry.parse(parseYaml(readFileSync(join(rootDir, "config", "domains.yaml"), "utf8")));
}

export function listDomains(rootDir: string): RegisteredDomain[] {
  return loadRegistry(rootDir).domains.map((entry) => ({
    domain_id: entry.domain_id,
    dir: entry.dir,
    manifest: parseDomainManifest(readFileSync(join(rootDir, entry.dir, "domain.yaml"), "utf8")),
  }));
}

export function getDomain(rootDir: string, domainId: string): RegisteredDomain | null {
  return listDomains(rootDir).find((d) => d.domain_id === domainId) ?? null;
}

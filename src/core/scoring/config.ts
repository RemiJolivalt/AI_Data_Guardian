import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { ScoreDimension } from "@/core/domain";

/**
 * Loader and validator for the versioned Trust Score configuration (cahier §6, ADR-0005).
 * Pure and deterministic: the same YAML always yields the same parsed config.
 */

const EPSILON = 1e-6;

const DimensionConfig = z.object({
  weight: z.number().min(0).max(1),
  min_evidence: z.number().int().nonnegative(),
});

const StatusThresholds = z.object({
  TRUSTED: z.number().min(0).max(1),
  CONDITIONALLY_TRUSTED: z.number().min(0).max(1),
  AT_RISK: z.number().min(0).max(1),
});

export const ScoringConfig = z
  .object({
    score_version: z.string().min(1),
    weights_total: z.number().positive(),
    dimensions: z.record(ScoreDimension, DimensionConfig),
    status_thresholds: StatusThresholds,
  })
  .superRefine((cfg, ctx) => {
    const required = ScoreDimension.options;
    for (const dim of required) {
      if (!(dim in cfg.dimensions)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `missing dimension: ${dim}`,
          path: ["dimensions", dim],
        });
      }
    }
    const sum = Object.values(cfg.dimensions).reduce((acc, d) => acc + d.weight, 0);
    if (Math.abs(sum - cfg.weights_total) > EPSILON) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `dimension weights sum to ${sum}, expected ${cfg.weights_total}`,
        path: ["dimensions"],
      });
    }
  });

export type ScoringConfig = z.infer<typeof ScoringConfig>;

/** Parse and validate scoring config from a YAML string. Throws on any invalid config. */
export function parseScoringConfig(yamlText: string): ScoringConfig {
  const raw: unknown = parseYaml(yamlText);
  return ScoringConfig.parse(raw);
}

/** Load and validate scoring config from a file path. */
export function loadScoringConfig(path: string): ScoringConfig {
  return parseScoringConfig(readFileSync(path, "utf8"));
}

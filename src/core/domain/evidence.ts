import { z } from "zod";
import { Id, IsoTimestamp } from "./ids";

/**
 * Evidence contract (cahier §7.3). Every factual claim in the platform must be
 * backed by an Evidence record. Evidence is produced by deterministic methods only.
 */
export const Evidence = z.object({
  evidence_id: Id,
  source_id: Id,
  source_location: z.string().min(1),
  method: z.string().min(1),
  observed_value: z.union([z.number(), z.string(), z.boolean()]),
  unit: z.string().nullable().default(null),
  is_synthetic: z.boolean(),
  hash: z.string().min(1),
  generated_at: IsoTimestamp,
});
export type Evidence = z.infer<typeof Evidence>;

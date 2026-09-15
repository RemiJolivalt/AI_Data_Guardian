import { z } from "zod";

/**
 * Shared primitives: identifiers, ISO-8601 timestamps, and version strings.
 * Every entity carries ids, versions, and timestamps per cahier §7.
 */

/** A non-empty identifier string, e.g. "FND-001", "dataset:customers". */
export const Id = z.string().min(1, "id must be non-empty");
export type Id = z.infer<typeof Id>;

/** ISO-8601 timestamp with timezone offset (or Z). */
export const IsoTimestamp = z
  .string()
  .datetime({ offset: true, message: "must be an ISO-8601 timestamp" });
export type IsoTimestamp = z.infer<typeof IsoTimestamp>;

/** Semantic-ish version marker, e.g. "1.0.0" or "score-2026-09-15". */
export const Version = z.string().min(1, "version must be non-empty");
export type Version = z.infer<typeof Version>;

/** A confidence value in the closed interval [0, 1]. */
export const Confidence = z.number().min(0).max(1);
export type Confidence = z.infer<typeof Confidence>;

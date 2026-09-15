import { createHash } from "node:crypto";

/** Deterministic SHA-256 of a UTF-8 string, prefixed for evidence records (§7.3). */
export function sha256(content: string): string {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

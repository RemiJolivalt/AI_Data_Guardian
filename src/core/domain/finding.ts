import { z } from "zod";
import { Id, IsoTimestamp, Confidence } from "./ids";
import { FindingCategory, Severity, FindingStatus } from "./enums";

/**
 * Finding contract (cahier §7.2). A Finding is created only when an explicit rule
 * or threshold is met (US-012), and always links to evidence.
 */
export const Finding = z.object({
  finding_id: Id,
  assessment_id: Id,
  category: FindingCategory,
  severity: Severity,
  title: z.string().min(1),
  description: z.string().default(""),
  business_consequence: z.string().default(""),
  affected_assets: z.array(Id).default([]),
  evidence_ids: z.array(Id).min(1, "a finding must cite at least one evidence"),
  confidence: Confidence,
  status: FindingStatus.default("OPEN"),
  created_by: z.string().min(1),
  requires_human_review: z.boolean().default(false),
  created_at: IsoTimestamp.optional(),
});
export type Finding = z.infer<typeof Finding>;

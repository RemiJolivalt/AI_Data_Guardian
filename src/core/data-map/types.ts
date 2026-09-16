import { z } from "zod";

/**
 * Contracts for the Enterprise Data Map (Carte du patrimoine) demonstrator.
 * Vocabulary aligned with the product recommendations (Domain -> BusinessObject -> DataTable).
 * All map data is synthetic and deterministic; the core stays pure (no LLM, no wall-clock).
 */

export const TrustLevel = z.enum(["Faible", "Modérée", "Élevée"]);
export type TrustLevel = z.infer<typeof TrustLevel>;

export const DecisionStatus = z.enum(["À valider", "Capitalisé", "Rejeté"]);
export type DecisionStatus = z.infer<typeof DecisionStatus>;

export const BusinessDomain = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  trustScore: z.number().int().min(0).max(100),
  criticalObjects: z.number().int().min(0),
});
export type BusinessDomain = z.infer<typeof BusinessDomain>;

export const BusinessObject = z.object({
  id: z.string().min(1),
  domainId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(""),
  trustScore: z.number().int().min(0).max(100),
  businessCriticality: TrustLevel,
  existingControls: z.number().int().min(0),
  recommendedControls: z.number().int().min(0),
  tableIds: z.array(z.string()).default([]),
});
export type BusinessObject = z.infer<typeof BusinessObject>;

export const DataTable = z.object({
  id: z.string().min(1),
  businessObjectId: z.string().min(1),
  name: z.string().min(1),
  qualityStatus: TrustLevel,
  governanceCoverage: z.number().int().min(0).max(100),
  reusableRules: z.array(z.string()).default([]),
});
export type DataTable = z.infer<typeof DataTable>;

export const EnterpriseDataMap = z.object({
  is_synthetic: z.literal(true),
  globalTrustScore: z.number().int().min(0).max(100),
  trustStatus: z.string().min(1),
  domains: z.array(BusinessDomain).min(1),
  businessObjects: z.array(BusinessObject).min(1),
  dataTables: z.array(DataTable).min(1),
});
export type EnterpriseDataMap = z.infer<typeof EnterpriseDataMap>;

export const GuardianRecommendation = z.object({
  id: z.string().min(1),
  sourceObjectId: z.string().min(1),
  targetObjectId: z.string().min(1),
  targetTableId: z.string().optional(),
  controlLabel: z.string().min(1),
  similarityReason: z.string().min(1),
  expectedBusinessImpact: z.string().min(1),
  confidence: z.number().min(0).max(1),
  status: DecisionStatus,
  expertComment: z.string().optional(),
  parameter: z.string().optional(),
});
export type GuardianRecommendation = z.infer<typeof GuardianRecommendation>;

export const ReusableExpertise = z.object({
  label: z.string().min(1),
  type: z.enum(["dq_rule", "governance_control", "business_definition", "expert_decision"]),
  source: z.string().min(1),
});
export type ReusableExpertise = z.infer<typeof ReusableExpertise>;

export const GuardianExposure = z.object({
  level: TrustLevel,
  decisions: z.array(z.string()).default([]),
  processes: z.array(z.string()).default([]),
  compliance: z.string().min(1),
});
export type GuardianExposure = z.infer<typeof GuardianExposure>;

export const GuardianAnalysis = z.object({
  objectId: z.string().min(1),
  includedTableIds: z.array(z.string()).default([]),
  riskExplanation: z.string().min(1),
  exposure: GuardianExposure,
  reusableExpertise: z.array(ReusableExpertise).default([]),
  recommendations: z.array(GuardianRecommendation).default([]),
});
export type GuardianAnalysis = z.infer<typeof GuardianAnalysis>;

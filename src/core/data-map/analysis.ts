import {
  type EnterpriseDataMap,
  type GuardianAnalysis,
  type GuardianExposure,
  type GuardianRecommendation,
  type ReusableExpertise,
  type TrustLevel,
} from "@/core/data-map/types";
import { getObject, tablesForObject } from "@/core/data-map/registry";

/**
 * Deterministic Guardian analysis. The result depends only on the selected object (and the set
 * of already-capitalized decisions passed in). No randomness, no LLM, no wall-clock — the same
 * inputs always yield the same recommendations (recommendations doc §9 "logique déterministe").
 */

type RecommendationTemplate = Omit<GuardianRecommendation, "status">;

interface ObjectScenario {
  riskExplanation: string;
  exposure: GuardianExposure;
  recommendations: RecommendationTemplate[];
}

/** Curated, deterministic scenarios per business object. */
const SCENARIOS: Record<string, ObjectScenario> = {
  customer_360: {
    riskExplanation:
      "Le domaine Customer présente une confiance insuffisante car les contrôles de complétude appliqués à Customer 360 ne couvrent pas les données de contact utilisées par les campagnes et le service client.",
    exposure: {
      level: "Élevée",
      decisions: ["Ciblage des campagnes marketing", "Priorisation du service client"],
      processes: ["Campagnes multicanal", "Support et réclamations"],
      compliance: "Risque de non-conformité sur la qualité des coordonnées et le consentement.",
    },
    recommendations: [
      {
        id: "REC-C360-1",
        sourceObjectId: "customer_360",
        targetObjectId: "customer_contact",
        targetTableId: "contact_email",
        controlLabel: "Contrôle de complétude et de validité des coordonnées email",
        similarityReason:
          "Même domaine Customer, attributs de contact partagés et même classification PII que customer_contact.",
        expectedBusinessImpact: "Fiabilité des campagnes, du service client et des usages IA.",
        confidence: 0.86,
      },
      {
        id: "REC-C360-2",
        sourceObjectId: "customer_360",
        targetObjectId: "customer_contact",
        targetTableId: "contact_phone",
        controlLabel: "Contrôle de format et de validité du numéro de téléphone",
        similarityReason:
          "Même pattern de données de contact et même usage opérationnel que la règle email validée.",
        expectedBusinessImpact: "Amélioration de la joignabilité et de la délivrabilité.",
        confidence: 0.78,
      },
    ],
  },
  revenue_reporting: {
    riskExplanation:
      "Le KPI Net Revenue s'appuie sur des agrégats dont la fraîcheur et le rapprochement comptable ne sont pas contrôlés de bout en bout, ce qui fragilise la fiabilité du reporting exécutif.",
    exposure: {
      level: "Élevée",
      decisions: ["Communication du chiffre d'affaires au comité", "Pilotage de la performance"],
      processes: ["Clôture mensuelle", "Reporting exécutif"],
      compliance: "Risque d'écart non détecté avec le grand livre.",
    },
    recommendations: [
      {
        id: "REC-REV-1",
        sourceObjectId: "revenue_reporting",
        targetObjectId: "revenue_reporting",
        targetTableId: "revenue_by_segment",
        controlLabel: "Contrôle de fraîcheur quotidienne sur les agrégats par segment",
        similarityReason:
          "Même règle de fraîcheur déjà éprouvée sur revenue_daily, applicable au même objet.",
        expectedBusinessImpact: "Reporting segmenté aligné sur les données du jour.",
        confidence: 0.8,
      },
      {
        id: "REC-REV-2",
        sourceObjectId: "revenue_reporting",
        targetObjectId: "revenue_reporting",
        targetTableId: "net_revenue_kpi",
        controlLabel: "Contrôle de rapprochement au grand livre",
        similarityReason:
          "Contrôle de cohérence comptable comparable aux règles de validité déjà en place.",
        expectedBusinessImpact: "Confiance accrue du comité dans le KPI Net Revenue.",
        confidence: 0.74,
      },
    ],
  },
};

/** Maps a governance coverage percentage to a qualitative quality signal. */
function coverageToLevel(coveragePercent: number): TrustLevel {
  if (coveragePercent >= 70) return "Élevée";
  if (coveragePercent >= 45) return "Modérée";
  return "Faible";
}

/** Fallback scenario for objects without a curated script — derived from their weakest tables. */
function genericScenario(map: EnterpriseDataMap, objectId: string): ObjectScenario {
  const obj = getObject(map, objectId);
  const tables = tablesForObject(map, objectId);
  const weak = tables
    .filter((tbl) => tbl.governanceCoverage < 60)
    .sort((a, b) => a.governanceCoverage - b.governanceCoverage);
  const targets = (weak.length > 0 ? weak : tables).slice(0, 2);
  const recommendations: RecommendationTemplate[] = targets.map((tbl, i) => ({
    id: `REC-${objectId.toUpperCase()}-${i + 1}`,
    sourceObjectId: objectId,
    targetObjectId: objectId,
    targetTableId: tbl.id,
    controlLabel: `Contrôle de gouvernance et de qualité sur ${tbl.name}`,
    similarityReason: `Couverture de gouvernance faible (${tbl.governanceCoverage}%) au regard des tables comparables du même objet.`,
    expectedBusinessImpact: "Renforcement de la confiance pour les usages métier et IA.",
    confidence: 0.7,
  }));
  return {
    riskExplanation: `L'objet ${obj?.name ?? objectId} comporte des tables dont la couverture de gouvernance est insuffisante pour un usage de décision fiable.`,
    exposure: {
      level: coverageToLevel(
        tables.length ? Math.round(tables.reduce((s, tbl) => s + tbl.governanceCoverage, 0) / tables.length) : 0,
      ),
      decisions: ["Usage analytique de l'objet"],
      processes: ["Processus métier dépendants"],
      compliance: "Exposition à qualifier selon la sensibilité des données.",
    },
    recommendations,
  };
}

export interface CapitalizedDecision {
  recommendationId: string;
  status: "Capitalisé" | "Rejeté";
  controlLabel: string;
  sourceObjectId: string;
  expertComment?: string;
}

/**
 * Builds the deterministic analysis for a selected object. Capitalized decisions for the same
 * source object surface as reusable expertise; decided recommendations (capitalized or rejected)
 * drop out of the pending list.
 */
export function analyzeObject(
  map: EnterpriseDataMap,
  objectId: string,
  includedTableIds: string[],
  decided: CapitalizedDecision[] = [],
): GuardianAnalysis {
  const scenario = SCENARIOS[objectId] ?? genericScenario(map, objectId);
  const tables = tablesForObject(map, objectId);
  const included = includedTableIds.length ? includedTableIds : tables.map((tbl) => tbl.id);
  const includedSet = new Set(included);

  const decidedById = new Map(decided.map((d) => [d.recommendationId, d] as const));

  const baseExpertise: ReusableExpertise[] = tables
    .filter((tbl) => includedSet.has(tbl.id))
    .flatMap((tbl) =>
      tbl.reusableRules.map<ReusableExpertise>((rule) => ({
        label: rule,
        type: "dq_rule",
        source: `Contrôles existants — ${tbl.name}`,
      })),
    );

  const capitalizedExpertise: ReusableExpertise[] = decided
    .filter((d) => d.status === "Capitalisé" && d.sourceObjectId === objectId)
    .map<ReusableExpertise>((d) => ({
      label: d.controlLabel,
      type: "expert_decision",
      source: "Décision experte capitalisée",
    }));

  const recommendations: GuardianRecommendation[] = scenario.recommendations
    .filter((rec) => !decidedById.has(rec.id))
    .map((rec) => ({ ...rec, status: "À valider" as const }));

  return {
    objectId,
    includedTableIds: included,
    riskExplanation: scenario.riskExplanation,
    exposure: scenario.exposure,
    reusableExpertise: [...capitalizedExpertise, ...baseExpertise],
    recommendations,
  };
}

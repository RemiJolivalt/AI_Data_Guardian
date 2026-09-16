import type { EnterpriseDataMap } from "@/core/data-map/types";

/**
 * Deterministic Guardian coverage (recommendations doc "Data Scope / Guardian Coverage"). Coverage is
 * the share of recommended controls already in place; a capitalized decision adds an in-place control
 * to its target object, so coverage grows as expertise is validated. Pure — no wall-clock, no LLM.
 */

const CRITICALITY_WEIGHT = { Élevée: 3, Modérée: 2, Faible: 1 } as const;

export interface RecommendedNext {
  objectId: string;
  name: string;
  domainId: string;
  /** Coverage points unlocked by closing this object's remaining control gap. */
  trustGainPercent: number;
}

export interface GuardianCoverage {
  coveragePercent: number;
  guardedObjects: number;
  totalObjects: number;
  recommendedNext: RecommendedNext | null;
}

function inPlaceControls(existing: number, recommended: number, capitalized: number): number {
  return Math.min(existing + capitalized, recommended);
}

/**
 * @param capitalizedByObject count of capitalized decisions per target object id.
 */
export function computeGuardianCoverage(
  map: EnterpriseDataMap,
  capitalizedByObject: Record<string, number> = {},
): GuardianCoverage {
  const totalRecommended = map.businessObjects.reduce((s, o) => s + o.recommendedControls, 0);
  const totalInPlace = map.businessObjects.reduce(
    (s, o) => s + inPlaceControls(o.existingControls, o.recommendedControls, capitalizedByObject[o.id] ?? 0),
    0,
  );
  const coveragePercent = totalRecommended === 0 ? 0 : Math.round((100 * totalInPlace) / totalRecommended);

  const gaps = map.businessObjects
    .map((o) => {
      const gap = o.recommendedControls - inPlaceControls(o.existingControls, o.recommendedControls, capitalizedByObject[o.id] ?? 0);
      return { object: o, gap };
    })
    .filter((x) => x.gap > 0);

  const guardedObjects = map.businessObjects.length - gaps.length;

  const next = [...gaps].sort((a, b) => {
    const wa = CRITICALITY_WEIGHT[a.object.businessCriticality];
    const wb = CRITICALITY_WEIGHT[b.object.businessCriticality];
    if (wb !== wa) return wb - wa;
    if (b.gap !== a.gap) return b.gap - a.gap;
    return a.object.trustScore - b.object.trustScore;
  })[0];

  const recommendedNext: RecommendedNext | null = next
    ? {
        objectId: next.object.id,
        name: next.object.name,
        domainId: next.object.domainId,
        trustGainPercent: totalRecommended === 0 ? 0 : Math.round((100 * next.gap) / totalRecommended),
      }
    : null;

  return { coveragePercent, guardedObjects, totalObjects: map.businessObjects.length, recommendedNext };
}

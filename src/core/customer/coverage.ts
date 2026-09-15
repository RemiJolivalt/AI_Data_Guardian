import { columnKey, type CatalogEntry, type RuleIndex } from "@/core/customer/catalog";
import type { KnowledgePack } from "@/core/customer/knowledgePack";

/**
 * Deterministic coverage and gap analysis over the real columns of the domain (no LLM).
 * Coverage feeds the METADATA / GOVERNANCE / DATA_QUALITY / LINEAGE dimensions.
 */

export interface ColumnRef {
  asset: string;
  column: string;
}

export interface CoverageMetric {
  covered: number;
  total: number;
  ratio: number;
}

export interface Gap {
  asset: string;
  column: string;
  missing_description: boolean;
  missing_owner: boolean;
  missing_sensitivity: boolean;
  pii_unclassified: boolean;
  missing_rule: boolean;
  missing_lineage: boolean;
}

export interface CoverageResult {
  totals: { assets: number; columns: number };
  coverage: {
    metadata: CoverageMetric;
    governance: CoverageMetric;
    quality: CoverageMetric;
    lineage: CoverageMetric;
    overall: number;
  };
  gaps: Gap[];
  gap_counts: {
    description: number;
    owner: number;
    sensitivity: number;
    pii: number;
    rule: number;
    lineage: number;
  };
}

const PII_SENSITIVITIES = new Set(["PII", "SENSITIVE"]);

const metric = (covered: number, total: number): CoverageMetric => ({
  covered,
  total,
  ratio: total === 0 ? 0 : covered / total,
});

const round2 = (n: number): number => Math.round(n * 100) / 100;

export function computeCoverage(
  universe: ColumnRef[],
  catalog: Map<string, CatalogEntry>,
  rules: RuleIndex,
  knowledgePack: KnowledgePack,
): CoverageResult {
  let metaCovered = 0;
  let govCovered = 0;
  let qualityCovered = 0;
  let lineageCovered = 0;
  const gaps: Gap[] = [];

  for (const { asset, column } of universe) {
    const key = columnKey(asset, column);
    const entry = catalog.get(key);
    const kp = knowledgePack.columns[column];

    const hasDescription = Boolean(entry && entry.business_description.trim());
    const hasOwner = Boolean(entry && entry.data_owner.trim());
    const hasSensitivity = Boolean(entry && entry.sensitivity.trim());
    const hasRule = rules.activeKeys.has(key);
    const hasLineage = Boolean(entry && entry.upstream_asset.trim());

    if (hasDescription) metaCovered += 1;
    if (hasOwner && hasSensitivity) govCovered += 1;
    if (hasRule) qualityCovered += 1;
    if (hasLineage) lineageCovered += 1;

    const piiUnclassified =
      kp?.is_pii === true && !PII_SENSITIVITIES.has((entry?.sensitivity ?? "").toUpperCase());
    const expectsRule = (kp?.expected_rules?.length ?? 0) > 0;

    const gap: Gap = {
      asset,
      column,
      missing_description: !hasDescription,
      missing_owner: !hasOwner,
      missing_sensitivity: !hasSensitivity,
      pii_unclassified: piiUnclassified,
      missing_rule: expectsRule && !hasRule,
      missing_lineage: !hasLineage,
    };
    if (
      gap.missing_description ||
      gap.missing_owner ||
      gap.missing_sensitivity ||
      gap.pii_unclassified ||
      gap.missing_rule ||
      gap.missing_lineage
    ) {
      gaps.push(gap);
    }
  }

  const total = universe.length;
  const metadata = metric(metaCovered, total);
  const governance = metric(govCovered, total);
  const quality = metric(qualityCovered, total);
  const lineage = metric(lineageCovered, total);
  const overall = round2((metadata.ratio + governance.ratio + quality.ratio + lineage.ratio) / 4);

  const assets = new Set(universe.map((u) => u.asset)).size;

  return {
    totals: { assets, columns: total },
    coverage: { metadata, governance, quality, lineage, overall },
    gaps,
    gap_counts: {
      description: gaps.filter((g) => g.missing_description).length,
      owner: gaps.filter((g) => g.missing_owner).length,
      sensitivity: gaps.filter((g) => g.missing_sensitivity).length,
      pii: gaps.filter((g) => g.pii_unclassified).length,
      rule: gaps.filter((g) => g.missing_rule).length,
      lineage: gaps.filter((g) => g.missing_lineage).length,
    },
  };
}

import { parseCsv } from "@/core/ingestion/csv";

/** Parsed governance catalog + DQ rules (the simulated external tools). */

export interface CatalogEntry {
  asset: string;
  column: string;
  business_description: string;
  data_owner: string;
  sensitivity: string;
  upstream_asset: string;
}

export const columnKey = (asset: string, column: string): string => `${asset}|${column}`;

export function loadCatalog(csvText: string): Map<string, CatalogEntry> {
  const table = parseCsv(csvText);
  const map = new Map<string, CatalogEntry>();
  for (const row of table.rows) {
    const asset = row["asset_name"] ?? "";
    const column = row["column_name"] ?? "";
    if (!asset || !column) continue;
    map.set(columnKey(asset, column), {
      asset,
      column,
      business_description: row["business_description"] ?? "",
      data_owner: row["data_owner"] ?? "",
      sensitivity: row["sensitivity"] ?? "",
      upstream_asset: row["upstream_asset"] ?? "",
    });
  }
  return map;
}

export interface RuleIndex {
  activeKeys: Set<string>;
  typesByKey: Map<string, Set<string>>;
}

export function loadRules(csvText: string): RuleIndex {
  const table = parseCsv(csvText);
  const activeKeys = new Set<string>();
  const typesByKey = new Map<string, Set<string>>();
  for (const row of table.rows) {
    const asset = row["asset_name"] ?? "";
    const column = row["column_name"] ?? "";
    if (!asset || !column) continue;
    if ((row["status"] ?? "").toUpperCase() !== "ACTIVE") continue;
    const key = columnKey(asset, column);
    activeKeys.add(key);
    const set = typesByKey.get(key) ?? new Set<string>();
    set.add((row["rule_type"] ?? "").toUpperCase());
    typesByKey.set(key, set);
  }
  return { activeKeys, typesByKey };
}

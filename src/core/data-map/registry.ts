import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  EnterpriseDataMap,
  type BusinessDomain,
  type BusinessObject,
  type DataTable,
} from "@/core/data-map/types";

/**
 * Loads and validates the synthetic Enterprise Data Map. Pure and deterministic:
 * the file path is confined to the workspace root; content is validated at the boundary.
 */

const MAP_RELATIVE_PATH = join("demo_data", "enterprise_data_map.json");

export function loadDataMap(rootDir: string): EnterpriseDataMap {
  const raw = readFileSync(join(rootDir, MAP_RELATIVE_PATH), "utf8");
  return EnterpriseDataMap.parse(JSON.parse(raw));
}

export function objectsForDomain(map: EnterpriseDataMap, domainId: string): BusinessObject[] {
  return map.businessObjects.filter((o) => o.domainId === domainId);
}

export function tablesForObject(map: EnterpriseDataMap, objectId: string): DataTable[] {
  const obj = map.businessObjects.find((o) => o.id === objectId);
  if (!obj) return [];
  const byId = new Map(map.dataTables.map((tbl) => [tbl.id, tbl] as const));
  return obj.tableIds.map((id) => byId.get(id)).filter((tbl): tbl is DataTable => Boolean(tbl));
}

export function getObject(map: EnterpriseDataMap, objectId: string): BusinessObject | null {
  return map.businessObjects.find((o) => o.id === objectId) ?? null;
}

export function getDomainOf(map: EnterpriseDataMap, objectId: string): BusinessDomain | null {
  const obj = getObject(map, objectId);
  if (!obj) return null;
  return map.domains.find((d) => d.id === obj.domainId) ?? null;
}

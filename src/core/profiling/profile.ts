import type { CsvTable } from "@/core/ingestion/csv";

/**
 * Deterministic profiling metrics (cahier US-011). No LLM involvement.
 */

export interface ColumnProfile {
  column: string;
  count: number;
  nullCount: number;
  distinctCount: number;
}

const isNull = (v: string): boolean => v.trim() === "";

export function profileColumn(column: string, values: string[]): ColumnProfile {
  const nonNull = values.filter((v) => !isNull(v));
  return {
    column,
    count: values.length,
    nullCount: values.length - nonNull.length,
    distinctCount: new Set(nonNull).size,
  };
}

export function profileTable(table: CsvTable): ColumnProfile[] {
  return table.headers.map((h) =>
    profileColumn(
      h,
      table.rows.map((r) => r[h] ?? ""),
    ),
  );
}

export interface DuplicateReport {
  key: string;
  duplicateKeyCount: number;
  duplicateRowCount: number;
  groups: { value: string; count: number }[];
}

/** Rows sharing the same non-empty key value beyond the first occurrence are duplicates. */
export function detectDuplicates(rows: Record<string, string>[], key: string): DuplicateReport {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = (row[key] ?? "").trim();
    if (value === "") continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const groups = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0));
  const duplicateRowCount = groups.reduce((acc, g) => acc + g.count, 0);
  return { key, duplicateKeyCount: groups.length, duplicateRowCount, groups };
}

const DAY_MS = 86_400_000;

/** Age in whole days of the most recent date in the column relative to `now`. */
export function newestAgeDays(dates: string[], now: Date): number | null {
  const times = dates
    .map((d) => Date.parse(d))
    .filter((t) => !Number.isNaN(t));
  if (times.length === 0) return null;
  const newest = Math.max(...times);
  return Math.floor((now.getTime() - newest) / DAY_MS);
}

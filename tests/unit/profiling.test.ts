import { describe, it, expect } from "vitest";
import { parseCsv } from "@/core/ingestion/csv";
import { detectDuplicates, profileColumn, newestAgeDays } from "@/core/profiling/profile";

describe("CSV parsing", () => {
  it("parses headers and rows, trimming values", () => {
    const table = parseCsv("a,b\n1, x \n2,y\n");
    expect(table.headers).toEqual(["a", "b"]);
    expect(table.rows).toEqual([
      { a: "1", b: "x" },
      { a: "2", b: "y" },
    ]);
  });

  it("handles quoted fields with commas and escaped quotes", () => {
    const table = parseCsv('name,note\n"Acme, Inc","says ""hi"""\n');
    expect(table.rows[0]).toEqual({ name: "Acme, Inc", note: 'says "hi"' });
  });
});

describe("Profiling", () => {
  it("counts nulls and distinct values", () => {
    const p = profileColumn("email", ["a@x", "", "a@x", "b@y"]);
    expect(p).toEqual({ column: "email", count: 4, nullCount: 1, distinctCount: 2 });
  });

  it("detects duplicate keys", () => {
    const rows = [
      { id: "C-1" },
      { id: "C-2" },
      { id: "C-1" },
      { id: "" },
    ];
    const dup = detectDuplicates(rows, "id");
    expect(dup.duplicateKeyCount).toBe(1);
    expect(dup.duplicateRowCount).toBe(2);
    expect(dup.groups).toEqual([{ value: "C-1", count: 2 }]);
  });

  it("computes freshness age from the most recent date", () => {
    const age = newestAgeDays(["2026-06-01", "2026-06-26"], new Date("2026-09-15T00:00:00Z"));
    expect(age).toBe(81);
  });
});

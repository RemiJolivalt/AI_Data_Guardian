/**
 * Minimal, dependency-free CSV parser (deterministic). Handles quoted fields,
 * escaped quotes (""), commas in quotes, and CRLF/LF line endings.
 */
export interface CsvTable {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCsvCells(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  while (i < n) {
    const ch = text[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += ch;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function parseCsv(text: string): CsvTable {
  const cells = parseCsvCells(text).filter((r) => !(r.length === 1 && r[0] === ""));
  const headerRow = cells[0];
  if (!headerRow) {
    return { headers: [], rows: [] };
  }
  const headers = headerRow.map((h) => h.trim());
  const rows = cells.slice(1).map((cols) => {
    const rec: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rec[h] = (cols[idx] ?? "").trim();
    });
    return rec;
  });
  return { headers, rows };
}

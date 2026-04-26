import type { RawRecord } from "./file-parsers";
import { normalizeAddress } from "./address-normalization";

export type DedupedResult = {
  uniqueRows: RawRecord[];
  duplicateRows: RawRecord[];
};

export const buildDeduplicationKey = (row: RawRecord): string => {
  const name = String(row.name ?? "").trim().toLowerCase();
  const city = String(row.city ?? "").trim().toLowerCase();
  const address = normalizeAddress(String(row.address ?? ""));

  return `${name}::${address}::${city}`;
};

export const deduplicateRows = (rows: RawRecord[]): DedupedResult => {
  const seen = new Set<string>();
  const uniqueRows: RawRecord[] = [];
  const duplicateRows: RawRecord[] = [];

  for (const row of rows) {
    const key = buildDeduplicationKey(row);

    if (seen.has(key)) {
      duplicateRows.push(row);
      continue;
    }

    seen.add(key);
    uniqueRows.push(row);
  }

  return { uniqueRows, duplicateRows };
};

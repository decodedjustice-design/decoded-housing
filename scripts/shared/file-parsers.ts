import path from "node:path";

export type RawRecord = Record<string, string | number | boolean | null | undefined>;

const splitCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  out.push(current.trim());
  return out;
};

export const parseCsvText = (csvText: string): RawRecord[] => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return headers.reduce<RawRecord>((record, header, index) => {
      record[header] = values[index] ?? "";
      return record;
    }, {});
  });
};

/**
 * Pipeline structure hook for future Excel parsing.
 * Intentionally not implemented until we pick a workbook library.
 */
export const parseExcelBuffer = (_buffer: Buffer): RawRecord[] => {
  throw new Error(
    "Excel parsing is not enabled yet. Add a workbook parser (e.g. xlsx) before ingesting .xls/.xlsx files.",
  );
};

export const parseInputFile = (filePath: string, fileContents: string | Buffer): RawRecord[] => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".csv") {
    const text = typeof fileContents === "string" ? fileContents : fileContents.toString("utf8");
    return parseCsvText(text);
  }

  if (extension === ".xls" || extension === ".xlsx") {
    const buffer = Buffer.isBuffer(fileContents) ? fileContents : Buffer.from(fileContents, "utf8");
    return parseExcelBuffer(buffer);
  }

  throw new Error(`Unsupported input format: ${extension || "(no extension)"}`);
};

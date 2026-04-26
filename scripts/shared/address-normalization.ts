import type { RawRecord } from "./file-parsers";

const normalizeWhitespace = (input: string): string => input.replace(/\s+/g, " ").trim();

const normalizeStreetTerms = (input: string): string =>
  input
    .replace(/\bstreet\b/gi, "St")
    .replace(/\bavenue\b/gi, "Ave")
    .replace(/\bboulevard\b/gi, "Blvd")
    .replace(/\broad\b/gi, "Rd")
    .replace(/\bdrive\b/gi, "Dr");

export const normalizeAddress = (value: string): string => {
  const cleaned = normalizeWhitespace(value).toUpperCase();
  return normalizeStreetTerms(cleaned);
};

export const normalizeAddressFields = (row: RawRecord, fieldNames: string[] = ["address"]): RawRecord => {
  const output = { ...row };

  for (const fieldName of fieldNames) {
    const current = output[fieldName];
    if (typeof current === "string" && current.trim()) {
      output[fieldName] = normalizeAddress(current);
    }
  }

  return output;
};

import type { RawRecord } from "./file-parsers";
import { PropertySchema, type Property } from "./property-schema";

const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  return ["true", "yes", "y", "1"].includes(normalized);
};

/**
 * Maps raw source records into the Property schema used in the app.
 */
export const toProperty = (row: RawRecord): Property => {
  const mapped = {
    id: row.id ?? row.property_id ?? `${row.name ?? "property"}-${row.city ?? "unknown"}`,
    name: String(row.name ?? row.property_name ?? "").trim(),
    city: String(row.city ?? "").trim(),
    ami: String(row.ami ?? row.ami_range ?? "").trim(),
    beds: String(row.beds ?? row.unit_sizes ?? "").trim(),
    vouchers: toBoolean(row.vouchers ?? row.voucher_accepted ?? false),
  };

  return PropertySchema.parse(mapped);
};

export const toPropertyBatch = (rows: RawRecord[]): Property[] => rows.map(toProperty);

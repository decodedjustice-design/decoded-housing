#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(REPO_ROOT, "data", "templates", "housing-import-template.csv");

const REQUIRED_FIELDS = [
  "external_property_id",
  "property_name",
  "city",
  "state",
  "program_type",
  "waitlist_status",
  "availability_status",
  "verification_status",
];

const REQUIRED_SOURCE_FIELDS = ["source_url", "source_label"];
const ALLOWED_EXTRA_HEADERS = new Set();

const ALLOWED_VALUES = {
  verification_status: new Set(["pending_review", "unverified"]),
  program_type: new Set([
    "affordable_housing",
    "housing_choice_voucher",
    "lihtc",
    "mfte",
    "mixed_income",
    "other",
    "permanent_supportive_housing",
    "project_based_voucher",
    "public_housing",
    "senior",
    "unknown",
  ]),
  waitlist_status: new Set(["call_to_confirm", "closed", "open", "unknown"]),
  availability_status: new Set([
    "available",
    "call_to_confirm",
    "no_known_availability",
    "unknown",
    "waitlist_only",
  ]),
};

const SENSITIVE_NOTES_MARKERS = [
  "client",
  "intake",
  "dv",
  "safety address",
  "private",
  "staff only",
];

const FORMULA_PREFIXES = ["=", "+", "-", "@"];

const formatAllowed = (values) => [...values].sort().join(", ");

const parseCsv = (text) => {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (inQuotes) {
    throw new Error("CSV has an unterminated quoted field.");
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((value) => value.trim().length > 0));
};

const readCsv = async (filePath) => parseCsv(await readFile(filePath, "utf8"));

const duplicateHeaders = (headers) => {
  const counts = new Map();
  const duplicates = new Set();

  for (const header of headers) {
    const count = counts.get(header) ?? 0;
    counts.set(header, count + 1);
    if (count > 0) {
      duplicates.add(header);
    }
  }

  return [...duplicates];
};

const toRowObject = (headers, values) =>
  Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));

const hasValue = (value) => typeof value === "string" && value.trim().length > 0;

const normalizeValue = (value) => value.trim().toLowerCase();

const validateHeaders = (templateHeaders, candidateHeaders, errors) => {
  const templateSet = new Set(templateHeaders);
  const candidateSet = new Set(candidateHeaders);
  const missingHeaders = templateHeaders.filter((header) => !candidateSet.has(header));
  const unknownHeaders = candidateHeaders.filter(
    (header) => !templateSet.has(header) && !ALLOWED_EXTRA_HEADERS.has(header),
  );
  const duplicateCandidateHeaders = duplicateHeaders(candidateHeaders);

  for (const header of missingHeaders) {
    errors.push(`Missing required template header: ${header}`);
  }

  for (const header of unknownHeaders) {
    errors.push(`Unknown header is not allowed: ${header}`);
  }

  for (const header of duplicateCandidateHeaders) {
    errors.push(`Duplicate header is not allowed: ${header}`);
  }
};

const validateExternalPropertyId = (rowNumber, value, errors) => {
  const trimmedValue = value.trim();

  if (!hasValue(trimmedValue)) {
    return;
  }

  if (/^[+-]?\d+(?:\.\d+)?e[+-]?\d+$/i.test(trimmedValue)) {
    errors.push(
      `Row ${rowNumber}: external_property_id appears to be scientific notation; preserve IDs as plain text before staging.`,
    );
  }

  if (/^\d+\.\d+$/.test(trimmedValue)) {
    errors.push(
      `Row ${rowNumber}: external_property_id appears to be a decimal number; preserve the source ID exactly as text.`,
    );
  }

  if (FORMULA_PREFIXES.some((prefix) => trimmedValue.startsWith(prefix))) {
    errors.push(
      `Row ${rowNumber}: external_property_id must not start with a spreadsheet formula character.`,
    );
  }
};

const validateSensitiveNotes = (rowNumber, value, errors) => {
  const normalizedNotes = value.toLowerCase();

  for (const marker of SENSITIVE_NOTES_MARKERS) {
    const escapedMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const markerPattern =
      marker === "dv" ? new RegExp("(^|[^a-z])dv([^a-z]|$)", "i") : new RegExp(escapedMarker, "i");

    if (markerPattern.test(normalizedNotes)) {
      errors.push(
        `Row ${rowNumber}: notes_public contains possible private/sensitive marker: ${marker}`,
      );
    }
  }
};

const validateRows = (headers, rows, errors) => {
  rows.forEach((values, index) => {
    const rowNumber = index + 2;
    const row = toRowObject(headers, values);

    if (values.length !== headers.length) {
      errors.push(
        `Row ${rowNumber}: expected ${headers.length} columns but found ${values.length}.`,
      );
    }

    for (const field of REQUIRED_FIELDS) {
      if (!hasValue(row[field])) {
        errors.push(`Row ${rowNumber}: required field is blank: ${field}`);
      }
    }

    if (!REQUIRED_SOURCE_FIELDS.some((field) => hasValue(row[field]))) {
      errors.push(`Row ${rowNumber}: either source_url or source_label must be present.`);
    }

    for (const [field, allowedValues] of Object.entries(ALLOWED_VALUES)) {
      if (!hasValue(row[field])) {
        continue;
      }

      const value = normalizeValue(row[field]);
      if (!allowedValues.has(value)) {
        errors.push(
          `Row ${rowNumber}: ${field} must be one of: ${formatAllowed(allowedValues)}. Found: ${row[field]}`,
        );
      }
    }

    if (normalizeValue(row.verification_status ?? "") === "verified") {
      errors.push(
        "Row " +
          rowNumber +
          ": verification_status cannot start as verified; use pending_review or unverified.",
      );
    }

    validateExternalPropertyId(rowNumber, row.external_property_id ?? "", errors);
    validateSensitiveNotes(rowNumber, row.notes_public ?? "", errors);
  });
};

const usage = () => {
  console.error("Usage: node scripts/validate-housing-import-template.mjs <path-to-candidate.csv>");
};

const main = async () => {
  const [, , candidatePathArg] = process.argv;

  if (!candidatePathArg) {
    usage();
    process.exitCode = 2;
    return;
  }

  const candidatePath = path.resolve(process.cwd(), candidatePathArg);
  const errors = [];
  const [templateRows, candidateRows] = await Promise.all([
    readCsv(TEMPLATE_PATH),
    readCsv(candidatePath),
  ]);

  if (templateRows.length === 0) {
    throw new Error(`Template is empty: ${TEMPLATE_PATH}`);
  }

  if (candidateRows.length === 0) {
    errors.push("Candidate CSV is empty and must include the template header row.");
  } else {
    const [templateHeaders] = templateRows;
    const [candidateHeaders, ...candidateDataRows] = candidateRows;

    validateHeaders(templateHeaders, candidateHeaders, errors);
    validateRows(candidateHeaders, candidateDataRows, errors);
  }

  if (errors.length > 0) {
    console.error(`Housing import preflight failed for ${candidatePath}:`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Housing import preflight passed for ${candidatePath}.`);
  console.log(
    "Result means staging-safe for human review only; it does not verify records or make them public-ready.",
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

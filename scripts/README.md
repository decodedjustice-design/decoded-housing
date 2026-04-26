# Data Ingestion Pipeline Scaffold

This directory contains the **pipeline structure only** for importing housing listings into Decoded Housing.

## Current structure

- `ingest-properties.ts`
  - Entrypoint scaffold that wires parser -> normalization -> deduplication -> schema mapping.
  - Exposes `runIngestionPipeline(...)` for future CLI or job execution.

- `shared/`
  - `file-parsers.ts`
    - `parseCsvText(...)` for CSV sources.
    - `parseExcelBuffer(...)` placeholder for `.xls/.xlsx` support (not enabled yet).
    - `parseInputFile(...)` dispatcher by file extension.
  - `address-normalization.ts`
    - `normalizeAddress(...)` and `normalizeAddressFields(...)`.
  - `deduplication.ts`
    - `buildDeduplicationKey(...)` and `deduplicateRows(...)`.
  - `property-schema.ts`
    - Zod `PropertySchema` and `Property` type.
  - `property-transform.ts`
    - `toProperty(...)` and `toPropertyBatch(...)` to enforce output shape.
  - `index.ts`
    - Re-exports all shared helpers.

## Important

No source files are read in production flows yet, and no data is ingested by default.

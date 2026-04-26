/**
 * Pipeline entrypoint scaffold.
 *
 * NOTE: This file intentionally does not ingest data yet.
 * It only wires the planned ingestion stages.
 */
import {
  deduplicateRows,
  normalizeAddressFields,
  parseInputFile,
  toPropertyBatch,
  type Property,
  type RawRecord,
} from "./shared";

export type PipelineResult = {
  normalizedRows: RawRecord[];
  duplicateRows: RawRecord[];
  properties: Property[];
};

export const runIngestionPipeline = (filePath: string, contents: string | Buffer): PipelineResult => {
  const rows = parseInputFile(filePath, contents);
  const normalizedRows = rows.map((row) => normalizeAddressFields(row, ["address", "street_address"]));
  const { uniqueRows, duplicateRows } = deduplicateRows(normalizedRows);
  const properties = toPropertyBatch(uniqueRows);

  return {
    normalizedRows: uniqueRows,
    duplicateRows,
    properties,
  };
};

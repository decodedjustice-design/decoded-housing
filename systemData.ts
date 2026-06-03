/**
 * SYSTEM DATA INDEX
 * Single import point for all 3 layers of the Shelter Finder system.
 *
 * Layer 1 — Immediate Shelter  ✅ Loaded (18 records)
 * Layer 2 — Housing            ⏳ Awaiting dataset
 * Layer 3 — Government         ⏳ Awaiting dataset
 *
 * DO NOT add placeholder data. Only loaded datasets are used.
 */

export { LAYER1_SHELTER, LAYER1_BY_ID, LAYER1_META } from './layer1_shelter';
export type { Layer1Record, AccessSpeed, BarrierLevel, ReferralRequired, EntryType, CountyArea, PopulationServed } from './layer1_shelter';

// Layer 2 — Housing (placeholder export — populated when dataset is loaded)
export const LAYER2_HOUSING: never[] = [];
export const LAYER2_META = { record_count: 0, loaded_at: null, source: 'Awaiting dataset', layer: 2 };

// Layer 3 — Government (placeholder export — populated when dataset is loaded)
export const LAYER3_GOVERNMENT: never[] = [];
export const LAYER3_META = { record_count: 0, loaded_at: null, source: 'Awaiting dataset', layer: 3 };

/** System-wide status summary */
export const SYSTEM_STATUS = {
  layers_loaded: 1,
  layers_pending: 2,
  total_records: 18,
  ready: false, // becomes true when all 3 layers are loaded
} as const;

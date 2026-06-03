/**
 * DECISION ENGINE — Layer 1 Immediate Shelter
 * Source: Layer 1 dataset (18 records, loaded 2026-04-23)
 *
 * Ranking rules (in order):
 *   1. priority_score DESC
 *   2. access_speed: immediate(0) > same_day(1) > delayed(2)
 *   3. barrier_level: low(0) > medium(1) > high(2)
 *   4. Deprioritize: referral_required=yes OR barrier_level=high → pushed to backup tier
 */

import { LAYER1_SHELTER, Layer1Record, PopulationServed, CountyArea } from '@/data/layer1_shelter';

export interface UserInput {
  population: PopulationServed | 'not_sure';
  county_area: CountyArea | 'not_sure';
  situation: 'outside' | 'vehicle' | 'shelter_already' | 'couch' | 'not_sure';
}

export interface RankedResults {
  best: Layer1Record | null;        // Card 1 — single top result
  next: Layer1Record[];             // Card 2 — next 2–4
  backup: Layer1Record[];           // Card 3 — deprioritized
}

const SPEED_RANK: Record<string, number> = {
  immediate: 0,
  same_day: 1,
  delayed: 2,
};

const BARRIER_RANK: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

/** Returns true if a record matches the user's population */
function matchesPopulation(record: Layer1Record, pop: PopulationServed | 'not_sure'): boolean {
  if (pop === 'not_sure') return true;
  // "All" records match everyone
  if (record.population_served.includes('All')) return true;
  return record.population_served.includes(pop);
}

/** Returns true if a record matches the user's county area */
function matchesArea(record: Layer1Record, area: CountyArea | 'not_sure'): boolean {
  if (area === 'not_sure') return true;
  if (record.county_area === 'Countywide') return true;
  return record.county_area === area;
}

/** Returns true if a record is deprioritized (backup tier) */
function isBackup(record: Layer1Record): boolean {
  return record.referral_required === 'yes' || record.barrier_level === 'high';
}

/** Core ranking comparator */
function rankCompare(a: Layer1Record, b: Layer1Record): number {
  // 1. priority_score DESC
  if (b.priority_score !== a.priority_score) return b.priority_score - a.priority_score;
  // 2. access_speed ASC (immediate first)
  const speedDiff = SPEED_RANK[a.access_speed] - SPEED_RANK[b.access_speed];
  if (speedDiff !== 0) return speedDiff;
  // 3. barrier_level ASC (low first)
  return BARRIER_RANK[a.barrier_level] - BARRIER_RANK[b.barrier_level];
}

/**
 * Run the decision engine.
 * Returns pre-sorted, tiered results from the Layer 1 dataset only.
 */
export function runDecisionEngine(input: UserInput): RankedResults {
  // Filter by population + area
  const matched = LAYER1_SHELTER.filter(r =>
    matchesPopulation(r, input.population) &&
    matchesArea(r, input.county_area)
  );

  // Split into primary vs backup
  const primary = matched.filter(r => !isBackup(r)).sort(rankCompare);
  const backup = matched.filter(r => isBackup(r)).sort(rankCompare);

  // If no primary options exist, promote backup to primary
  const effectivePrimary = primary.length > 0 ? primary : backup;
  const effectiveBackup = primary.length > 0 ? backup : [];

  return {
    best: effectivePrimary[0] ?? null,
    next: effectivePrimary.slice(1, 5),   // up to 4 next options
    backup: effectiveBackup,
  };
}

/** Convenience: remove a dismissed record and re-run */
export function rerunWithout(input: UserInput, excludeIds: string[]): RankedResults {
  const filtered = LAYER1_SHELTER.filter(r => !excludeIds.includes(r.id));
  const matched = filtered.filter(r =>
    matchesPopulation(r, input.population) &&
    matchesArea(r, input.county_area)
  );

  const primary = matched.filter(r => !isBackup(r)).sort(rankCompare);
  const backup = matched.filter(r => isBackup(r)).sort(rankCompare);

  const effectivePrimary = primary.length > 0 ? primary : backup;
  const effectiveBackup = primary.length > 0 ? backup : [];

  return {
    best: effectivePrimary[0] ?? null,
    next: effectivePrimary.slice(1, 5),
    backup: effectiveBackup,
  };
}

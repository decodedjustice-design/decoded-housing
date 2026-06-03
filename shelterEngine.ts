/**
 * SHELTER DECISION ENGINE — v2
 * Dynamic ranking based on master dataset v2.
 *
 * Ranking rules (in order):
 *   1. Emergency activation override (category = "Emergency activation" AND active)
 *   2. Filter by population_served + county_area
 *   3. Sort by: priority_score DESC → access_speed (immediate > same_day > delayed) → barrier_level (low > medium > high)
 *   4. Deprioritize referral_required=yes + barrier_level=high (unless no alternatives)
 *   5. RAP shown ONLY if no high-priority immediate shelters available
 *   6. Feedback loop: excluded IDs are removed and engine re-runs
 */

import {
  SORTED_RESOURCES,
  RAP_RESOURCES,
  ShelterResource,
  Population,
  AccessSpeed,
  BarrierLevel,
  CountyArea,
} from '@/data/shelters';

// ── TYPES ──────────────────────────────────────────────────────────────────

export type UserPopulation =
  | 'family' | 'single_adult' | 'youth' | 'DV' | 'veteran' | 'vehicle' | 'all';

export interface EngineInput {
  population: UserPopulation;
  county_area?: CountyArea | 'any';
  excluded_ids?: string[];          // IDs the user said "didn't work"
  severe_weather_active?: boolean;
}

export interface RankedCard {
  type: 'best' | 'next' | 'rap' | 'backup';
  resources: ShelterResource[];
  label: string;
  description: string;
  show_rap_disclaimer?: boolean;
}

export interface EngineResult {
  cards: RankedCard[];
  has_immediate_options: boolean;
  show_safe_parking: boolean;
  total_matched: number;
}

// ── SPEED RANK ─────────────────────────────────────────────────────────────
const SPEED_RANK: Record<AccessSpeed, number> = {
  immediate: 3,
  same_day: 2,
  delayed: 1,
};

const BARRIER_RANK: Record<BarrierLevel, number> = {
  low: 3,
  medium: 2,
  high: 1,
};

// ── POPULATION MATCH ────────────────────────────────────────────────────────
function matchesPopulation(resource: ShelterResource, pop: UserPopulation): boolean {
  const rp = resource.population_served;
  if (rp.includes('all')) return true;
  if (pop === 'all') return true;
  if (pop === 'family') return rp.includes('family');
  if (pop === 'single_adult') return rp.includes('single_adult') || rp.includes('men') || rp.includes('women');
  if (pop === 'youth') return rp.includes('youth');
  if (pop === 'DV') return rp.includes('DV');
  if (pop === 'veteran') return rp.includes('single_adult') || rp.includes('all');
  if (pop === 'vehicle') return rp.includes('vehicle');
  return false;
}

// ── SORT COMPARATOR ─────────────────────────────────────────────────────────
function sortResources(a: ShelterResource, b: ShelterResource): number {
  if (b.priority_score !== a.priority_score) return b.priority_score - a.priority_score;
  const speedDiff = SPEED_RANK[b.access_speed] - SPEED_RANK[a.access_speed];
  if (speedDiff !== 0) return speedDiff;
  return BARRIER_RANK[b.barrier_level] - BARRIER_RANK[a.barrier_level];
}

// ── MAIN ENGINE ─────────────────────────────────────────────────────────────
export function runDecisionEngine(input: EngineInput): EngineResult {
  const { population, county_area = 'any', excluded_ids = [], severe_weather_active = false } = input;
  const excluded = new Set(excluded_ids);

  // ── STEP 1: Emergency activation override ──────────────────────────────
  if (severe_weather_active) {
    const emergency = SORTED_RESOURCES.find(r => r.category === 'Emergency activation');
    if (emergency && !excluded.has(emergency.id)) {
      // Still run normal engine for fallback, but put emergency first
      const normal = runNormalEngine({ ...input, severe_weather_active: false });
      return {
        ...normal,
        cards: [
          {
            type: 'best',
            resources: [emergency],
            label: '🚨 Emergency Shelter Open Tonight',
            description: 'Severe weather shelters are currently activated in King County. Go here first.',
          },
          ...normal.cards.map(c => ({ ...c, type: 'backup' as const })),
        ],
      };
    }
  }

  return runNormalEngine(input);
}

function runNormalEngine(input: EngineInput): EngineResult {
  const { population, county_area = 'any', excluded_ids = [] } = input;
  const excluded = new Set(excluded_ids);

  // ── STEP 2: Filter by population + county_area ─────────────────────────
  const isVehicle = population === 'vehicle';

  let pool = SORTED_RESOURCES.filter(r => {
    if (excluded.has(r.id)) return false;
    if (r.category === 'Emergency activation') return false;
    if (r.category === 'Regional Access Point') return false;
    if (r.category === 'Safe parking') return isVehicle;
    if (!matchesPopulation(r, population)) return false;
    if (county_area !== 'any' && r.county_area !== 'Countywide' && r.county_area !== county_area) return false;
    return true;
  });

  // ── STEP 3: Sort ────────────────────────────────────────────────────────
  pool = [...pool].sort(sortResources);

  // ── STEP 4: Deprioritize high-barrier + referral-required ───────────────
  const preferred = pool.filter(r => !(r.barrier_level === 'high' && r.referral_required === 'yes'));
  const highBarrier = pool.filter(r => r.barrier_level === 'high' && r.referral_required === 'yes');
  const ranked = preferred.length > 0 ? [...preferred, ...highBarrier] : pool;

  // ── STEP 5: Determine if RAP is needed ─────────────────────────────────
  const immediateOptions = ranked.filter(
    r => r.access_speed === 'immediate' && r.barrier_level !== 'high'
  );
  const hasImmediateOptions = immediateOptions.length > 0;

  // ── STEP 6: Build 4 cards ───────────────────────────────────────────────
  const cards: RankedCard[] = [];

  // Card 1 — Best immediate option
  if (ranked.length > 0) {
    cards.push({
      type: 'best',
      resources: [ranked[0]],
      label: 'Best Immediate Option',
      description: `Highest priority match for your situation. ${ranked[0].how_to_enter}`,
    });
  }

  // Card 2 — Next best (2–4 options)
  if (ranked.length > 1) {
    cards.push({
      type: 'next',
      resources: ranked.slice(1, 5),
      label: 'Next Best Options',
      description: 'Additional resources ranked by likelihood of success.',
    });
  }

  // Card 3 — RAP (only if no high-priority immediate shelters)
  if (!hasImmediateOptions) {
    const rapPool = RAP_RESOURCES.filter(r => {
      if (excluded.has(r.id)) return false;
      if (county_area !== 'any' && r.county_area !== 'Countywide' && r.county_area !== county_area) return false;
      return true;
    }).sort(sortResources);

    if (rapPool.length > 0) {
      cards.push({
        type: 'rap',
        resources: rapPool.slice(0, 3),
        label: 'Coordinated Entry (RAP)',
        description: 'No immediate shelter options matched. These access points connect you to longer-term housing assessment.',
        show_rap_disclaimer: true,
      });
    }
  }

  // Card 4 — Backup plan (delayed / high-barrier options)
  const backups = ranked.filter(
    r => r.access_speed === 'delayed' || r.barrier_level === 'high'
  ).slice(0, 3);

  if (backups.length > 0 && ranked.length > 1) {
    cards.push({
      type: 'backup',
      resources: backups,
      label: 'Backup Plan',
      description: 'These options have longer wait times or higher barriers, but may have availability.',
    });
  }

  return {
    cards,
    has_immediate_options: hasImmediateOptions,
    show_safe_parking: isVehicle,
    total_matched: ranked.length,
  };
}

// ── FEEDBACK: remove a resource and re-run ──────────────────────────────────
export function rerunWithFeedback(
  input: EngineInput,
  failedResourceId: string
): EngineResult {
  return runDecisionEngine({
    ...input,
    excluded_ids: [...(input.excluded_ids ?? []), failedResourceId],
  });
}

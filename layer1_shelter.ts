/**
 * LAYER 1 — IMMEDIATE SHELTER
 * Source: User-provided master dataset (loaded 2026-04-23)
 * Records: 18
 * DO NOT modify without a new dataset upload. This is the sole source of truth.
 *
 * Fields normalized:
 *  - access_speed: "immediate" | "same_day" | "delayed"
 *  - barrier_level: "low" | "medium" | "high"
 *  - referral_required: "yes" | "no" | "sometimes"
 *  - county_area: "Countywide" | "Seattle" | "East King" | "South King" | "North King"
 */

export type AccessSpeed = 'immediate' | 'same_day' | 'delayed';
export type BarrierLevel = 'low' | 'medium' | 'high';
export type ReferralRequired = 'yes' | 'no' | 'sometimes';
export type EntryType = 'call' | 'walk-in' | 'scheduled' | 'referral' | 'screened';
export type CountyArea = 'Countywide' | 'Seattle' | 'East King' | 'South King' | 'North King';
export type PopulationServed =
  | 'Families'
  | 'Adults'
  | 'Youth'
  | 'All'
  | 'Men'
  | 'Women'
  | 'Vehicle dwellers';

export interface Layer1Record {
  id: string;                        // slug derived from program_name
  program_name: string;
  category: string;
  population_served: PopulationServed[];
  priority_score: number;            // 1–10
  access_speed: AccessSpeed;
  barrier_level: BarrierLevel;
  referral_required: ReferralRequired;
  service_level: string;
  entry_type: EntryType;
  contact_details: string;
  how_to_enter: string;
  address: string;
  county_area: CountyArea;
}

/** Normalize population_served string → typed array */
function pop(raw: string): PopulationServed[] {
  const map: Record<string, PopulationServed> = {
    families: 'Families',
    adults: 'Adults',
    youth: 'Youth',
    all: 'All',
    men: 'Men',
    women: 'Women',
    'vehicle dwellers': 'Vehicle dwellers',
  };
  return raw
    .split('/')
    .map(s => map[s.trim().toLowerCase()])
    .filter(Boolean) as PopulationServed[];
}

/** Derive a stable slug id from program name */
function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const RAW: Array<Omit<Layer1Record, 'id' | 'population_served'> & { population_served: string }> = [
  {
    program_name: 'King County Emergency Family Shelter Intake Line',
    category: 'Family intake',
    population_served: 'Families',
    priority_score: 10,
    access_speed: 'immediate',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'navigation',
    entry_type: 'call',
    contact_details: '(206) 245-1026',
    how_to_enter: 'Call for same-day screening',
    address: 'King County',
    county_area: 'Countywide',
  },
  {
    program_name: "Mary's Place Shelter Network",
    category: 'Family shelter',
    population_served: 'Families',
    priority_score: 10,
    access_speed: 'same_day',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'call',
    contact_details: '(206) 245-1026',
    how_to_enter: 'Call intake line',
    address: 'King County',
    county_area: 'Countywide',
  },
  {
    program_name: 'Operation Nightwatch',
    category: 'Emergency shelter',
    population_served: 'Adults',
    priority_score: 9,
    access_speed: 'immediate',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'walk-in',
    contact_details: '(206) 323-4359',
    how_to_enter: 'Drop-in evenings',
    address: 'Seattle',
    county_area: 'Seattle',
  },
  {
    program_name: 'ROOTS Young Adult Shelter',
    category: 'Emergency shelter',
    population_served: 'Youth',
    priority_score: 9,
    access_speed: 'immediate',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'walk-in',
    contact_details: '(206) 632-1635',
    how_to_enter: 'Arrive 8pm–8:30pm',
    address: 'Seattle',
    county_area: 'Seattle',
  },
  {
    program_name: 'LifeWire DV Shelter',
    category: 'Domestic violence',
    population_served: 'All',
    priority_score: 10,
    access_speed: 'immediate',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'call',
    contact_details: '(425) 746-1940',
    how_to_enter: 'Call hotline',
    address: 'King County',
    county_area: 'Countywide',
  },
  {
    program_name: 'DAWN DV Shelter',
    category: 'Domestic violence',
    population_served: 'Families',
    priority_score: 10,
    access_speed: 'immediate',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'call',
    contact_details: '(425) 656-7867',
    how_to_enter: 'Call intake',
    address: 'Kent',
    county_area: 'South King',
  },
  {
    program_name: 'Safe Place Youth Hotline',
    category: 'Youth hotline',
    population_served: 'Youth',
    priority_score: 10,
    access_speed: 'immediate',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'navigation',
    entry_type: 'call',
    contact_details: '1-800-422-8336',
    how_to_enter: 'Call or text',
    address: 'King County',
    county_area: 'Countywide',
  },
  {
    program_name: 'Seattle Union Gospel Mission',
    category: 'Emergency shelter',
    population_served: 'Men',
    priority_score: 8,
    access_speed: 'same_day',
    barrier_level: 'medium',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'walk-in',
    contact_details: '(206) 622-5177',
    how_to_enter: 'First-come intake',
    address: 'Seattle',
    county_area: 'Seattle',
  },
  {
    program_name: 'New Horizons Shelter',
    category: 'Emergency shelter',
    population_served: 'Youth',
    priority_score: 8,
    access_speed: 'same_day',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'walk-in',
    contact_details: '(206) 374-0866',
    how_to_enter: 'Call or drop-in',
    address: 'Seattle',
    county_area: 'Seattle',
  },
  {
    program_name: 'YouthCare Shelter',
    category: 'Emergency shelter',
    population_served: 'Youth',
    priority_score: 8,
    access_speed: 'same_day',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'walk-in',
    contact_details: '(206) 331-2363',
    how_to_enter: 'Night intake',
    address: 'Seattle',
    county_area: 'Seattle',
  },
  {
    program_name: 'Bread of Life Mission',
    category: 'Emergency shelter',
    population_served: 'Men',
    priority_score: 7,
    access_speed: 'same_day',
    barrier_level: 'low',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'walk-in',
    contact_details: '(206) 682-3579',
    how_to_enter: 'Walk-in',
    address: 'Seattle',
    county_area: 'Seattle',
  },
  {
    program_name: 'Sophia Way Shelter',
    category: 'Emergency shelter',
    population_served: 'Women',
    priority_score: 7,
    access_speed: 'delayed',
    barrier_level: 'medium',
    referral_required: 'yes',
    service_level: 'emergency',
    entry_type: 'call',
    contact_details: '(425) 598-2608',
    how_to_enter: 'Call intake',
    address: 'Bellevue',
    county_area: 'East King',
  },
  {
    program_name: 'YWCA Pathways for Women',
    category: 'Emergency shelter',
    population_served: 'Women',
    priority_score: 7,
    access_speed: 'same_day',
    barrier_level: 'medium',
    referral_required: 'yes',
    service_level: 'transitional',
    entry_type: 'call',
    contact_details: '(425) 774-9843',
    how_to_enter: 'Call intake',
    address: 'Lynnwood',
    county_area: 'North King',
  },
  {
    program_name: 'SHARE/WHEEL Screening',
    category: 'Intake',
    population_served: 'Adults',
    priority_score: 6,
    access_speed: 'delayed',
    barrier_level: 'medium',
    referral_required: 'no',
    service_level: 'navigation',
    entry_type: 'scheduled',
    contact_details: '(206) 448-7889',
    how_to_enter: 'Attend screening',
    address: 'Seattle',
    county_area: 'Seattle',
  },
  {
    program_name: 'PorchLight Shelter',
    category: 'Emergency shelter',
    population_served: 'Men',
    priority_score: 5,
    access_speed: 'delayed',
    barrier_level: 'high',
    referral_required: 'no',
    service_level: 'emergency',
    entry_type: 'screened',
    contact_details: '(425) 698-1295',
    how_to_enter: 'Screening required',
    address: 'Bellevue',
    county_area: 'East King',
  },
  {
    program_name: 'Hospitality House Shelter',
    category: 'Emergency shelter',
    population_served: 'Women',
    priority_score: 4,
    access_speed: 'delayed',
    barrier_level: 'high',
    referral_required: 'yes',
    service_level: 'transitional',
    entry_type: 'call',
    contact_details: '(206) 242-1860',
    how_to_enter: 'Phone screening',
    address: 'Burien',
    county_area: 'South King',
  },
  {
    program_name: 'Anchor Shelter System',
    category: 'Emergency shelter',
    population_served: 'All',
    priority_score: 8,
    access_speed: 'same_day',
    barrier_level: 'medium',
    referral_required: 'sometimes',
    service_level: 'emergency',
    entry_type: 'referral',
    contact_details: '(253) 893-7895',
    how_to_enter: 'Call or referral',
    address: 'Federal Way',
    county_area: 'South King',
  },
  {
    program_name: 'Safe Parking Programs',
    category: 'Safe parking',
    population_served: 'Vehicle dwellers',
    priority_score: 8,
    access_speed: 'same_day',
    barrier_level: 'low',
    referral_required: 'sometimes',
    service_level: 'emergency',
    entry_type: 'referral',
    contact_details: '211',
    how_to_enter: 'Referral required',
    address: 'King County',
    county_area: 'Countywide',
  },
];

/** Parsed, normalized Layer 1 records — deduplicated by program_name */
export const LAYER1_SHELTER: Layer1Record[] = (() => {
  const seen = new Set<string>();
  return RAW
    .filter(r => {
      const key = r.program_name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(r => ({
      ...r,
      id: slug(r.program_name),
      population_served: pop(r.population_served),
    }))
    .sort((a, b) => b.priority_score - a.priority_score);
})();

/** Quick lookup by id */
export const LAYER1_BY_ID = new Map(LAYER1_SHELTER.map(r => [r.id, r]));

/** Dataset metadata */
export const LAYER1_META = {
  record_count: LAYER1_SHELTER.length,
  loaded_at: '2026-04-23',
  source: 'User-provided CSV — Layer 1 Immediate Shelter',
  layer: 1,
} as const;

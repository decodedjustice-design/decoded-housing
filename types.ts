export type HousingType = 'ARCH' | 'MFTE' | 'Section 8' | 'Transitional' | 'Shelter';
export type UnitType = 'Studio' | '1BR' | '2BR' | '3BR' | '4BR+';

export interface Property {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  address: string;
  lat: number;
  lng: number;
  housing_types: HousingType[];
  unit_types: UnitType[];
  total_units: number;
  affordable_units: number;
  ami_levels: string[];
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  notes: string;
  insider_tip: string;
  verified: boolean;
  has_waitlist: boolean;
  waitlist_details: string;
  upcoming_units: boolean;
  last_verified: string;
  source: string;
  status: string;
  year_built: number | null;
  likely_available: boolean;
  // PRR enrichment fields (from PRR_AllUnits_Properties spreadsheet)
  prr_jurisdiction?: string;
  prr_status?: 'In Service' | 'In Development';
  prr_total_units?: number;
  prr_market_units?: number;
  prr_affordable_units?: number;
  prr_ami_breakdown?: Record<string, number>;
  prr_ami_tiers?: string[];
  prr_has_lost_affordability?: boolean;
  prr_short_term_units?: number;
  prr_matched?: boolean;
}

export interface SearchFilters {
  query: string;
  city: string;
  housing_types: HousingType[];
  unit_types: UnitType[];
  verified_only: boolean;
  has_waitlist: boolean;
  likely_available: boolean;
}

export const HOUSING_TYPE_COLORS: Record<HousingType, { bg: string; text: string; border: string; label: string }> = {
  'ARCH': { bg: '#D8F3DC', text: '#1B4332', border: '#95D5A3', label: 'ARCH' },
  'MFTE': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D', label: 'MFTE' },
  'Section 8': { bg: '#DBEAFE', text: '#1E3A8A', border: '#93C5FD', label: 'Section 8' },
  'Transitional': { bg: '#EDE9FE', text: '#4C1D95', border: '#C4B5FD', label: 'Transitional' },
  'Shelter': { bg: '#FFE4E6', text: '#9F1239', border: '#FCA5A5', label: 'Shelter' },
};

export const CITIES = ['Bellevue', 'Kirkland', 'Redmond', 'Issaquah', 'Sammamish', 'Mercer Island', 'Kenmore', 'Bothell'];
export const HOUSING_TYPES: HousingType[] = ['ARCH', 'MFTE', 'Section 8', 'Transitional', 'Shelter'];
export const UNIT_TYPES: UnitType[] = ['Studio', '1BR', '2BR', '3BR', '4BR+'];

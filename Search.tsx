/**
 * SEARCH PAGE — Affordable Housing Hub
 * Design: Editorial Civic — forest green + amber, Playfair Display + DM Sans
 *
 * Filter system: Each housing category has its own dedicated filter chip.
 * Categories: ARCH · MFTE · Section 8 · Transitional · Shelter (each independent)
 * Plus: AMI tier chips · City chips · Bedroom chips · Status toggles
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearch } from 'wouter';
import {
  Search as SearchIcon, SlidersHorizontal, Map, List, X,
  CheckCircle2, TrendingUp, Clock, Shield, Users, DollarSign,
  AlertTriangle, Zap, ChevronDown, ChevronUp, Phone, Train,
  Building2, Home, Heart, LayoutGrid, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HousingTypeBadge from '@/components/HousingTypeBadge';
import { MapView } from '@/components/Map';
import {
  Property, HousingType, UnitType,
  HOUSING_TYPES, UNIT_TYPES, CITIES, HOUSING_TYPE_COLORS
} from '@/lib/types';
import { checkPropertyEligibility, formatIncome, AMI_LIMITS } from '@/lib/amiCalc';
import { getAllFreshness, submitSignal, PropertyFreshness } from '@/lib/freshnessStore';
import propertiesData from '@/data/properties.json';
import { TRANSIT_STOPS } from '@/data/transitStops';

const allProperties = propertiesData as Property[];

// ─── Housing category metadata ────────────────────────────────────────────────

const CATEGORY_META: Record<HousingType, {
  icon: React.ReactNode;
  description: string;
  howToApply: string;
}> = {
  'ARCH': {
    icon: <Building2 className="w-4 h-4" />,
    description: 'Income-restricted units in market-rate buildings. Must ask the leasing office directly.',
    howToApply: 'Call and ask for "ARCH income-restricted units"',
  },
  'MFTE': {
    icon: <Home className="w-4 h-4" />,
    description: 'Multifamily Tax Exemption units. Below-market rent in newer buildings.',
    howToApply: 'Apply directly through the building\'s leasing office',
  },
  'Section 8': {
    icon: <Shield className="w-4 h-4" />,
    description: 'Housing Choice Voucher program. Bring your KCHA voucher and apply directly.',
    howToApply: 'Contact KCHA to get on the voucher waitlist first',
  },
  'Transitional': {
    icon: <Heart className="w-4 h-4" />,
    description: 'Temporary housing with support services for people in transition.',
    howToApply: 'Contact the program directly or through a case worker',
  },
  'Shelter': {
    icon: <AlertTriangle className="w-4 h-4" />,
    description: 'Emergency and short-term shelter options in East King County.',
    howToApply: 'Call 211 or use the Shelter Finder for fastest routing',
  },
};

// AMI tier filter options
const AMI_FILTER_OPTIONS = [
  { label: '≤30% AMI', value: '30', color: 'bg-red-50 text-red-700 border-red-200' },
  { label: '≤50% AMI', value: '50', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { label: '≤60% AMI', value: '60', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: '≤80% AMI', value: '80', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { label: '≤100% AMI', value: '100', color: 'bg-lime-50 text-lime-700 border-lime-200' },
  { label: '≤120% AMI', value: '120', color: 'bg-green-50 text-green-700 border-green-200' },
];

// ─── Eligibility Shield ───────────────────────────────────────────────────────

function EligibilityShield({
  householdSize, setHouseholdSize,
  annualIncome, setAnnualIncome,
  shieldActive, setShieldActive,
}: {
  householdSize: number; setHouseholdSize: (n: number) => void;
  annualIncome: number; setAnnualIncome: (n: number) => void;
  shieldActive: boolean; setShieldActive: (b: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const maxIncome = AMI_LIMITS[120]?.[Math.min(householdSize, 8) - 1] ?? 0;

  return (
    <div className={`rounded-xl border-2 transition-all ${shieldActive ? 'border-[#1B4332] bg-[#D8F3DC]' : 'border-[#E5E7EB] bg-white'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <Shield className={`w-4 h-4 flex-shrink-0 ${shieldActive ? 'text-[#1B4332]' : 'text-[#9CA3AF]'}`} />
        <div className="flex-1 min-w-0">
          <span className={`font-body font-semibold text-sm ${shieldActive ? 'text-[#1B4332]' : 'text-[#374151]'}`}>
            Eligibility Shield
          </span>
          {shieldActive && (
            <span className="ml-2 text-xs font-body text-[#2D6A4F]">
              {householdSize} person · {formatIncome(annualIncome)}/yr
            </span>
          )}
        </div>
        <span className="text-xs font-body text-[#6B7280]">
          {shieldActive ? 'Active' : 'Off'}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-[#6B7280]" /> : <ChevronDown className="w-4 h-4 text-[#6B7280]" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-[#E5E7EB] pt-3">
              <p className="font-body text-xs text-[#6B7280]">
                Enter your household size and income to automatically grey out over-income properties.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-body font-semibold text-[#374151] mb-1.5">
                    <Users className="w-3 h-3 inline mr-1" />Household Size
                  </label>
                  <select
                    value={householdSize}
                    onChange={e => setHouseholdSize(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-body border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] bg-white"
                  >
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body font-semibold text-[#374151] mb-1.5">
                    <DollarSign className="w-3 h-3 inline mr-1" />Annual Income
                  </label>
                  <input
                    type="number"
                    value={annualIncome || ''}
                    onChange={e => setAnnualIncome(Number(e.target.value))}
                    placeholder="e.g. 55000"
                    className="w-full px-3 py-2 text-sm font-body border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>
              </div>
              {annualIncome > 0 && (
                <div className="bg-white rounded-lg p-3 border border-[#E5E7EB]">
                  <p className="font-body text-xs text-[#374151]">
                    For a {householdSize}-person household earning {formatIncome(annualIncome)}/yr:
                  </p>
                  <p className="font-body text-sm font-semibold text-[#1B4332] mt-1">
                    {annualIncome <= AMI_LIMITS[50]?.[householdSize - 1] ? '✓ Qualifies for 50% AMI units' :
                     annualIncome <= AMI_LIMITS[80]?.[householdSize - 1] ? '✓ Qualifies for 80% AMI units' :
                     annualIncome <= AMI_LIMITS[100]?.[householdSize - 1] ? '✓ Qualifies for 100% AMI units' :
                     annualIncome <= maxIncome ? '✓ Qualifies for 120% AMI units' :
                     '⚠ Over 120% AMI — limited options'}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setShieldActive(true); setExpanded(false); }}
                  disabled={annualIncome === 0}
                  className="flex-1 px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm font-semibold disabled:opacity-40 hover:bg-[#2D6A4F] transition-colors"
                >
                  Apply Shield
                </button>
                {shieldActive && (
                  <button
                    onClick={() => { setShieldActive(false); setAnnualIncome(0); }}
                    className="px-4 py-2 border border-[#E5E7EB] text-[#374151] rounded-lg font-body text-sm hover:bg-[#F9FAFB] transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Compact Property Card (list pane) ───────────────────────────────────────

function CompactCard({
  property,
  highlighted,
  onHover,
  freshness,
  eligibility,
}: {
  property: Property;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  freshness: PropertyFreshness | null;
  eligibility: 'eligible' | 'over_income' | 'unknown';
}) {
  const primaryType = property.housing_types[0];
  const colors = HOUSING_TYPE_COLORS[primaryType];
  const isOverIncome = eligibility === 'over_income';

  return (
    <Link href={`/property/${property.id}`}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isOverIncome ? 0.4 : 1, y: 0 }}
        onMouseEnter={() => onHover(property.id)}
        onMouseLeave={() => onHover(null)}
        className={`relative bg-white rounded-xl border transition-all cursor-pointer group ${
          highlighted
            ? 'border-[#1B4332] shadow-lg shadow-[#1B4332]/10 scale-[1.01]'
            : 'border-[#E8E7E1] hover:border-[#95D5A3] hover:shadow-md'
        } ${isOverIncome ? 'pointer-events-none' : ''}`}
      >
        {isOverIncome && (
          <div className="absolute inset-0 bg-white/60 rounded-xl z-10 flex items-center justify-center">
            <span className="text-xs font-body font-semibold text-[#9CA3AF] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">
              Over income limit
            </span>
          </div>
        )}

        {/* Left accent bar colored by housing type */}
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: colors.border }} />

        <div className="pl-4 pr-4 py-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-[#1B4332] text-sm leading-snug truncate group-hover:text-[#2D6A4F]">
                {property.name}
              </h3>
              <p className="font-body text-[#6B7280] text-xs mt-0.5 truncate">{property.address}, {property.city}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {property.verified && (
                <span className="flex items-center gap-0.5 text-[10px] font-body font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                </span>
              )}
              {freshness?.waitlistFull && (
                <span className="text-[10px] font-body font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded-full">
                  High Competition
                </span>
              )}
              {freshness?.lastVerified && !freshness.waitlistFull && (
                <span className="flex items-center gap-0.5 text-[10px] font-body font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  <Zap className="w-2.5 h-2.5" /> Open
                </span>
              )}
            </div>
          </div>

          {/* Housing type badges — each type shown individually */}
          <div className="flex flex-wrap gap-1 mb-2">
            {property.housing_types.map(t => {
              const c = HOUSING_TYPE_COLORS[t];
              return (
                <span
                  key={t}
                  className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  {t}
                </span>
              );
            })}
            {property.ami_levels.slice(0, 2).map(a => (
              <span key={a} className="text-[10px] font-body px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {a}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-body text-[#6B7280]">
            <span>{property.affordable_units} affordable units</span>
            <span>·</span>
            <span>{property.unit_types.join(', ')}</span>
            {property.likely_available && (
              <>
                <span>·</span>
                <span className="text-amber-600 font-semibold">Likely open</span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  selectedCity, setSelectedCity,
  selectedTypes, toggleType,
  selectedUnits, toggleUnit,
  selectedAmi, toggleAmi,
  verifiedOnly, setVerifiedOnly,
  likelyAvailable, setLikelyAvailable,
  hasWaitlist, setHasWaitlist,
  activeFilterCount, clearFilters,
}: {
  selectedCity: string; setSelectedCity: (s: string) => void;
  selectedTypes: HousingType[]; toggleType: (t: HousingType) => void;
  selectedUnits: UnitType[]; toggleUnit: (u: UnitType) => void;
  selectedAmi: string[]; toggleAmi: (a: string) => void;
  verifiedOnly: boolean; setVerifiedOnly: (b: boolean) => void;
  likelyAvailable: boolean; setLikelyAvailable: (b: boolean) => void;
  hasWaitlist: boolean; setHasWaitlist: (b: boolean) => void;
  activeFilterCount: number; clearFilters: () => void;
}) {
  return (
    <div className="space-y-5">

      {/* ── Housing Category — each gets its own chip ── */}
      <div>
        <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-3">
          Housing Category
        </label>
        <div className="space-y-2">
          {HOUSING_TYPES.map(type => {
            const colors = HOUSING_TYPE_COLORS[type];
            const active = selectedTypes.includes(type);
            const count = allProperties.filter(p => p.housing_types.includes(type)).length;
            const meta = CATEGORY_META[type];
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className="w-full text-left rounded-xl border-2 transition-all overflow-hidden"
                style={{
                  borderColor: active ? colors.border : '#E5E7EB',
                  backgroundColor: active ? colors.bg : 'white',
                }}
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  {/* Color swatch */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      backgroundColor: active ? colors.text : '#F3F4F6',
                      color: active ? 'white' : colors.text,
                    }}
                  >
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-body font-bold text-sm"
                        style={{ color: active ? colors.text : '#1F2937' }}
                      >
                        {type}
                      </span>
                      <span
                        className="text-xs font-body font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: active ? colors.text : '#F3F4F6',
                          color: active ? 'white' : '#6B7280',
                        }}
                      >
                        {count}
                      </span>
                    </div>
                    <p className="text-[10px] font-body text-[#9CA3AF] leading-tight mt-0.5 truncate">
                      {meta.howToApply}
                    </p>
                  </div>
                  {/* Checkmark */}
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: active ? colors.text : '#D1D5DB',
                      backgroundColor: active ? colors.text : 'transparent',
                    }}
                  >
                    {active && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {selectedTypes.length > 0 && (
          <button
            onClick={() => selectedTypes.forEach(t => toggleType(t))}
            className="mt-2 text-xs font-body text-[#9CA3AF] hover:text-[#374151] flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear category filters
          </button>
        )}
      </div>

      {/* ── AMI Tier ── */}
      <div>
        <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">
          Income Limit (AMI)
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {AMI_FILTER_OPTIONS.map(opt => {
            const active = selectedAmi.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleAmi(opt.value)}
                className={`px-2 py-2 rounded-lg text-xs font-body font-semibold border-2 transition-all text-center ${
                  active
                    ? opt.color + ' border-current'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-[#9CA3AF] font-body mt-1.5">Select one or more AMI tiers to filter</p>
      </div>

      {/* ── City ── */}
      <div>
        <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">City</label>
        <div className="flex flex-wrap gap-1.5">
          {CITIES.map(city => {
            const count = allProperties.filter(p => p.city === city).length;
            const active = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(active ? '' : city)}
                className={`px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all ${
                  active
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#52B788] hover:text-[#1B4332]'
                }`}
              >
                {city} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Bedrooms ── */}
      <div>
        <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">Bedrooms</label>
        <div className="flex flex-wrap gap-1.5">
          {UNIT_TYPES.map(unit => (
            <button
              key={unit}
              onClick={() => toggleUnit(unit)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all border ${
                selectedUnits.includes(unit)
                  ? 'bg-[#1B4332] text-white border-[#1B4332]'
                  : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#52B788]'
              }`}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {/* ── Status toggles ── */}
      <div>
        <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">Status</label>
        <div className="space-y-1.5">
          {[
            { label: 'Verified listings only', icon: <CheckCircle2 className="w-3.5 h-3.5" />, value: verifiedOnly, set: setVerifiedOnly },
            { label: 'Likely available now', icon: <TrendingUp className="w-3.5 h-3.5" />, value: likelyAvailable, set: setLikelyAvailable },
            { label: 'Has open waitlist', icon: <Clock className="w-3.5 h-3.5" />, value: hasWaitlist, set: setHasWaitlist },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.set(!item.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body transition-all border ${
                item.value
                  ? 'bg-[#D8F3DC] text-[#1B4332] border-[#95D5A3]'
                  : 'bg-white text-[#374151] border-[#E5E7EB] hover:border-[#52B788]'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-body text-[#6B7280] hover:text-[#1B4332] border border-dashed border-[#D1D5DB] rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Clear all {activeFilterCount} filters
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Search() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);

  // Core filters
  const [query, setQuery] = useState(params.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(params.get('city') || '');
  const [selectedTypes, setSelectedTypes] = useState<HousingType[]>(
    params.get('types') ? (params.get('types')!.split(',') as HousingType[]) : []
  );
  const [selectedUnits, setSelectedUnits] = useState<UnitType[]>([]);
  const [selectedAmi, setSelectedAmi] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [likelyAvailable, setLikelyAvailable] = useState(params.get('likely') === 'true');
  const [hasWaitlist, setHasWaitlist] = useState(false);

  // Eligibility Shield
  const [householdSize, setHouseholdSize] = useState(2);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);

  // Layout
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Map state
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [searchAsMove, setSearchAsMove] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [showTransit, setShowTransit] = useState(false);
  const transitMarkersRef = useRef<google.maps.Marker[]>([]);

  // Community freshness
  const [freshness, setFreshness] = useState<Record<string, PropertyFreshness>>({});
  useEffect(() => {
    setFreshness(getAllFreshness());
  }, []);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const baseFiltered = useMemo(() => {
    return allProperties.filter(p => {
      if (query) {
        const q = query.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) &&
            !p.address.toLowerCase().includes(q) && !p.zip.includes(q)) return false;
      }
      if (selectedCity && p.city !== selectedCity) return false;
      if (selectedTypes.length > 0 && !selectedTypes.some(t => p.housing_types.includes(t))) return false;
      if (selectedUnits.length > 0 && !selectedUnits.some(u => p.unit_types.includes(u))) return false;
      if (verifiedOnly && !p.verified) return false;
      if (likelyAvailable && !p.likely_available) return false;
      if (hasWaitlist && !p.has_waitlist) return false;
      if (likelyAvailable && freshness[p.id]?.waitlistFull) return false;
      // AMI filter: property must have at least one AMI level that is <= the selected tier
      if (selectedAmi.length > 0) {
        const maxSelectedAmi = Math.max(...selectedAmi.map(Number));
        const propertyMaxAmi = Math.max(
          ...p.ami_levels.map(a => parseInt(a.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n)),
          0
        );
        if (propertyMaxAmi === 0 || propertyMaxAmi > maxSelectedAmi) return false;
      }
      return true;
    });
  }, [query, selectedCity, selectedTypes, selectedUnits, verifiedOnly, likelyAvailable, hasWaitlist, freshness, selectedAmi]);

  const filtered = useMemo(() => {
    if (!searchAsMove || !mapBounds) return baseFiltered;
    return baseFiltered.filter(p => mapBounds.contains({ lat: p.lat, lng: p.lng }));
  }, [baseFiltered, searchAsMove, mapBounds]);

  const eligibilityMap = useMemo(() => {
    if (!shieldActive || annualIncome === 0) return {};
    const result: Record<string, 'eligible' | 'over_income' | 'unknown'> = {};
    for (const p of filtered) {
      result[p.id] = checkPropertyEligibility(p.ami_levels, householdSize, annualIncome);
    }
    return result;
  }, [filtered, shieldActive, annualIncome, householdSize]);

  // ── Map setup ──────────────────────────────────────────────────────────────

  const handleMapReady = useCallback((map: google.maps.Map) => {
    const BELLEVUE_CENTER = { lat: 47.6101, lng: -122.2015 };
    map.setCenter(BELLEVUE_CENTER);
    map.setZoom(11);
    setTimeout(() => {
      map.setCenter(BELLEVUE_CENTER);
      map.setZoom(11);
    }, 300);
    setGoogleMap(map);
    setMapReady(true);

    let firstIdle = true;
    map.addListener('idle', () => {
      if (firstIdle) { firstIdle = false; return; }
      setMapBounds(map.getBounds() ?? null);
    });
  }, []);

  useEffect(() => {
    if (!googleMap || !mapReady) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    filtered.forEach(prop => {
      const pFreshness = freshness[prop.id];
      const isOverIncome = eligibilityMap[prop.id] === 'over_income';

      const pinColor =
        pFreshness?.lastVerified ? '#52B788' :
        prop.verified && prop.likely_available ? '#52B788' :
        prop.verified ? '#52B788' :
        prop.likely_available ? '#D4A017' :
        '#9CA3AF';

      const strokeColor = isOverIncome ? '#D1D5DB' : '#1B4332';
      const scale = hoveredId === prop.id ? 13 : 9;

      const marker = new google.maps.Marker({
        position: { lat: prop.lat, lng: prop.lng },
        map: googleMap,
        title: prop.name,
        opacity: isOverIncome ? 0.3 : 1,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale,
          fillColor: pinColor,
          fillOpacity: 1,
          strokeColor,
          strokeWeight: hoveredId === prop.id ? 2.5 : 1.5,
        },
      });

      const infoContent = `
        <div style="font-family: DM Sans, sans-serif; padding: 4px; max-width: 220px;">
          <strong style="color: #1B4332; font-size: 13px; display: block; margin-bottom: 2px;">${prop.name}</strong>
          <p style="color: #6B7280; font-size: 11px; margin: 0 0 4px;">${prop.address}, ${prop.city}</p>
          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px;">
            ${prop.housing_types.map(t => `<span style="font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 999px; background: ${HOUSING_TYPE_COLORS[t].bg}; color: ${HOUSING_TYPE_COLORS[t].text};">${t}</span>`).join('')}
          </div>
          <p style="color: #374151; font-size: 11px; margin: 0 0 6px;">${prop.affordable_units} affordable units · ${prop.unit_types.join(', ')}</p>
          ${pFreshness?.waitlistFull ? '<p style="color: #c2410c; font-size: 11px; font-weight: 600; margin: 0 0 6px;">⚠ High Competition</p>' : ''}
          <a href="/property/${prop.id}" style="color: #1B4332; font-size: 11px; font-weight: 700; text-decoration: none;">View details →</a>
        </div>`;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });
      marker.addListener('click', () => infoWindow.open(googleMap, marker));
      markersRef.current.push(marker);
    });
  }, [googleMap, mapReady, filtered, hoveredId, freshness, eligibilityMap]);

  // ── Transit layer ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!googleMap || !mapReady) return;
    transitMarkersRef.current.forEach(m => m.setMap(null));
    transitMarkersRef.current = [];
    if (!showTransit) return;

    TRANSIT_STOPS.forEach(stop => {
      const isEastLink = stop.line === '2 Line';
      const marker = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: googleMap,
        title: stop.name,
        zIndex: 5,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: isEastLink ? '#1D4ED8' : '#166534',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoContent = `
        <div style="font-family: DM Sans, sans-serif; padding: 4px; max-width: 180px;">
          <strong style="color: #1B4332; font-size: 12px; display: block; margin-bottom: 2px;">${stop.name}</strong>
          <span style="font-size: 11px; font-weight: 600; padding: 1px 8px; border-radius: 999px; background: ${isEastLink ? '#DBEAFE' : '#DCFCE7'}; color: ${isEastLink ? '#1D4ED8' : '#166534'};">
            Link ${stop.line}
          </span>
          <p style="color: #6B7280; font-size: 10px; margin: 4px 0 0;">Sound Transit Light Rail</p>
        </div>`;

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });
      marker.addListener('click', () => infoWindow.open(googleMap, marker));
      transitMarkersRef.current.push(marker);
    });
  }, [googleMap, mapReady, showTransit]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const toggleType = (type: HousingType) =>
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  const toggleUnit = (unit: UnitType) =>
    setSelectedUnits(prev => prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit]);
  const toggleAmi = (ami: string) =>
    setSelectedAmi(prev => prev.includes(ami) ? prev.filter(a => a !== ami) : [...prev, ami]);

  const clearFilters = () => {
    setQuery(''); setSelectedCity(''); setSelectedTypes([]);
    setSelectedUnits([]); setSelectedAmi([]); setVerifiedOnly(false);
    setLikelyAvailable(false); setHasWaitlist(false);
  };

  const activeFilterCount = [
    selectedCity,
    ...selectedTypes,
    ...selectedUnits,
    ...selectedAmi,
    verifiedOnly ? 'v' : '',
    likelyAvailable ? 'l' : '',
    hasWaitlist ? 'w' : '',
  ].filter(Boolean).length;

  const overIncomeCount = Object.values(eligibilityMap).filter(v => v === 'over_income').length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* Sticky search + quick-filter bar */}
      <div className="bg-white border-b border-[#E8E7E1] sticky top-16 z-40">
        <div className="container py-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search by name, city, or ZIP..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm font-body text-[#1F2937] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-body border transition-all ${
                activeFilterCount > 0 ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white text-[#374151] border-[#E5E7EB]'
              }`}
            >
              <Filter className="w-4 h-4" />
              {activeFilterCount > 0 ? `${activeFilterCount}` : 'Filters'}
            </button>
            <div className="lg:hidden flex rounded-lg border border-[#E5E7EB] overflow-hidden">
              <button
                onClick={() => setMobileView('list')}
                className={`px-3 py-2.5 text-sm transition-colors ${mobileView === 'list' ? 'bg-[#1B4332] text-white' : 'bg-white text-[#6B7280]'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileView('map')}
                className={`px-3 py-2.5 text-sm transition-colors ${mobileView === 'map' ? 'bg-[#1B4332] text-white' : 'bg-white text-[#6B7280]'}`}
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick-filter chip row — always visible on desktop */}
          <div className="hidden lg:flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="text-xs font-body text-[#9CA3AF] font-semibold uppercase tracking-wider mr-1">Quick filter:</span>
            {HOUSING_TYPES.map(type => {
              const colors = HOUSING_TYPE_COLORS[type];
              const active = selectedTypes.includes(type);
              const count = allProperties.filter(p => p.housing_types.includes(type)).length;
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold border-2 transition-all"
                  style={{
                    backgroundColor: active ? colors.bg : 'white',
                    color: active ? colors.text : '#374151',
                    borderColor: active ? colors.border : '#E5E7EB',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors.border }}
                  />
                  {type}
                  <span className="opacity-60 font-normal">({count})</span>
                  {active && <X className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
            <div className="w-px h-4 bg-[#E5E7EB] mx-1" />
            {AMI_FILTER_OPTIONS.map(opt => {
              const active = selectedAmi.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleAmi(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold border-2 transition-all ${
                    active ? opt.color + ' border-current' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#D1D5DB]'
                  }`}
                >
                  {opt.label}
                  {active && <X className="w-3 h-3 inline ml-1" />}
                </button>
              );
            })}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body text-[#6B7280] border border-dashed border-[#D1D5DB] hover:text-[#1B4332] hover:border-[#1B4332] transition-colors ml-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          {/* Mobile filters drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-4 bg-[#FAFAF7] rounded-xl border border-[#E8E7E1]">
                  <EligibilityShield
                    householdSize={householdSize} setHouseholdSize={setHouseholdSize}
                    annualIncome={annualIncome} setAnnualIncome={setAnnualIncome}
                    shieldActive={shieldActive} setShieldActive={setShieldActive}
                  />
                  <div className="mt-4">
                    <FilterPanel
                      selectedCity={selectedCity} setSelectedCity={setSelectedCity}
                      selectedTypes={selectedTypes} toggleType={toggleType}
                      selectedUnits={selectedUnits} toggleUnit={toggleUnit}
                      selectedAmi={selectedAmi} toggleAmi={toggleAmi}
                      verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
                      likelyAvailable={likelyAvailable} setLikelyAvailable={setLikelyAvailable}
                      hasWaitlist={hasWaitlist} setHasWaitlist={setHasWaitlist}
                      activeFilterCount={activeFilterCount} clearFilters={clearFilters}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main split-pane layout */}
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 112px)' }}>

        {/* LEFT: Filter sidebar + card list */}
        <div className={`flex flex-col ${mobileView === 'map' ? 'hidden' : 'flex'} lg:flex w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 overflow-hidden border-r border-[#E8E7E1]`}>

          {/* Filter sidebar (desktop) */}
          <div className="hidden lg:block flex-shrink-0 bg-white border-b border-[#E8E7E1] p-4 space-y-4 overflow-y-auto max-h-[55vh]">
            <EligibilityShield
              householdSize={householdSize} setHouseholdSize={setHouseholdSize}
              annualIncome={annualIncome} setAnnualIncome={setAnnualIncome}
              shieldActive={shieldActive} setShieldActive={setShieldActive}
            />
            <FilterPanel
              selectedCity={selectedCity} setSelectedCity={setSelectedCity}
              selectedTypes={selectedTypes} toggleType={toggleType}
              selectedUnits={selectedUnits} toggleUnit={toggleUnit}
              selectedAmi={selectedAmi} toggleAmi={toggleAmi}
              verifiedOnly={verifiedOnly} setVerifiedOnly={setVerifiedOnly}
              likelyAvailable={likelyAvailable} setLikelyAvailable={setLikelyAvailable}
              hasWaitlist={hasWaitlist} setHasWaitlist={setHasWaitlist}
              activeFilterCount={activeFilterCount} clearFilters={clearFilters}
            />
          </div>

          {/* Results header */}
          <div className="flex-shrink-0 px-4 py-3 bg-[#FAFAF7] border-b border-[#E8E7E1] flex items-center justify-between">
            <div>
              <span className="font-display font-bold text-[#1B4332] text-sm">
                {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
              </span>
              {shieldActive && overIncomeCount > 0 && (
                <span className="ml-2 text-xs font-body text-[#9CA3AF]">
                  ({overIncomeCount} greyed out)
                </span>
              )}
              {activeFilterCount > 0 && (
                <span className="ml-2 text-xs font-body text-[#D97706] font-semibold">
                  {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {searchAsMove && (
                <span className="text-xs font-body text-[#D4A017] font-semibold">Search as I move</span>
              )}
              <button
                onClick={() => setSearchAsMove(!searchAsMove)}
                className={`text-xs font-body px-2 py-1 rounded-lg border transition-all ${
                  searchAsMove ? 'bg-[#D4A017] text-[#1B4332] border-[#D4A017] font-semibold' : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                }`}
              >
                {searchAsMove ? '✓ As I move' : 'As I move'}
              </button>
            </div>
          </div>

          {/* Active filter chips summary */}
          {(selectedTypes.length > 0 || selectedAmi.length > 0 || selectedCity) && (
            <div className="flex-shrink-0 px-3 py-2 bg-white border-b border-[#E8E7E1] flex flex-wrap gap-1.5">
              {selectedTypes.map(type => {
                const colors = HOUSING_TYPE_COLORS[type];
                return (
                  <span
                    key={type}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-semibold"
                    style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                  >
                    {type}
                    <button onClick={() => toggleType(type)} className="hover:opacity-70">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                );
              })}
              {selectedAmi.map(ami => (
                <span key={ami} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  ≤{ami}% AMI
                  <button onClick={() => toggleAmi(ami)} className="hover:opacity-70">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {selectedCity && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedCity}
                  <button onClick={() => setSelectedCity('')} className="hover:opacity-70">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Card list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-3xl mb-3">🏠</div>
                  <h3 className="font-display text-[#1B4332] text-lg font-bold mb-1">No properties found</h3>
                  <p className="text-[#6B7280] font-body text-sm mb-3">Try adjusting your filters.</p>
                  <button onClick={clearFilters} className="px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm">
                    Clear filters
                  </button>
                </div>
              ) : (
                filtered.map(property => (
                  <CompactCard
                    key={property.id}
                    property={property}
                    highlighted={hoveredId === property.id}
                    onHover={setHoveredId}
                    freshness={freshness[property.id] ?? null}
                    eligibility={shieldActive ? (eligibilityMap[property.id] ?? 'unknown') : 'unknown'}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT: Map pane */}
        <div className={`flex-1 relative ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          {/* Map legend */}
          <div className="absolute top-3 left-3 z-10 bg-white rounded-xl border border-[#E8E7E1] shadow-md px-3 py-2 space-y-1">
            <p className="font-body text-[10px] font-semibold text-[#374151] uppercase tracking-wider mb-1">Pin Status</p>
            {[
              { color: '#52B788', label: 'Verified / Open' },
              { color: '#D4A017', label: 'Likely Available' },
              { color: '#9CA3AF', label: 'Needs Update' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-body text-[10px] text-[#374151]">{item.label}</span>
              </div>
            ))}
            {showTransit && (
              <div className="border-t border-[#E8E7E1] mt-1 pt-1">
                <p className="font-body text-[10px] font-semibold text-[#374151] uppercase tracking-wider mb-1">Link Rail</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#1D4ED8' }} />
                  <span className="font-body text-[10px] text-[#374151]">2 Line (East Link)</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#166534' }} />
                  <span className="font-body text-[10px] text-[#374151]">1 Line (Rainier/SeaTac)</span>
                </div>
              </div>
            )}
          </div>

          {/* Transit toggle */}
          <button
            onClick={() => setShowTransit(prev => !prev)}
            className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl border shadow-md text-xs font-body font-semibold transition-all ${
              showTransit
                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                : 'bg-white text-[#374151] border-[#E8E7E1] hover:border-[#1D4ED8] hover:text-[#1D4ED8]'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            Transit
          </button>

          <MapView
            onMapReady={handleMapReady}
            initialCenter={{ lat: 47.6101, lng: -122.2015 }}
            initialZoom={12}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

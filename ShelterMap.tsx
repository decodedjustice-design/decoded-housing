/*
 * SHELTER MAP PAGE — Editorial Civic Design
 * Shows all shelter/RAP/program resources as color-coded pins
 * Filters: population type, open now, access method, safe parking toggle
 * Pin colors: Shelter=green, RAP=orange, Programs=gray, Safe Parking=blue
 */
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Filter, X, Clock, CheckCircle2, Car, ChevronRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapView } from '@/components/Map';
import {
  SHELTER_RESOURCES, ShelterResource, Population, ResourceType, AccessMethod
} from '@/data/shelters';
import { useSevereWeather } from '@/hooks/useSevereWeather';

const TYPE_COLORS: Record<ResourceType, { pin: string; bg: string; text: string; border: string; label: string }> = {
  'Shelter': { pin: '#52B788', bg: '#D8F3DC', text: '#1B4332', border: '#95D5A3', label: 'Shelter' },
  'Shelter System': { pin: '#1B4332', bg: '#D8F3DC', text: '#1B4332', border: '#52B788', label: 'Shelter System' },
  'Intake': { pin: '#3B82F6', bg: '#DBEAFE', text: '#1E3A8A', border: '#93C5FD', label: 'Intake / Hotline' },
  'RAP': { pin: '#F59E0B', bg: '#FEF3C7', text: '#92400E', border: '#FCD34D', label: 'RAP (Coordinated Entry)' },
  'Program': { pin: '#9CA3AF', bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', label: 'Program' },
  'Safe Parking': { pin: '#6366F1', bg: '#EDE9FE', text: '#4C1D95', border: '#C4B5FD', label: 'Safe Parking' },
  'Emergency activation': { pin: '#EF4444', bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', label: 'Emergency Activation' },
  'Family intake': { pin: '#52B788', bg: '#D8F3DC', text: '#1B4332', border: '#95D5A3', label: 'Family Intake' },
  'Family shelter': { pin: '#52B788', bg: '#D8F3DC', text: '#1B4332', border: '#95D5A3', label: 'Family Shelter' },
  'Emergency shelter': { pin: '#52B788', bg: '#D8F3DC', text: '#1B4332', border: '#95D5A3', label: 'Emergency Shelter' },
  'Domestic violence': { pin: '#EC4899', bg: '#FDF2F8', text: '#831843', border: '#F9A8D4', label: 'Domestic Violence' },
  'Youth hotline': { pin: '#8B5CF6', bg: '#EDE9FE', text: '#4C1D95', border: '#C4B5FD', label: 'Youth Hotline' },
  'Safe parking': { pin: '#6366F1', bg: '#EDE9FE', text: '#4C1D95', border: '#C4B5FD', label: 'Safe Parking' },
};

const FALLBACK_COLOR = { pin: '#9CA3AF', bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', label: 'Resource' };
function getTypeColor(type: string) { return (TYPE_COLORS as Record<string, typeof FALLBACK_COLOR>)[type] ?? FALLBACK_COLOR; }

const POPULATION_LABELS: Record<Population, string> = {
  family: 'Families',
  single_adult: 'Single Adults',
  youth: 'Youth',
  DV: 'DV Survivors',
  veteran: 'Veterans',
  women: 'Women',
  men: 'Men',
  vehicle: 'Vehicle Dwellers',
  all: 'All Populations',
};

function getCurrentHour(): number {
  return new Date().getHours();
}

function isOpenNow(resource: ShelterResource): boolean {
  // Simplified: check if hours contain "24/7" or parse day/hour
  if (resource.hours.includes('24/7')) return true;
  const hour = getCurrentHour();
  // RAP windows
  if (resource.resource_type === 'RAP' && resource.rap_windows) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return resource.rap_windows.some(w => w.day === today && hour >= w.start_hour && hour < w.end_hour);
  }
  // Walk-in shelters that open in evening
  if (resource.hours.toLowerCase().includes('7pm') || resource.hours.toLowerCase().includes('8pm')) {
    return hour >= 19 || hour < 8;
  }
  // Business hours
  if (resource.hours.toLowerCase().includes('8am') || resource.hours.toLowerCase().includes('9am')) {
    return hour >= 8 && hour < 17;
  }
  return false;
}

export default function ShelterMap() {
  const [, navigate] = useLocation();
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedPop, setSelectedPop] = useState<Population[]>([]);
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [safeParkingOnly, setSafeParkingOnly] = useState(false);
  const [accessFilter, setAccessFilter] = useState<AccessMethod | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ShelterResource | null>(null);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const emergencyMarkersRef = useRef<google.maps.Marker[]>([]);

  // ── SEVERE WEATHER ACTIVATION ──
  const { status: severeWeather, loading: severeLoading, refresh: refreshSevere } = useSevereWeather();

  const filtered = useMemo(() => SHELTER_RESOURCES.filter(r => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(r.resource_type)) return false;
    if (selectedPop.length > 0 && !selectedPop.some(p => r.population.includes(p))) return false;
    if (openNowOnly && !isOpenNow(r)) return false;
    if (safeParkingOnly && r.resource_type !== 'Safe Parking') return false;
    if (accessFilter && r.access_method !== accessFilter) return false;
    return true;
  }), [selectedTypes, selectedPop, openNowOnly, safeParkingOnly, accessFilter]);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    setGoogleMap(map);
  }, []);

  useEffect(() => {
    if (!googleMap) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    const newMarkers: google.maps.Marker[] = [];

    filtered.forEach(resource => {
      // Priority-score color coding: green (8-10), yellow (5-7), gray (1-4)
      const pinColor = resource.priority_score >= 8 ? '#22C55E'
        : resource.priority_score >= 5 ? '#F59E0B'
        : '#9CA3AF';
      const strokeColor = resource.priority_score >= 8 ? '#15803D'
        : resource.priority_score >= 5 ? '#B45309'
        : '#6B7280';
      const colors = getTypeColor(resource.resource_type);
      const marker = new google.maps.Marker({
        position: { lat: resource.lat, lng: resource.lng },
        map: googleMap,
        title: resource.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: resource.priority_score >= 9 ? 11 : resource.priority_score >= 7 ? 9 : 7,
          fillColor: pinColor,
          fillOpacity: 1,
          strokeColor: strokeColor,
          strokeWeight: 1.5,
        },
      });

      const openStatus = isOpenNow(resource);
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="font-family: DM Sans, sans-serif; padding: 6px; max-width: 220px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span style="background:${colors.bg};color:${colors.text};border:1px solid ${colors.border};padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;">${resource.resource_type}</span>
            ${openStatus ? '<span style="color:#1B4332;font-size:10px;font-weight:600;">● Open now</span>' : ''}
          </div>
          <strong style="color:#1B4332;font-size:13px;display:block;margin-bottom:2px;">${resource.name}</strong>
          <p style="color:#6B7280;font-size:11px;margin:0 0 4px;">${resource.address}</p>
          <p style="color:#374151;font-size:11px;margin:0 0 6px;">${resource.how_to_enter.substring(0, 80)}${resource.how_to_enter.length > 80 ? '...' : ''}</p>
          <a href="tel:${resource.phone}" style="display:inline-flex;align-items:center;gap:4px;background:#1B4332;color:white;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none;">📞 ${resource.phone}</a>
        </div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(googleMap, marker);
        setSelectedResource(resource);
      });
      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    if (filtered.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filtered.forEach(r => bounds.extend({ lat: r.lat, lng: r.lng }));
      googleMap.fitBounds(bounds, 60);
    }
  }, [googleMap, filtered]);

  // ── EMERGENCY PINS (rendered on top, red, highest z-index) ──
  useEffect(() => {
    if (!googleMap) return;
    // Clear old emergency markers
    emergencyMarkersRef.current.forEach(m => m.setMap(null));
    emergencyMarkersRef.current = [];
    if (!severeWeather?.active || !severeWeather.locations.length) {
      return;
    }

    // Geocode each emergency location and place red pin
    const geocoder = new google.maps.Geocoder();
    const newEMarkers: google.maps.Marker[] = [];

    severeWeather.locations.forEach(loc => {
      geocoder.geocode({ address: loc.address }, (results, status) => {
        if (status !== 'OK' || !results?.[0]) return;
        const pos = results[0].geometry.location;

        const marker = new google.maps.Marker({
          position: pos,
          map: googleMap,
          title: loc.name,
          zIndex: 9999, // Always on top
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#DC2626',
            fillOpacity: 1,
            strokeColor: '#7F1D1D',
            strokeWeight: 2,
          },
          label: {
            text: '!',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px',
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="font-family: DM Sans, sans-serif; padding: 8px; max-width: 240px;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
              <span style="background:#FEE2E2;color:#991B1B;border:1px solid #FCA5A5;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;">🚨 EMERGENCY SHELTER</span>
            </div>
            <strong style="color:#991B1B;font-size:13px;display:block;margin-bottom:2px;">${loc.name}</strong>
            <p style="color:#6B7280;font-size:11px;margin:0 0 4px;">${loc.address}</p>
            <p style="color:#374151;font-size:11px;margin:0 0 4px;"><strong>Hours:</strong> ${loc.hours}</p>
            ${loc.population !== 'All' ? `<p style="color:#374151;font-size:11px;margin:0 0 6px;"><strong>For:</strong> ${loc.population}</p>` : ''}
            ${loc.notes ? `<p style="color:#6B7280;font-size:11px;font-style:italic;margin:0 0 6px;">${loc.notes}</p>` : ''}
            <a href="https://maps.google.com/?q=${encodeURIComponent(loc.address)}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;background:#DC2626;color:white;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none;">📍 Get Directions</a>
          </div>`,
        });

        marker.addListener('click', () => infoWindow.open(googleMap, marker));
        newEMarkers.push(marker);
        emergencyMarkersRef.current = [...newEMarkers];
      });
    });
  }, [googleMap, severeWeather]);

  const toggleType = (t: ResourceType) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const togglePop = (p: Population) =>
    setSelectedPop(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const activeCount = selectedTypes.length + selectedPop.length +
    (openNowOnly ? 1 : 0) + (safeParkingOnly ? 1 : 0) + (accessFilter ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* ── EMERGENCY ACTIVATION BANNER ── */}
      {severeWeather?.active && (
        <div className="bg-red-600 text-white px-4 py-3">
          <div className="container">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-yellow-300" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <span className="font-body font-bold text-sm">
                    🚨 Emergency Shelter Activated{severeWeather.tier ? ` — ${severeWeather.tier}` : ''}
                  </span>
                  <span className="text-red-200 text-xs font-body ml-2">
                    Red pins show open emergency shelters · Hotline: {severeWeather.hotline}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={severeWeather.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white text-red-700 rounded-lg text-xs font-body font-bold hover:bg-red-50 transition-colors"
                >
                  KCRHA.org
                </a>
                <button
                  onClick={refreshSevere}
                  disabled={severeLoading}
                  className="p-1.5 bg-red-700 rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-white ${severeLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[#E8E7E1] py-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-[#1B4332] text-xl font-bold">
                Shelter & Resource Map
              </h1>
              <p className="text-[#6B7280] font-body text-sm">
                {filtered.length} resources shown · King County, WA
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/shelter-finder')}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm font-medium hover:bg-[#2D6A4F] transition-colors"
              >
                Get Shelter Now
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body border transition-all ${
                  activeCount > 0
                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                    : 'bg-white text-[#374151] border-[#E5E7EB]'
                }`}
              >
                <Filter className="w-4 h-4" />
                {activeCount > 0 ? `${activeCount} filters` : 'Filter'}
              </button>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-[#E8E7E1]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Resource type */}
                <div>
                  <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(TYPE_COLORS) as ResourceType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className="px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all border"
                        style={{
                          backgroundColor: selectedTypes.includes(t) ? TYPE_COLORS[t].bg : 'white',
                          color: selectedTypes.includes(t) ? TYPE_COLORS[t].text : '#6B7280',
                          borderColor: selectedTypes.includes(t) ? TYPE_COLORS[t].border : '#E5E7EB',
                        }}
                      >
                        {TYPE_COLORS[t].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Population */}
                <div>
                  <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">Population</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(POPULATION_LABELS) as Population[]).map(p => (
                      <button
                        key={p}
                        onClick={() => togglePop(p)}
                        className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all border ${
                          selectedPop.includes(p)
                            ? 'bg-[#1B4332] text-white border-[#1B4332]'
                            : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                        }`}
                      >
                        {POPULATION_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Access method */}
                <div>
                  <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">Access</label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['walk-in', 'call', 'referral'] as AccessMethod[]).map(a => (
                      <button
                        key={a}
                        onClick={() => setAccessFilter(accessFilter === a ? '' : a)}
                        className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all border capitalize ${
                          accessFilter === a
                            ? 'bg-[#1B4332] text-white border-[#1B4332]'
                            : 'bg-white text-[#6B7280] border-[#E5E7EB]'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div>
                  <label className="block text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-2">More</label>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setOpenNowOnly(!openNowOnly)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-body border transition-all w-full ${
                        openNowOnly ? 'bg-[#D8F3DC] text-[#1B4332] border-[#95D5A3]' : 'bg-white text-[#374151] border-[#E5E7EB]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Open now
                    </button>
                    <button
                      onClick={() => setSafeParkingOnly(!safeParkingOnly)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-body border transition-all w-full ${
                        safeParkingOnly ? 'bg-[#EDE9FE] text-[#4C1D95] border-[#C4B5FD]' : 'bg-white text-[#374151] border-[#E5E7EB]'
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      Safe parking only
                    </button>
                  </div>
                </div>
              </div>

              {activeCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedPop([]);
                    setOpenNowOnly(false);
                    setSafeParkingOnly(false);
                    setAccessFilter('');
                  }}
                  className="mt-3 flex items-center gap-1 text-xs font-body text-[#6B7280] hover:text-[#1B4332]"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-b border-[#E8E7E1] py-2">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            {(Object.entries(TYPE_COLORS) as [ResourceType, typeof TYPE_COLORS[ResourceType]][]).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.pin }}
                />
                <span className="text-xs font-body text-[#6B7280]">{colors.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map + sidebar */}
      <div className="flex-1 flex" style={{ minHeight: '600px' }}>
        {/* Map */}
        <div className="flex-1">
          <MapView
            onMapReady={handleMapReady}
            initialCenter={{ lat: 47.5480, lng: -122.2677 }}
            initialZoom={10}
            className="w-full h-full"
          />
        </div>

        {/* Selected resource sidebar */}
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-white border-l border-[#E8E7E1] overflow-y-auto flex-shrink-0"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-body font-semibold"
                  style={{
                    backgroundColor: getTypeColor(selectedResource.resource_type).bg,
                    color: getTypeColor(selectedResource.resource_type).text,
                    border: `1px solid ${getTypeColor(selectedResource.resource_type).border}`,
                  }}
                >
                  {selectedResource.resource_type}
                </span>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-[#9CA3AF] hover:text-[#374151]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-display text-[#1B4332] text-lg font-bold mb-1">{selectedResource.name}</h3>
              <div className="flex items-center gap-1.5 text-[#6B7280] text-sm font-body mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedResource.address}</span>
              </div>

              {isOpenNow(selectedResource) && (
                <div className="flex items-center gap-2 bg-[#D8F3DC] text-[#1B4332] px-3 py-1.5 rounded-lg text-xs font-body font-semibold mb-3 w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Open now
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-1">How to enter</p>
                  <p className="text-sm font-body text-[#374151] leading-relaxed">{selectedResource.how_to_enter}</p>
                </div>
                <div>
                  <p className="text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-1">Hours</p>
                  <p className="text-sm font-body text-[#374151]">{selectedResource.hours}</p>
                </div>
                <div>
                  <p className="text-xs font-body font-semibold text-[#374151] uppercase tracking-wider mb-1">Eligibility</p>
                  <p className="text-sm font-body text-[#374151]">{selectedResource.eligibility}</p>
                </div>
              </div>

              {/* Reality notes */}
              <div className="insider-note p-3 rounded-r-lg mb-4">
                <p className="text-[#78350F] text-xs font-body leading-relaxed">
                  <strong>Reality:</strong> {selectedResource.reality_notes}
                </p>
              </div>

              {/* Population tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selectedResource.population.map(p => (
                  <span key={p} className="px-2 py-0.5 bg-[#F0EFE9] text-[#374151] text-xs font-body rounded-full border border-[#E8E7E1]">
                    {POPULATION_LABELS[p]}
                  </span>
                ))}
              </div>

              {/* Data confidence */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${
                  selectedResource.data_confidence === 'High' ? 'bg-[#52B788]' :
                  selectedResource.data_confidence === 'Medium' ? 'bg-[#FCD34D]' : 'bg-[#FCA5A5]'
                }`} />
                <span className="text-xs font-body text-[#6B7280]">
                  {selectedResource.data_confidence} confidence · Verified {selectedResource.last_verified_date}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <a
                  href={`tel:${selectedResource.phone}`}
                  className="flex items-center gap-2 w-full px-4 py-2.5 bg-[#1B4332] text-white rounded-lg font-body font-medium text-sm hover:bg-[#2D6A4F] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call {selectedResource.phone}
                </a>
                {selectedResource.website && (
                  <a
                    href={selectedResource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full px-4 py-2.5 bg-white text-[#374151] rounded-lg font-body text-sm border border-[#E5E7EB] hover:border-[#52B788] transition-colors"
                  >
                    Visit website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

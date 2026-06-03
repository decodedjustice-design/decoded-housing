/*
 * PROPERTY DETAIL PAGE — Editorial Civic Design
 * Layout: Magazine-style two-column — left for all details, right for sticky contact + map
 */
import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import {
  MapPin, Phone, Mail, Globe, CheckCircle2, Clock, TrendingUp,
  Lightbulb, ArrowLeft, Building2, Users, Calendar, ExternalLink,
  ChevronRight, MessageSquare, Send, AlertTriangle, Star, FileText, Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HousingTypeBadge from '@/components/HousingTypeBadge';
import { MapView } from '@/components/Map';
import { Property } from '@/lib/types';
import propertiesData from '@/data/properties.json';
import { toast } from 'sonner';
import { CallingAssistantTrigger, ScriptTemplate } from '@/components/CallingAssistant';
import { getFreshness } from '@/lib/freshnessStore';
import { getPropertyMosaicPhotos } from '@/data/propertyPhotos';
import { getTransit } from '@/data/propertyTransit';
import { Train } from 'lucide-react';

const allProperties = propertiesData as Property[];

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const property = allProperties.find(p => p.id === id);
  const [mapReady, setMapReady] = useState(false);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [submitNote, setSubmitNote] = useState('');
  const [submitOutcome, setSubmitOutcome] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [streetViewMode, setStreetViewMode] = useState<'map' | 'street'>('map');
  const [svPanorama, setSvPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
  const [svAvailable, setSvAvailable] = useState<boolean | null>(null); // null = checking

  const handleMapReady = useCallback((map: google.maps.Map) => {
    setGoogleMap(map);
    setMapReady(true);
  }, []);

  useEffect(() => {
    if (!googleMap || !mapReady || !property) return;
    const pos = { lat: property.lat, lng: property.lng };
    googleMap.setCenter(pos);
    googleMap.setZoom(15);
    new google.maps.Marker({
      position: pos,
      map: googleMap,
      title: property.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#52B788',
        fillOpacity: 1,
        strokeColor: '#1B4332',
        strokeWeight: 2,
      },
    });
    // Check Street View availability
    const svService = new google.maps.StreetViewService();
    svService.getPanorama({ location: pos, radius: 50 }, (data, status) => {
      setSvAvailable(status === google.maps.StreetViewStatus.OK);
    });
  }, [googleMap, mapReady, property]);

  // Initialize Street View panorama when switching to street mode
  useEffect(() => {
    if (streetViewMode !== 'street' || !property) return;
    const container = document.getElementById('sv-container');
    if (!container) return;
    const pos = { lat: property.lat, lng: property.lng };
    const panorama = new google.maps.StreetViewPanorama(container, {
      position: pos,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: false,
      fullscreenControl: true,
      motionTracking: false,
      motionTrackingControl: false,
    });
    setSvPanorama(panorama);
    return () => { setSvPanorama(null); };
  }, [streetViewMode, property]);

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🏠</div>
            <h2 className="font-display text-[#1B4332] text-2xl font-bold mb-2">Property not found</h2>
            <button onClick={() => navigate('/search')} className="mt-4 px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm">
              Back to search
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitNote || !submitOutcome) {
      toast.error('Please fill in both fields before submitting.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your update helps others find housing.');
  };

  const lastVerifiedDate = new Date(property.last_verified);
  const daysSince = Math.floor((Date.now() - lastVerifiedDate.getTime()) / (1000 * 60 * 60 * 24));
  const freshness = getFreshness(property.id);

  // Build the calling script for this property
  const primaryType = property.housing_types.includes('ARCH') ? 'ARCH'
    : property.housing_types.includes('MFTE') ? 'MFTE'
    : property.housing_types.includes('Section 8') ? 'Section 8'
    : 'Shelter';
  const callingScript: ScriptTemplate = {
    id: `prop-${property.id}`,
    title: `Call ${property.name}`,
    type: primaryType,
    script: primaryType === 'ARCH'
      ? `"Hi, my name is [your name]. I'm looking for an ARCH income-restricted unit at [property name]. Do you currently have any available, or is there a waitlist I can join?"`
      : primaryType === 'MFTE'
      ? `"Hi, I'm looking for an MFTE income-qualified unit at [property name]. I understand your building participates in the Multifamily Tax Exemption program. Do you have any income-qualified homes available, or a waitlist?"`
      : `"Hi, my name is [your name]. I'm looking for an affordable unit at [property name]. Do you have any units available, or a waitlist I can join?"`,
    why: `Say the program name (${primaryType}) specifically — it signals you know what you're looking for and gets you a direct answer instead of a market-rate quote.`,
    color: primaryType === 'ARCH'
      ? { bg: '#D8F3DC', text: '#1B4332', border: '#95D5A3' }
      : primaryType === 'MFTE'
      ? { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }
      : { bg: '#DBEAFE', text: '#1E3A8A', border: '#93C5FD' },
  };

  // Photo mosaic: use real property photos from the photo map, with Unsplash fallbacks
  const [photo1, photo2, photo3] = getPropertyMosaicPhotos(property.id);
  const mosaicPhotos = [
    { url: photo1, alt: `${property.name} exterior` },
    { url: photo2, alt: `${property.name} building` },
    { url: photo3, alt: `${property.name} community` },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E8E7E1] py-3">
        <div className="container">
          <div className="flex items-center gap-2 text-sm font-body text-[#6B7280]">
            <button onClick={() => navigate('/search')} className="flex items-center gap-1 hover:text-[#1B4332] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Search results
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1B4332] font-medium truncate">{property.name}</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Photo mosaic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl overflow-hidden border border-[#E8E7E1]"
            >
              <div className="grid grid-cols-3 gap-1 h-48 sm:h-64">
                <div className="col-span-2 row-span-2 overflow-hidden">
                  <img
                    src={mosaicPhotos[0].url}
                    alt={mosaicPhotos[0].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&auto=format&fit=crop'; }}
                  />
                </div>
                <div className="overflow-hidden">
                  <img
                    src={mosaicPhotos[1].url}
                    alt={mosaicPhotos[1].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80&auto=format&fit=crop'; }}
                  />
                </div>
                <div className="overflow-hidden relative">
                  <img
                    src={mosaicPhotos[2].url}
                    alt={mosaicPhotos[2].alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80&auto=format&fit=crop'; }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-white font-body text-xs font-medium">View area</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Community Freshness Badges */}
            {(freshness.waitlistFull || freshness.noAnswerCount > 0 || freshness.lastVerified) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {freshness.waitlistFull && (
                  <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 text-xs font-body font-semibold px-3 py-1.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    High Competition — waitlist recently reported full
                  </span>
                )}
                {freshness.noAnswerCount >= 2 && (
                  <span className="flex items-center gap-1.5 bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] text-xs font-body font-semibold px-3 py-1.5 rounded-full">
                    📵 {freshness.noAnswerCount}× no answer reported
                  </span>
                )}
                {freshness.lastVerified && (
                  <span className="flex items-center gap-1.5 bg-[#D8F3DC] text-[#1B4332] border border-[#95D5A3] text-xs font-body font-semibold px-3 py-1.5 rounded-full">
                    <Star className="w-3 h-3" />
                    Community verified — waitlist open
                  </span>
                )}
              </motion.div>
            )}

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {property.housing_types.map(type => (
                  <HousingTypeBadge key={type} type={type} size="md" />
                ))}
                {property.verified && (
                  <span className="flex items-center gap-1 bg-[#D8F3DC] text-[#1B4332] text-sm font-body font-medium px-3 py-1 rounded-full border border-[#95D5A3]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
                {property.likely_available && (
                  <span className="flex items-center gap-1 bg-[#FEF3C7] text-[#92400E] text-sm font-body font-medium px-3 py-1 rounded-full border border-[#FCD34D]">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Likely available
                  </span>
                )}
              </div>
              <h1 className="font-display text-[#1B4332] text-3xl font-bold mb-2">{property.name}</h1>
              <div className="flex items-center gap-2 text-[#6B7280] font-body">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
              </div>
            </motion.div>

            {/* Key stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {[{
                  icon: <Users className="w-4 h-4" />,
                  label: 'Affordable Units',
                  value: property.prr_affordable_units ?? property.affordable_units,
                  sub: property.prr_market_units != null ? `${property.prr_market_units} market-rate` : undefined,
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: 'Year Built',
                  value: property.year_built || 'N/A',
                  sub: property.prr_status === 'In Development' ? 'In Development' : undefined,
                },
                {
                  icon: <CheckCircle2 className="w-4 h-4" />,
                  label: 'Last Verified',
                  value: `${daysSince}d ago`,
                  sub: property.prr_jurisdiction ?? undefined,
                },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#E8E7E1] p-4">
                  <div className="flex items-center gap-2 text-[#6B7280] mb-1">
                    {stat.icon}
                    <span className="text-xs font-body">{stat.label}</span>
                  </div>
                  <div className="font-data text-xl font-bold text-[#1B4332]">{stat.value}</div>
                  {stat.sub && <div className="text-[10px] font-body text-[#9CA3AF] mt-0.5">{stat.sub}</div>}
                </div>
              ))}
            </motion.div>

            {/* AMI levels — enhanced with PRR unit breakdown */}
            {(property.ami_levels.length > 0 || property.prr_ami_breakdown) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-xl border border-[#E8E7E1] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display text-[#1B4332] text-lg font-semibold">Income Limits (AMI)</h2>
                  {property.prr_matched && (
                    <span className="text-[10px] font-body text-[#6B7280] bg-[#F0EFE9] px-2 py-0.5 rounded-full border border-[#E8E7E1]">
                      Official ARCH data
                    </span>
                  )}
                </div>

                {/* PRR breakdown table — shows unit counts per tier */}
                {property.prr_ami_breakdown && Object.keys(property.prr_ami_breakdown).length > 0 ? (
                  <div className="space-y-2">
                    {(property.prr_ami_tiers ?? Object.keys(property.prr_ami_breakdown)).map(tier => {
                      const count = property.prr_ami_breakdown![tier];
                      const pct = property.prr_affordable_units
                        ? Math.round((count / property.prr_affordable_units) * 100)
                        : 0;
                      const amiNum = parseInt(tier.replace(' AMI', ''), 10);
                      const barColor = amiNum <= 50 ? '#52B788' : amiNum <= 80 ? '#D97706' : '#6B7280';
                      return (
                        <div key={tier} className="flex items-center gap-3">
                          <div className="w-20 shrink-0">
                            <span className="font-data text-sm font-bold text-[#1B4332]">{tier}</span>
                          </div>
                          <div className="flex-1 bg-[#F0EFE9] rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: barColor }}
                            />
                          </div>
                          <div className="w-16 text-right shrink-0">
                            <span className="font-data text-sm text-[#374151]">{count} units</span>
                          </div>
                        </div>
                      );
                    })}
                    {property.prr_short_term_units! > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="w-20 shrink-0">
                          <span className="font-data text-sm font-bold text-[#9CA3AF]">Short-term</span>
                        </div>
                        <div className="flex-1 bg-[#F0EFE9] rounded-full h-2 overflow-hidden">
                          <div className="h-full rounded-full bg-[#D1D5DB]" style={{ width: '10%' }} />
                        </div>
                        <div className="w-16 text-right shrink-0">
                          <span className="font-data text-sm text-[#9CA3AF]">{property.prr_short_term_units} units</span>
                        </div>
                      </div>
                    )}
                    {property.prr_has_lost_affordability && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-body text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Some units in this property have lost their affordability restriction.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {property.ami_levels.map(level => (
                      <span key={level} className="font-data text-sm bg-[#F0EFE9] text-[#374151] px-3 py-1.5 rounded-lg border border-[#E8E7E1]">
                        {level}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-[#6B7280] text-xs font-body mt-3">
                  AMI = Area Median Income. Your total household income must be at or below the listed percentage of King County's median income.
                </p>
              </motion.div>
            )}

            {/* Unit types */}
            {property.unit_types.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-[#E8E7E1] p-5"
              >
                <h2 className="font-display text-[#1B4332] text-lg font-semibold mb-3">Unit Types Available</h2>
                <div className="flex flex-wrap gap-2">
                  {property.unit_types.map(unit => (
                    <span key={unit} className="font-body text-sm bg-[#D8F3DC] text-[#1B4332] px-3 py-1.5 rounded-lg border border-[#95D5A3] font-medium">
                      {unit}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Insider tip */}
            {property.insider_tip && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="insider-note p-5 rounded-r-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#D97706] rounded-full flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-[#92400E] font-bold text-base mb-1">Insider Tip</h3>
                    <p className="text-[#78350F] font-body text-sm leading-relaxed">{property.insider_tip}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-[#E8E7E1] p-5"
            >
              <h2 className="font-display text-[#1B4332] text-lg font-semibold mb-3">About This Property</h2>
              <p className="text-[#374151] font-body text-sm leading-relaxed">{property.notes}</p>
            </motion.div>

            {/* Transit section */}
            {(() => {
              const transit = getTransit(property.id);
              if (!transit) return null;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32 }}
                  className="bg-white rounded-xl border border-[#E8E7E1] p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Train className="w-4 h-4 text-[#1B4332]" />
                    <h2 className="font-display text-[#1B4332] text-lg font-semibold">Nearest Transit</h2>
                  </div>
                  <div className="flex items-start gap-4">
                    {/* Line badge */}
                    <div className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl font-body font-bold text-sm ${
                      transit.line === '2 Line'
                        ? 'bg-[#1D4ED8] text-white'
                        : 'bg-[#166534] text-white'
                    }`}>
                      <span className="text-[10px] font-normal opacity-80">Link</span>
                      <span>{transit.line}</span>
                    </div>
                    {/* Station info */}
                    <div className="flex-1">
                      <div className="font-display font-semibold text-[#1B4332] text-base">{transit.station}</div>
                      <div className="text-[#6B7280] text-sm font-body mt-0.5">Sound Transit Link Light Rail</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-flex items-center gap-1 text-sm font-data font-semibold ${
                          transit.distance_miles <= 0.25 ? 'text-[#16A34A]' :
                          transit.distance_miles <= 0.5  ? 'text-[#D97706]' :
                          'text-[#374151]'
                        }`}>
                          <Navigation className="w-3.5 h-3.5" />
                          {transit.distance_str}
                        </span>
                        <span className="text-[#9CA3AF] text-xs font-body">·</span>
                        <span className="text-[#6B7280] text-sm font-body">{transit.walk_mins} min walk</span>
                        {transit.distance_miles <= 0.5 && (
                          <span className="ml-auto inline-flex items-center gap-1 bg-[#D8F3DC] text-[#1B4332] text-xs font-body font-semibold px-2 py-0.5 rounded-full">
                            ✓ Transit-accessible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://www.soundtransit.org/ride-with-us/stops-stations`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-1 text-[#1B4332] text-xs font-body font-medium hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Sound Transit schedules
                  </a>
                </motion.div>
              );
            })()}

            {/* Availability signals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-xl border border-[#E8E7E1] p-5"
            >
              <h2 className="font-display text-[#1B4332] text-lg font-semibold mb-4">Availability Signals</h2>
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-lg ${property.has_waitlist ? 'bg-[#FEF3C7] border border-[#FCD34D]' : 'bg-[#F9FAFB] border border-[#E5E7EB]'}`}>
                  <Clock className={`w-4 h-4 ${property.has_waitlist ? 'text-[#D97706]' : 'text-[#9CA3AF]'}`} />
                  <div>
                    <div className="font-body font-medium text-sm text-[#1F2937]">
                      {property.has_waitlist ? 'Waitlist available' : 'No known waitlist'}
                    </div>
                    {property.has_waitlist && (
                      <div className="text-xs text-[#6B7280] font-body mt-0.5">{property.waitlist_details}</div>
                    )}
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg ${property.upcoming_units ? 'bg-[#D8F3DC] border border-[#95D5A3]' : 'bg-[#F9FAFB] border border-[#E5E7EB]'}`}>
                  <TrendingUp className={`w-4 h-4 ${property.upcoming_units ? 'text-[#1B4332]' : 'text-[#9CA3AF]'}`} />
                  <div className="font-body font-medium text-sm text-[#1F2937]">
                    {property.upcoming_units ? 'Upcoming units reported' : 'No upcoming units reported'}
                  </div>
                </div>
              </div>
              <p className="text-[#9CA3AF] text-xs font-body mt-3">
                Last verified: {property.last_verified} · Source: {property.source}
              </p>
            </motion.div>

            {/* How to apply */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1B4332] rounded-xl p-5 text-white"
            >
              <h2 className="font-display text-white text-lg font-semibold mb-3">How to Apply</h2>
              <ol className="space-y-3">
                {[
                  'Call the leasing office directly using the number below.',
                  `Say: "I'm looking for an ${property.housing_types.includes('ARCH') ? 'ARCH income-restricted' : property.housing_types.includes('MFTE') ? 'MFTE income-qualified' : 'affordable'} unit. Do you have any available or a waitlist I can join?"`,
                  'If they say no, ask: "When do you expect units to open up?"',
                  'Ask to be added to any waitlist, even if it\'s long.',
                  'Follow up every 2–4 weeks.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#D97706] rounded-full flex items-center justify-center text-xs font-data font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[#D8F3DC] text-sm font-body leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* User submission form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-xl border border-[#E8E7E1] p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-[#1B4332]" />
                <h2 className="font-display text-[#1B4332] text-lg font-semibold">Share an Update</h2>
              </div>
              <p className="text-[#6B7280] text-sm font-body mb-4">
                Called this property? Share what you found out — it helps others in the same situation.
              </p>
              {submitted ? (
                <div className="flex items-center gap-3 bg-[#D8F3DC] rounded-lg p-4">
                  <CheckCircle2 className="w-5 h-5 text-[#1B4332]" />
                  <span className="text-[#1B4332] font-body font-medium text-sm">Thank you! Your update has been submitted.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-body font-semibold text-[#374151] mb-1">What happened when you called?</label>
                    <textarea
                      value={submitNote}
                      onChange={e => setSubmitNote(e.target.value)}
                      placeholder="e.g. They said the waitlist is open and to call back in March..."
                      rows={3}
                      className="w-full px-3 py-2 text-sm font-body text-[#1F2937] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-semibold text-[#374151] mb-1">Outcome</label>
                    <select
                      value={submitOutcome}
                      onChange={e => setSubmitOutcome(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-body text-[#1F2937] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                    >
                      <option value="">Select an outcome...</option>
                      <option value="available">Unit available now</option>
                      <option value="waitlist">Added to waitlist</option>
                      <option value="no-response">No response / voicemail</option>
                      <option value="denied">Denied / not eligible</option>
                      <option value="full">Waitlist full / closed</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body font-medium text-sm hover:bg-[#2D6A4F] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit update
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN — Sticky contact + map ── */}
          <div className="space-y-5">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Contact card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-[#E8E7E1] p-5"
              >
                <h3 className="font-display text-[#1B4332] text-base font-semibold mb-4">Contact This Property</h3>
                <div className="space-y-3">
                  {property.contact_phone && (
                    <a
                      href={`tel:${property.contact_phone}`}
                      className="flex items-center gap-3 p-3 bg-[#1B4332] text-white rounded-lg hover:bg-[#2D6A4F] transition-colors"
                    >
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <div className="text-xs opacity-75 font-body">Call directly</div>
                        <div className="font-data font-medium text-sm">{property.contact_phone}</div>
                      </div>
                    </a>
                  )}
                  {property.contact_email && (
                    <a
                      href={`mailto:${property.contact_email}`}
                      className="flex items-center gap-3 p-3 bg-[#F9FAFB] text-[#374151] rounded-lg border border-[#E5E7EB] hover:border-[#52B788] transition-colors"
                    >
                      <Mail className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
                      <div>
                        <div className="text-xs text-[#9CA3AF] font-body">Email</div>
                        <div className="font-body text-sm truncate">{property.contact_email}</div>
                      </div>
                    </a>
                  )}
                  {property.website && (
                    <a
                      href={property.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-[#F9FAFB] text-[#374151] rounded-lg border border-[#E5E7EB] hover:border-[#52B788] transition-colors"
                    >
                      <Globe className="w-4 h-4 flex-shrink-0 text-[#6B7280]" />
                      <div className="flex items-center gap-1">
                        <span className="font-body text-sm">Visit website</span>
                        <ExternalLink className="w-3 h-3 text-[#9CA3AF]" />
                      </div>
                    </a>
                  )}
                </div>
                <div className="mt-4 p-3 bg-[#FFFBEB] rounded-lg border border-[#FCD34D]/40">
                  <p className="text-[#92400E] text-xs font-body leading-relaxed">
                    <strong>What to say:</strong> "Hi, I'm looking for an {property.housing_types.includes('ARCH') ? 'ARCH income-restricted' : 'affordable'} unit. Do you have any available or a waitlist I can join?"
                  </p>
                </div>

                {/* Live Calling Assistant */}
                {property.contact_phone && (
                  <div className="mt-4">
                    <CallingAssistantTrigger
                      script={callingScript}
                      phoneNumber={property.contact_phone}
                      propertyName={property.name}
                      propertyId={property.id}
                      label="Open Live Calling Script"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#D97706] text-white rounded-lg font-body font-bold text-sm hover:bg-[#B45309] transition-colors"
                    />
                    <p className="text-xs font-body text-[#9CA3AF] text-center mt-1.5">Opens teleprompter with your name pre-filled</p>
                  </div>
                )}
              </motion.div>

              {/* Resource Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white rounded-xl border border-[#E8E7E1] p-5"
              >
                <h3 className="font-display text-[#1B4332] text-base font-semibold mb-3">Resources</h3>
                <div className="space-y-2">
                  <a
                    href="/how-it-works"
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#52B788] transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#1B4332] flex-shrink-0" />
                    <div>
                      <div className="font-body font-medium text-sm text-[#1F2937]">How ARCH/MFTE works</div>
                      <div className="text-xs text-[#9CA3AF] font-body">Income limits, AMI explained</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] ml-auto" />
                  </a>
                  <a
                    href="/scripts"
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#52B788] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                    <div>
                      <div className="font-body font-medium text-sm text-[#1F2937]">All calling scripts</div>
                      <div className="text-xs text-[#9CA3AF] font-body">Word-for-word scripts for every situation</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] ml-auto" />
                  </a>
                  <a
                    href="/shelter-finder"
                    className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] hover:border-[#52B788] transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <div>
                      <div className="font-body font-medium text-sm text-[#1F2937]">Need shelter now?</div>
                      <div className="text-xs text-[#9CA3AF] font-body">Emergency shelter finder</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] ml-auto" />
                  </a>
                </div>
              </motion.div>

              {/* Map / Street View panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl overflow-hidden border border-[#E8E7E1] bg-[#F0EFE9]"
              >
                {/* Toggle tabs */}
                <div className="flex border-b border-[#E8E7E1] bg-white">
                  <button
                    onClick={() => setStreetViewMode('map')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-body font-semibold transition-colors ${
                      streetViewMode === 'map'
                        ? 'text-[#1B4332] border-b-2 border-[#1B4332] bg-white'
                        : 'text-[#6B7280] hover:text-[#1B4332]'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Map
                  </button>
                  <button
                    onClick={() => {
                      if (svAvailable === false) {
                        toast.info('Street View is not available for this location.');
                        return;
                      }
                      setStreetViewMode('street');
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-body font-semibold transition-colors ${
                      streetViewMode === 'street'
                        ? 'text-[#1B4332] border-b-2 border-[#1B4332] bg-white'
                        : svAvailable === false
                          ? 'text-[#D1D5DB] cursor-not-allowed'
                          : 'text-[#6B7280] hover:text-[#1B4332]'
                    }`}
                    title={svAvailable === false ? 'Street View not available at this location' : 'View street-level imagery'}
                  >
                    {/* Pegman icon */}
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="3" />
                      <path d="M12 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      <path d="M8 18l1 4h6l1-4H8z" opacity="0.6" />
                    </svg>
                    Street View
                    {svAvailable === null && (
                      <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#D1D5DB] animate-pulse" />
                    )}
                    {svAvailable === false && (
                      <span className="ml-1 text-[10px] text-[#D1D5DB]">(unavailable)</span>
                    )}
                  </button>
                </div>

                {/* Map view */}
                <div
                  style={{ height: '220px', display: streetViewMode === 'map' ? 'block' : 'none' }}
                >
                  <MapView
                    onMapReady={handleMapReady}
                    initialCenter={{ lat: property.lat, lng: property.lng }}
                    initialZoom={15}
                    className="w-full h-full"
                  />
                </div>

                {/* Street View container */}
                {streetViewMode === 'street' && (
                  <div
                    id="sv-container"
                    style={{ height: '220px', width: '100%' }}
                    className="relative"
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-[#F0EFE9] z-0">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🚶</div>
                        <p className="text-[#6B7280] text-xs font-body">Loading Street View…</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Open in Google Maps link */}
                <div className="px-3 py-2 bg-white border-t border-[#E8E7E1] flex items-center justify-between">
                  <span className="text-[#9CA3AF] text-[10px] font-body">{property.address}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ', ' + property.city + ', WA')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#1B4332] text-[10px] font-body font-medium hover:underline"
                  >
                    Open in Maps <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </motion.div>

              {/* Source info */}
              <div className="bg-[#F9FAFB] rounded-xl border border-[#E8E7E1] p-4">
                <p className="text-[#9CA3AF] text-xs font-body leading-relaxed">
                  Data source: {property.source}. Last verified {property.last_verified}. Always verify directly with the property before applying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

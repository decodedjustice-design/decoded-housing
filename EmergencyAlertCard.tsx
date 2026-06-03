/**
 * EmergencyAlertCard — Severe Weather Emergency Activation Layer
 *
 * Only renders when severe weather is active.
 * Always placed ABOVE all other decision engine cards.
 * High-contrast red/orange alert styling.
 * Includes: activation summary, hotline CTA, location list, fallback trigger.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Phone, MapPin, ExternalLink, ChevronDown,
  RefreshCw, Clock, Navigation, Copy, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { SevereWeatherStatus, SevereWeatherLocation } from '@/hooks/useSevereWeather';

interface EmergencyAlertCardProps {
  status: SevereWeatherStatus;
  onRefresh: () => void;
  onFallback: () => void;   // called when user reports "shelter full / didn't work"
  loading?: boolean;
}

function LocationRow({ loc }: { loc: SevereWeatherLocation }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-red-200/50 last:border-0">
      <div className="flex-shrink-0 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center mt-0.5">
        <MapPin className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-body font-semibold text-red-900 text-sm leading-tight">{loc.name}</p>
            <p className="text-red-700 text-xs font-body mt-0.5">{loc.address}</p>
            {loc.population && loc.population !== 'All' && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-800 text-xs font-body rounded-full border border-red-200">
                {loc.population}
              </span>
            )}
            {loc.notes && (
              <p className="text-red-600 text-xs font-body mt-1 italic">{loc.notes}</p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 text-red-700 text-xs font-body">
              <Clock className="w-3 h-3" />
              <span>{loc.hours}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white rounded-md text-xs font-body font-medium hover:bg-red-700 transition-colors"
          >
            <Navigation className="w-3 h-3" />
            Directions
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(loc.address);
              toast.success('Address copied');
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-white text-red-700 border border-red-200 rounded-md text-xs font-body hover:border-red-400 transition-colors"
          >
            <Copy className="w-3 h-3" />
            Copy address
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EmergencyAlertCard({
  status,
  onRefresh,
  onFallback,
  loading = false,
}: EmergencyAlertCardProps) {
  const [locationsExpanded, setLocationsExpanded] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  const lastChecked = new Date(status.last_checked);
  const minutesAgo = Math.round((Date.now() - lastChecked.getTime()) / 60000);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl overflow-hidden border-2 border-red-500 shadow-lg shadow-red-100"
    >
      {/* ── ALERT HEADER ── */}
      <div className="bg-red-600 px-5 py-4">
        <div className="flex items-start gap-3">
          {/* Pulsing alert icon */}
          <div className="relative flex-shrink-0 mt-0.5">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full animate-pulse border-2 border-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-yellow-300 text-xs font-body font-bold uppercase tracking-widest">
                🚨 Emergency Activation
              </span>
              {status.tier && (
                <span className="px-2 py-0.5 bg-yellow-400 text-red-900 text-xs font-body font-bold rounded-full">
                  {status.tier}
                </span>
              )}
            </div>
            <h2 className="font-display text-white text-xl font-bold leading-tight">
              Emergency Shelter Open Tonight
            </h2>
            <p className="text-red-100 text-sm font-body mt-1 leading-relaxed">
              Severe weather shelters are currently activated in King County. Immediate indoor shelter may be available.
            </p>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="bg-red-50 px-5 py-4 space-y-4">

        {/* Navigation Hotline — primary CTA */}
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="text-red-800 text-xs font-body font-semibold uppercase tracking-wider mb-2">
            Step 1 — Call the Navigation Hotline
          </p>
          <p className="text-red-700 text-sm font-body mb-3 leading-relaxed">
            The KCRHA hotline has real-time bed counts and can arrange transportation for families with children.
            Available <strong>7:00 am – 10:30 pm</strong> during activations.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${status.hotline}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-body font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              Call {status.hotline}
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(status.hotline);
                toast.success(`Copied ${status.hotline}`);
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-white text-red-700 border border-red-200 rounded-lg text-sm font-body hover:border-red-400 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          </div>
        </div>

        {/* View open shelters */}
        <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
          <button
            onClick={() => setLocationsExpanded(!locationsExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-50/50 transition-colors"
          >
            <div>
              <p className="text-red-800 text-xs font-body font-semibold uppercase tracking-wider">
                Step 2 — View Open Shelters
              </p>
              {status.locations.length > 0 ? (
                <p className="text-red-600 text-xs font-body mt-0.5">
                  {status.locations.length} location{status.locations.length !== 1 ? 's' : ''} found
                </p>
              ) : (
                <p className="text-red-600 text-xs font-body mt-0.5">
                  Check KCRHA for full location list
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={status.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-body font-medium hover:bg-red-700 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                KCRHA.org
              </a>
              <ChevronDown className={`w-4 h-4 text-red-500 transition-transform ${locationsExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <AnimatePresence>
            {locationsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-red-100">
                  {status.locations.length > 0 ? (
                    <div className="mt-3">
                      {status.locations.map((loc, i) => (
                        <LocationRow key={i} loc={loc} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                      <p className="text-red-700 text-sm font-body leading-relaxed">
                        Location details are posted on the KCRHA website during activations. Click "KCRHA.org" above for the full list, or call the hotline for immediate directions.
                      </p>
                      <a
                        href={status.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 mt-2 text-red-600 text-xs font-body font-semibold hover:text-red-800"
                      >
                        View full location list on KCRHA.org
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Step 3 — Fallback */}
        <div className="bg-white rounded-xl border border-red-200 p-4">
          <p className="text-red-800 text-xs font-body font-semibold uppercase tracking-wider mb-1">
            Step 3 — If Emergency Shelter is Full
          </p>
          <p className="text-red-700 text-sm font-body mb-3">
            If the emergency shelter is at capacity, continue with standard shelter options below.
          </p>
          {!showFallback ? (
            <button
              onClick={() => {
                setShowFallback(true);
                onFallback();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-red-700 border border-red-300 rounded-lg text-sm font-body font-medium hover:border-red-500 hover:bg-red-50 transition-colors"
            >
              Shelter was full — show other options
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-red-700 text-sm font-body">
              <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-xs">✓</span>
              Showing standard shelter options below
            </div>
          )}
        </div>

        {/* Meta: last checked + refresh */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-red-500 text-xs font-body">
            <Clock className="w-3 h-3" />
            <span>
              Checked {minutesAgo === 0 ? 'just now' : `${minutesAgo}m ago`} · Auto-refreshes every 10 min
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1 text-red-500 text-xs font-body hover:text-red-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
    </motion.div>
  );
}

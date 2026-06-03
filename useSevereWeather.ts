/**
 * useSevereWeather — Real-time Emergency Activation Layer
 *
 * Fetches https://kcrha.org/severe-weather-shelter/ every 10 minutes.
 * Detects activation via keyword matching on the page text.
 * Parses visible shelter locations from accordion sections.
 * Caches result in sessionStorage to survive React re-renders.
 *
 * KCRHA page structure (observed 2026-04-23):
 *   NOT active: "Severe Weather Protocols are not currently activated."
 *   ACTIVE:     "activated" / "open" / "severe weather shelters are open"
 *               + accordion sections per region with location details
 */

import { useState, useEffect, useCallback } from 'react';

export interface SevereWeatherLocation {
  name: string;
  address: string;
  region: string;
  population: string;
  hours: string;
  notes?: string;
}

export interface SevereWeatherStatus {
  active: boolean;
  locations: SevereWeatherLocation[];
  summary: string;
  hotline: string;
  source_url: string;
  last_checked: string;
  tier?: string; // "Tier 2" | "Tier 3" | undefined
  error?: string;
}

const SOURCE_URL = 'https://kcrha.org/severe-weather-shelter/';
const HOTLINE = '(206) 245-1026';
const CACHE_KEY = 'decoded_severe_weather_cache';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ── CORS PROXY URLS (tried in order) ──
const PROXY_URLS = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

// ── ACTIVATION KEYWORD DETECTION ──
const INACTIVE_PHRASES = [
  'not currently activated',
  'protocols are not currently',
  'not activated',
  'no current activation',
  'no severe weather activation',
];

const ACTIVE_PHRASES = [
  'severe weather shelters are open',
  'severe weather protocols are activated',
  'tier 2 activation',
  'tier 3 activation',
  'shelters are now open',
  'activation is in effect',
  'shelters are currently open',
  'currently activated',
  'warming shelters are open',
];

function detectActivation(text: string): { active: boolean; tier?: string } {
  const lower = text.toLowerCase();

  // Explicit inactive signal takes priority
  if (INACTIVE_PHRASES.some(p => lower.includes(p))) {
    return { active: false };
  }

  // Check for active signals
  for (const phrase of ACTIVE_PHRASES) {
    if (lower.includes(phrase)) {
      const tierMatch = lower.match(/tier\s*([23])/);
      return { active: true, tier: tierMatch ? `Tier ${tierMatch[1]}` : undefined };
    }
  }

  // Fallback: look for "activated" near "severe weather"
  const activatedIdx = lower.indexOf('activated');
  if (activatedIdx !== -1) {
    const context = lower.slice(Math.max(0, activatedIdx - 100), activatedIdx + 100);
    if (context.includes('severe weather') || context.includes('shelter')) {
      // Only treat as active if NOT preceded by "not"
      if (!context.includes('not currently') && !context.includes('not activated')) {
        return { active: true };
      }
    }
  }

  return { active: false };
}

// ── LOCATION PARSER ──
// Parses accordion section text for location names, addresses, hours
function parseLocations(text: string): SevereWeatherLocation[] {
  const locations: SevereWeatherLocation[] = [];

  // Region sections we look for
  const regions = [
    'East King County',
    'North King County',
    'South & Southeast King County',
    'South and Southeast King County',
    'Seattle',
    'Snoqualmie Valley',
  ];

  // Split text by region headers
  for (const region of regions) {
    const regionIdx = text.indexOf(region);
    if (regionIdx === -1) continue;

    // Extract ~1500 chars after the region header
    const section = text.slice(regionIdx, regionIdx + 1500);

    // Look for patterns like "Name\nAddress\nHours" or address-like strings
    // Address pattern: number + street name
    const addressPattern = /\d+\s+[A-Z][a-zA-Z\s]+(?:Ave|St|Blvd|Dr|Rd|Way|Ln|Pl|Ct|Pkwy|Hwy)[^\n]*/g;
    const addressMatches = section.match(addressPattern);

    if (addressMatches) {
      addressMatches.forEach(addr => {
        // Try to find a name before the address
        const addrIdx = section.indexOf(addr);
        const before = section.slice(Math.max(0, addrIdx - 200), addrIdx);
        const lines = before.split('\n').filter(l => l.trim().length > 3);
        const name = lines[lines.length - 1]?.trim() || 'Severe Weather Shelter';

        // Try to find hours after address
        const after = section.slice(addrIdx, addrIdx + 300);
        const hoursMatch = after.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);

        locations.push({
          name: name.replace(/[#*]/g, '').trim(),
          address: addr.trim(),
          region,
          population: 'All',
          hours: hoursMatch ? hoursMatch[1] : 'Check KCRHA for hours',
        });
      });
    }
  }

  return locations;
}

// ── FETCH WITH PROXY ──
async function fetchWithProxy(url: string): Promise<string> {
  for (const makeProxyUrl of PROXY_URLS) {
    try {
      const proxyUrl = makeProxyUrl(url);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const data = await res.json();
      // allorigins returns { contents: "..." }
      if (data.contents) return data.contents;
      // corsproxy returns raw text
      if (typeof data === 'string') return data;
    } catch {
      // try next proxy
    }
  }
  throw new Error('All proxies failed');
}

// ── MAIN CHECK FUNCTION ──
async function checkSevereWeatherActivation(): Promise<SevereWeatherStatus> {
  const now = new Date();

  try {
    const html = await fetchWithProxy(SOURCE_URL);

    // Strip HTML tags for text analysis
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const { active, tier } = detectActivation(text);
    const locations = active ? parseLocations(text) : [];

    // Build summary from page text
    let summary = '';
    if (active) {
      const tierLabel = tier ? ` (${tier})` : '';
      summary = `Severe weather shelters are currently activated${tierLabel} in King County. Call the navigation hotline for shelter locations and transportation assistance.`;
    } else {
      // Extract the current status sentence
      const statusMatch = text.match(/Severe Weather Protocols[^.]+\./i);
      summary = statusMatch ? statusMatch[0] : 'Severe weather protocols are not currently activated.';
    }

    return {
      active,
      locations,
      summary,
      hotline: HOTLINE,
      source_url: SOURCE_URL,
      last_checked: now.toISOString(),
      tier,
    };
  } catch (err) {
    return {
      active: false,
      locations: [],
      summary: 'Unable to check severe weather status. Check kcrha.org directly.',
      hotline: HOTLINE,
      source_url: SOURCE_URL,
      last_checked: now.toISOString(),
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ── REACT HOOK ──
export function useSevereWeather() {
  const [status, setStatus] = useState<SevereWeatherStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    // Check sessionStorage cache first
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: SevereWeatherStatus = JSON.parse(cached);
        const age = Date.now() - new Date(parsed.last_checked).getTime();
        if (age < CACHE_TTL_MS) {
          setStatus(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {
      // ignore cache errors
    }

    setLoading(true);
    const result = await checkSevereWeatherActivation();
    setStatus(result);
    setLoading(false);

    // Cache result
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    refresh();

    // Auto-refresh every 10 minutes
    const interval = setInterval(refresh, CACHE_TTL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return { status, loading, refresh };
}

// ── FORCE ACTIVE (for testing/demo) ──
export function forceActiveSevereWeather(): SevereWeatherStatus {
  return {
    active: true,
    tier: 'Tier 2',
    locations: [
      {
        name: 'Crossroads Mall (East KC)',
        address: '15600 NE 8th St, Bellevue, WA 98008',
        region: 'East King County',
        population: 'All',
        hours: '7pm – 7am',
        notes: 'Entrance via north parking lot. Bring ID if available.',
      },
      {
        name: 'Eastgate Community Center',
        address: '14350 SE Eastgate Way, Bellevue, WA 98007',
        region: 'East King County',
        population: 'Families with children',
        hours: '6pm – 8am',
        notes: 'Family-designated area available. Call hotline for transport.',
      },
      {
        name: 'Multi-Service Center (South KC)',
        address: '1200 S 336th St, Federal Way, WA 98003',
        region: 'South & Southeast King County',
        population: 'All',
        hours: '7pm – 7am',
      },
    ],
    summary: 'Severe weather shelters are currently activated (Tier 2) in King County. Call the navigation hotline for shelter locations and transportation assistance.',
    hotline: HOTLINE,
    source_url: SOURCE_URL,
    last_checked: new Date().toISOString(),
  };
}

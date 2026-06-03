/**
 * COMMUNITY FRESHNESS STORE
 * In-memory store for user-submitted signals about property status.
 * Persisted to localStorage so signals survive page refresh.
 *
 * Signal types:
 *   waitlist_open   → updates last_verified timestamp; pin = Pulse Green
 *   waitlist_full   → adds "High Competition" badge; suppressed from "Immediate Need" searches
 *   no_answer       → flags for admin after 3 reports
 */

export type SignalType = 'waitlist_open' | 'waitlist_full' | 'no_answer';

export interface PropertySignal {
  propertyId: string;
  type: SignalType;
  timestamp: string; // ISO
}

export interface PropertyFreshness {
  propertyId: string;
  lastVerified: string | null;      // ISO — set when waitlist_open reported
  waitlistFull: boolean;
  noAnswerCount: number;
  flaggedForAdmin: boolean;
}

const STORAGE_KEY = 'decoded_housing_signals';

function loadSignals(): PropertySignal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSignals(signals: PropertySignal[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(signals));
  } catch {
    // storage full or unavailable
  }
}

export function submitSignal(propertyId: string, type: SignalType): void {
  const signals = loadSignals();
  signals.push({ propertyId, type, timestamp: new Date().toISOString() });
  saveSignals(signals);
}

export function getFreshness(propertyId: string): PropertyFreshness {
  const signals = loadSignals().filter(s => s.propertyId === propertyId);

  const openSignals = signals.filter(s => s.type === 'waitlist_open');
  const lastVerified = openSignals.length > 0
    ? openSignals.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0].timestamp
    : null;

  const waitlistFull = signals.some(s => s.type === 'waitlist_full');
  const noAnswerCount = signals.filter(s => s.type === 'no_answer').length;

  return {
    propertyId,
    lastVerified,
    waitlistFull,
    noAnswerCount,
    flaggedForAdmin: noAnswerCount >= 3,
  };
}

export function getAllFreshness(): Record<string, PropertyFreshness> {
  const signals = loadSignals();
  const byProp: Record<string, PropertySignal[]> = {};
  for (const s of signals) {
    if (!byProp[s.propertyId]) byProp[s.propertyId] = [];
    byProp[s.propertyId].push(s);
  }

  const result: Record<string, PropertyFreshness> = {};
  for (const [id, propSignals] of Object.entries(byProp)) {
    const openSignals = propSignals.filter(s => s.type === 'waitlist_open');
    const lastVerified = openSignals.length > 0
      ? openSignals.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0].timestamp
      : null;
    const waitlistFull = propSignals.some(s => s.type === 'waitlist_full');
    const noAnswerCount = propSignals.filter(s => s.type === 'no_answer').length;
    result[id] = { propertyId: id, lastVerified, waitlistFull, noAnswerCount, flaggedForAdmin: noAnswerCount >= 3 };
  }
  return result;
}

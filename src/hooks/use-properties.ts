import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties"> & {
  affordable?: number | null;
  waitlist?: string | null;
  likely?: string | null;
  transit_station?: string | null;
  transit_label?: string | null;
  phone?: string | null;
  website?: string | null;
  photos?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
};

interface EnrichedProperty {
  id: string;
  name: string;
  city: string | null;
  housing_types?: string[];
  photos?: string[];
  website?: string;
}

interface EnrichedPayload {
  properties: EnrichedProperty[];
}

export interface PropertyFilters {
  search?: string;
  types?: string[];
  cities?: string[];
  voucher?: boolean;
  verified?: boolean;
  transit?: boolean;
  sort?: string;
}

function applyFilters(rows: Property[], filters: PropertyFilters) {
  let result = [...rows];

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) => p.name?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.address?.toLowerCase().includes(q),
    );
  }

  if (filters.types?.length) result = result.filter((p) => p.types?.some((t) => filters.types?.includes(t)));
  if (filters.cities?.length) result = result.filter((p) => filters.cities?.includes(p.city ?? ""));
  if (filters.voucher) result = result.filter((p) => p.voucher);
  if (filters.verified) result = result.filter((p) => p.verified);
  if (filters.transit) result = result.filter((p) => (p.transit_distance ?? Number.POSITIVE_INFINITY) <= 0.5);

  if (filters.sort === "ami_asc") result.sort((a, b) => Number.parseInt(a.ami?.[0] ?? "999", 10) - Number.parseInt(b.ami?.[0] ?? "999", 10));
  if (filters.sort === "transit") result.sort((a, b) => (a.transit_distance ?? Number.POSITIVE_INFINITY) - (b.transit_distance ?? Number.POSITIVE_INFINITY));
  if (filters.sort === "verified") result.sort((a, b) => Number(b.verified) - Number(a.verified));
  if (filters.sort === "recent") result.sort((a, b) => (a.updated_days ?? Number.POSITIVE_INFINITY) - (b.updated_days ?? Number.POSITIVE_INFINITY));

  return result;
}

async function loadStaticFallback(): Promise<Property[]> {
  const response = await fetch("/data/properties_enriched.json");
  if (!response.ok) throw new Error(`Failed to load static properties (${response.status})`);
  const payload = (await response.json()) as EnrichedPayload;
  return (payload.properties ?? []).map<Property>((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    address: null,
    types: p.housing_types ?? [],
    ami: [],
    units: [],
    affordable_units: null,
    total_units: null,
    program_type: null,
    source: null,
    status: null,
    year: null,
    zip: null,
    created_at: new Date().toISOString(),
    affordable: null,
    verified: Boolean(p.website),
    waitlist: null,
    likely: null,
    voucher: false,
    transit_station: null,
    transit_distance: null,
    transit_label: null,
    updated_days: null,
    insider: null,
    image_url: p.photos?.[0] ?? null,
    photos: p.photos ?? [],
    phone: null,
    website: p.website ?? null,
    latitude: null,
    longitude: null,
  }));
}

export function useProperties(filters: PropertyFilters) {
  const [rawData, setRawData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"supabase" | "static" | "loading">("loading");

  useEffect(() => {
    let cancelled = false;

    async function fetchProperties() {
      setError(null);
      setSource("loading");
      const env = import.meta.env as Record<string, string | undefined>;
      const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
      const SUPABASE_PUBLISHABLE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

      if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
        console.info("[housing] Supabase env missing; loading static property source");
        try {
          const fallbackRows = await loadStaticFallback();
          if (cancelled) return;
          setRawData(fallbackRows);
          setSource("static");
          setError("Supabase environment variables are not configured, so the static property file is being used.");
          setLoading(false);
          return;
        } catch (fallbackError) {
          console.error("[housing] Static property source failed", fallbackError);
          setError("Unable to load properties. Please try again later.");
          setRawData([]);
          setSource("static");
          setLoading(false);
          return;
        }
      }

      console.info("[housing] Loading canonical property source: supabase.properties");

      const { data: rows, error: dbError } = await supabase.from("properties").select("*");
      if (cancelled) return;

      if (dbError) {
        console.warn("[housing] Supabase load failed, falling back to static JSON", dbError.message);
        try {
          const fallbackRows = await loadStaticFallback();
          if (cancelled) return;
          console.info("[housing] Fallback property source loaded", { count: fallbackRows.length });
          setRawData(fallbackRows);
          setSource("static");
          setLoading(false);
          return;
        } catch (fallbackError) {
          console.error("[housing] Fallback property source failed", fallbackError);
          setError("Unable to load properties. Please try again later.");
          setRawData([]);
          setSource("static");
          setLoading(false);
          return;
        }
      }

      const normalized = (rows ?? []) as Property[];
      console.info("[housing] Supabase property source loaded", { count: normalized.length });
      setRawData(normalized);
      setSource("supabase");
      setLoading(false);
    }

    void fetchProperties();
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => applyFilters(rawData, filters), [rawData, filters]);

  return { data, loading, error, totalLoaded: rawData.length, source };
}

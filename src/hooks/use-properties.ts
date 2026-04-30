import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;

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
  return (payload.properties ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city,
    address: null,
    types: p.housing_types ?? null,
    ami: null,
    units: null,
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

  useEffect(() => {
    let cancelled = false;

    async function fetchProperties() {
      setError(null);
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
          setLoading(false);
          return;
        } catch (fallbackError) {
          setError(fallbackError instanceof Error ? fallbackError.message : "Unable to load properties");
          setRawData([]);
          setLoading(false);
          return;
        }
      }

      const normalized = (rows ?? []) as Property[];
      console.info("[housing] Supabase property source loaded", { count: normalized.length });
      setRawData(normalized);
      setLoading(false);
    }

    void fetchProperties();
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => applyFilters(rawData, filters), [rawData, filters]);

  return { data, loading, error, totalLoaded: rawData.length };
}

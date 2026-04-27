import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Resource = Tables<"resources">;
export type ResourceCategory = "food" | "utilities" | "furniture" | "rental" | "legal";

export const CATEGORY_LABEL: Record<ResourceCategory, string> = {
  food: "Food",
  utilities: "Utilities",
  furniture: "Furniture",
  rental: "Rent & Eviction",
  legal: "Legal Help",
};

export const DEFAULT_CITY = "Redmond";

const EASTSIDE_CITIES = ["Redmond", "Bellevue", "Kirkland"] as const;
const LOCATION_CITY_CANDIDATES = ["Redmond", "Bellevue", "Kirkland", "Seattle"] as const;

const CITY_CENTERS: Record<(typeof LOCATION_CITY_CANDIDATES)[number], { lat: number; lng: number }> = {
  Redmond: { lat: 47.673988, lng: -122.121513 },
  Bellevue: { lat: 47.610149, lng: -122.201515 },
  Kirkland: { lat: 47.676945, lng: -122.206017 },
  Seattle: { lat: 47.606209, lng: -122.332069 },
};

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(x));
}

export function cityFromCoordinates(lat: number, lng: number): string {
  let nearestCity = DEFAULT_CITY;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const city of LOCATION_CITY_CANDIDATES) {
    const d = distanceKm({ lat, lng }, CITY_CENTERS[city]);
    if (d < nearestDistance) {
      nearestCity = city;
      nearestDistance = d;
    }
  }

  return nearestCity;
}

export function sortByCityAndPriority(rows: Resource[], userCity: string): Resource[] {
  const cityRank = (c: string | null) => {
    if (!c) return 99;
    if (c.toLowerCase() === userCity.toLowerCase()) return 0;

    const idx = EASTSIDE_CITIES.findIndex((x) => x.toLowerCase() === c.toLowerCase());
    if (idx !== -1) return idx + 1;

    return 50;
  };
  return [...rows].sort((a, b) => {
    const c = cityRank(a.city) - cityRank(b.city);
    if (c !== 0) return c;
    return a.priority_level - b.priority_level;
  });
}

export interface UseResourcesOpts {
  category?: ResourceCategory | ResourceCategory[];
  city?: string;
  urgentOnly?: boolean;
  limit?: number;
}

export function useResources(opts: UseResourcesOpts = {}) {
  const { category, city = DEFAULT_CITY, urgentOnly = false, limit } = opts;
  const catKey = Array.isArray(category) ? category.join(",") : category ?? "";

  const [data, setData] = useState<Resource[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    let q = supabase.from("resources").select("*");
    if (category) {
      if (Array.isArray(category)) q = q.in("category", category);
      else q = q.eq("category", category);
    }
    if (urgentOnly) q = q.eq("priority_level", 1);
    q = q.order("priority_level", { ascending: true }).order("name", { ascending: true });
    if (limit) q = q.limit(limit);

    q.then(({ data: rows, error: err }) => {
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setData([]);
      } else {
        setData(sortByCityAndPriority(rows ?? [], city));
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [catKey, city, urgentOnly, limit]);

  return { data: data ?? [], loading, error };
}

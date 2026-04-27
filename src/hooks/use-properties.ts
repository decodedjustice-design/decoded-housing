import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;
export type PropertySort = "ami_asc" | "transit" | "verified" | "recent";

export interface UsePropertiesFilters {
  search?: string;
  types?: string[];
  cities?: string[];
  voucher?: boolean;
  verified?: boolean;
  transit?: boolean;
  sort?: PropertySort;
  /** Maximum AMI percentage band to include (e.g. 60 means only show ≤60% AMI bands) */
  maxAmi?: number;
  /** Bedroom size labels to match against units[] (e.g. "Studio", "1BR", "2BR", "3BR", "4BR+") */
  bedrooms?: string[];
}

function getMinimumAmi(ami: string[] | null): number {
  if (!ami || ami.length === 0) return Number.POSITIVE_INFINITY;

  const matches = ami
    .flatMap((value) => value.match(/\d+/g) ?? [])
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value));

  return matches.length ? Math.min(...matches) : Number.POSITIVE_INFINITY;
}

function sortProperties(rows: Property[], sort: PropertySort = "recent") {
  const sorted = [...rows];

  if (sort === "ami_asc") {
    return sorted.sort((a, b) => getMinimumAmi(a.ami) - getMinimumAmi(b.ami));
  }

  if (sort === "transit") {
    return sorted.sort((a, b) => (a.transit_distance ?? Number.POSITIVE_INFINITY) - (b.transit_distance ?? Number.POSITIVE_INFINITY));
  }

  if (sort === "verified") {
    return sorted.sort((a, b) => Number(b.verified) - Number(a.verified));
  }

  return sorted.sort((a, b) => (a.updated_days ?? Number.POSITIVE_INFINITY) - (b.updated_days ?? Number.POSITIVE_INFINITY));
}

export function useProperties(filters: UsePropertiesFilters = {}) {
  const [rows, setRows] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase
      .from("properties")
      .select("*")
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;

        if (fetchError) {
          setError(fetchError.message);
          setRows([]);
        } else {
          setRows(data ?? []);
        }

        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(() => {
    const search = filters.search?.trim().toLowerCase();

    let filtered = rows.filter((property) => {
      if (search) {
        const haystack = `${property.name ?? ""} ${property.city ?? ""} ${property.address ?? ""}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      if (filters.types && filters.types.length > 0) {
        const rowTypes = property.types ?? [];
        if (!filters.types.some((type) => rowTypes.includes(type))) return false;
      }

      if (filters.cities && filters.cities.length > 0) {
        if (!filters.cities.includes(property.city ?? "")) return false;
      }

      if (filters.voucher === true && !property.voucher) return false;
      if (filters.verified === true && !property.verified) return false;

      if (filters.transit === true) {
        if ((property.transit_distance ?? Number.POSITIVE_INFINITY) > 0.5) return false;
      }

      if (typeof filters.maxAmi === "number") {
        const minAmi = getMinimumAmi(property.ami);
        if (!Number.isFinite(minAmi)) return false;
        if (minAmi > filters.maxAmi) return false;
      }

      if (filters.bedrooms && filters.bedrooms.length > 0) {
        const unitLabels = (property.units ?? []).join(" ");
        const matched = filters.bedrooms.some((bed) => unitLabels.includes(bed));
        if (!matched) return false;
      }

      return true;
    });

    filtered = sortProperties(filtered, filters.sort);
    return filtered;
  }, [
    rows,
    filters.search,
    filters.types,
    filters.cities,
    filters.voucher,
    filters.verified,
    filters.transit,
    filters.sort,
    filters.maxAmi,
    filters.bedrooms,
  ]);

  return { data, loading, error };
}

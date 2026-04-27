import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;

export interface PropertyFilters {
  search?: string;
  types?: string[];
  cities?: string[];
  voucher?: boolean;
  verified?: boolean;
  transit?: boolean;
  sort?: string;
}

export function useProperties(filters: PropertyFilters) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProperties() {
      setLoading(true);
      setError(null);

      const { data: rows, error } = await supabase.from("properties").select("*");

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setData([]);
        setLoading(false);
        return;
      }

      let result = (rows ?? []) as Property[];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.city?.toLowerCase().includes(q) ||
            p.address?.toLowerCase().includes(q),
        );
      }

      if (filters.types?.length) {
        result = result.filter((p) => p.types?.some((t) => filters.types?.includes(t)));
      }

      if (filters.cities?.length) {
        result = result.filter((p) => filters.cities?.includes(p.city ?? ""));
      }

      if (filters.voucher) {
        result = result.filter((p) => p.voucher);
      }

      if (filters.verified) {
        result = result.filter((p) => p.verified);
      }

      if (filters.transit) {
        result = result.filter((p) => (p.transit_distance ?? Number.POSITIVE_INFINITY) <= 0.5);
      }

      if (filters.sort === "ami_asc") {
        result.sort((a, b) => {
          const aVal = Number.parseInt(a.ami?.[0] ?? "999", 10);
          const bVal = Number.parseInt(b.ami?.[0] ?? "999", 10);
          return aVal - bVal;
        });
      }

      if (filters.sort === "transit") {
        result.sort((a, b) => (a.transit_distance ?? Number.POSITIVE_INFINITY) - (b.transit_distance ?? Number.POSITIVE_INFINITY));
      }

      if (filters.sort === "verified") {
        result.sort((a, b) => Number(b.verified) - Number(a.verified));
      }

      if (filters.sort === "recent") {
        result.sort((a, b) => (a.updated_days ?? Number.POSITIVE_INFINITY) - (b.updated_days ?? Number.POSITIVE_INFINITY));
      }

      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    }

    void fetchProperties();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}

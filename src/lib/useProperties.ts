import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Property {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  types: string[] | null;
  ami: string[] | null;
  units: string[] | null;
  affordable?: number | null;
  verified: boolean;
  waitlist?: string | null;
  likely?: string | null;
  voucher: boolean;
  transit_station?: string | null;
  transit_distance: number | null;
  transit_label?: string | null;
  updated_days: number | null;
  insider?: string | null;
  image_url: string | null;
  phone?: string | null;
  website?: string | null;
}

export interface PropertyFilters {
  search?: string;
  types?: string[];
  cities?: string[];
  voucher?: boolean;
  verified?: boolean;
  transit?: boolean;
  sort?: "ami_asc" | "transit" | "verified" | "recent" | string;
  // Existing search-page filters preserved for compatibility.
  maxAmi?: number;
  bedrooms?: string[];
}

function parseAmiValue(ami: string[] | null | undefined): number {
  if (!ami?.length) return Number.POSITIVE_INFINITY;

  const values = ami
    .map((entry) => {
      const match = entry.match(/\d+/);
      return match ? Number.parseInt(match[0], 10) : Number.POSITIVE_INFINITY;
    })
    .filter(Number.isFinite);

  return values.length ? Math.min(...values) : Number.POSITIVE_INFINITY;
}

export function useProperties(filters: PropertyFilters) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      const { data: rows, error: fetchError } = await supabase.from("properties").select("*");

      if (cancelled) return;

      if (fetchError) {
        setData([]);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      let result = (rows ?? []) as Property[];

      if (filters.search?.trim()) {
        const query = filters.search.trim().toLowerCase();
        result = result.filter((p) =>
          [p.name, p.city, p.address].some((field) => field?.toLowerCase().includes(query)),
        );
      }

      if (filters.types?.length) {
        result = result.filter((p) => p.types?.some((type) => filters.types?.includes(type)));
      }

      if (filters.cities?.length) {
        result = result.filter((p) => (p.city ? filters.cities?.includes(p.city) : false));
      }

      if (filters.voucher) {
        result = result.filter((p) => p.voucher === true);
      }

      if (filters.verified) {
        result = result.filter((p) => p.verified === true);
      }

      if (filters.transit) {
        result = result.filter((p) => (p.transit_distance ?? Number.POSITIVE_INFINITY) <= 0.5);
      }

      if (filters.maxAmi !== undefined) {
        result = result.filter((p) => parseAmiValue(p.ami) <= filters.maxAmi!);
      }

      if (filters.bedrooms?.length) {
        result = result.filter((p) => p.units?.some((unit) => filters.bedrooms?.includes(unit)));
      }

      if (filters.sort === "ami_asc") {
        result = [...result].sort((a, b) => parseAmiValue(a.ami) - parseAmiValue(b.ami));
      } else if (filters.sort === "transit") {
        result = [...result].sort(
          (a, b) => (a.transit_distance ?? Number.POSITIVE_INFINITY) - (b.transit_distance ?? Number.POSITIVE_INFINITY),
        );
      } else if (filters.sort === "verified") {
        result = [...result].sort((a, b) => Number(b.verified) - Number(a.verified));
      } else if (filters.sort === "recent") {
        result = [...result].sort(
          (a, b) => (a.updated_days ?? Number.POSITIVE_INFINITY) - (b.updated_days ?? Number.POSITIVE_INFINITY),
        );
      }

      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return { data, loading, error };
}

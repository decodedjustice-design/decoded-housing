import { useEffect, useState } from "react";

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
  sort?: "ami_asc" | "transit" | "verified" | "recent" | string;
  maxAmi?: number;
  bedrooms?: string[];
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

      try {
        const response = await fetch("/data/properties_enriched.json");
        if (!response.ok) throw new Error(`Failed to load properties (${response.status})`);

        const payload = (await response.json()) as EnrichedPayload;
        const rows = payload.properties ?? [];

        let result: Property[] = rows.map((p) => ({
          id: p.id,
          name: p.name,
          city: p.city,
          address: null,
          types: p.housing_types ?? null,
          ami: null,
          units: null,
          affordable: null,
          verified: p.website ? true : false,
          waitlist: null,
          likely: null,
          voucher: false,
          transit_station: null,
          transit_distance: null,
          transit_label: null,
          updated_days: null,
          insider: null,
          image_url: p.photos?.[0] ?? null,
          phone: null,
          website: p.website ?? null,
        }));

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

        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setData([]);
          setError(err instanceof Error ? err.message : "Unable to load properties");
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return { data, loading, error };
}

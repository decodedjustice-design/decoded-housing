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

const CITY_PRIORITY = ["Redmond", "Bellevue", "Kirkland"];

export function sortByCityAndPriority(rows: Resource[], userCity: string): Resource[] {
  const cityRank = (c: string | null) => {
    if (!c) return 99;
    if (c.toLowerCase() === userCity.toLowerCase()) return 0;
    const idx = CITY_PRIORITY.findIndex((x) => x.toLowerCase() === c.toLowerCase());
    return idx === -1 ? 10 : idx + 1;
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
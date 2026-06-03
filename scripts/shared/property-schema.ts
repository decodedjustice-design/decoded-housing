import { z } from "zod";

/**
 * Canonical property shape used by Decoded Housing search, ingestion, and
 * availability-tracker UI. Keep this schema aligned with the Supabase
 * `public.properties` table plus optional enrichment fields from
 * `public/data/properties_enriched.json`.
 */
export const PropertySchema = z.object({
  id: z.union([z.string().uuid(), z.string().min(1), z.number().int().nonnegative()]),
  name: z.string().min(1),
  city: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  types: z.array(z.string()).default([]),
  ami: z.array(z.string()).default([]),
  units: z.array(z.string()).default([]),
  affordable: z.number().int().nullable().optional(),
  affordable_units: z.number().int().nullable().optional(),
  total_units: z.number().int().nullable().optional(),
  program_type: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  year: z.number().int().nullable().optional(),
  zip: z.string().nullable().optional(),
  verified: z.boolean().default(false),
  waitlist: z.union([z.boolean(), z.string()]).nullable().optional(),
  likely: z.union([z.boolean(), z.string()]).nullable().optional(),
  voucher: z.boolean().default(false),
  transit_station: z.string().nullable().optional(),
  transit_distance: z.number().nullable().optional(),
  transit_label: z.string().nullable().optional(),
  updated_days: z.number().int().nullable().optional(),
  insider: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  photos: z.array(z.string().url()).nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export type Property = z.infer<typeof PropertySchema>;

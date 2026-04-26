import { z } from "zod";

/**
 * Property shape currently used by the Decoded Housing search experience.
 * Keep this schema in sync with the app's Property contract.
 */
export const PropertySchema = z.object({
  id: z.union([z.number().int().nonnegative(), z.string().min(1)]),
  name: z.string().min(1),
  city: z.string().min(1),
  ami: z.string().min(1),
  beds: z.string().min(1),
  vouchers: z.boolean(),
});

export type Property = z.infer<typeof PropertySchema>;

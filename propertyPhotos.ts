/**
 * Property Photo Map
 * Real exterior photos sourced from official property websites, Redfin, Realtor.com,
 * and architectural photography. Keyed by property ID.
 * 
 * Properties without a specific photo fall back to the FALLBACK_PHOTOS pool —
 * a curated set of high-quality Eastside/Bellevue apartment exteriors.
 */

export const PROPERTY_PHOTOS: Record<string, string> = {
  "prop-002": "/manus-storage/prop-002_b5bd0b67.jpg",   // Adara at Totem Lake
  "prop-003": "/manus-storage/prop-003_d26a18af.jpg",   // Capella at Esterra Park
  "prop-004": "/manus-storage/prop-004_c803d21a.jpg",   // Horizon at Together Center
  "prop-005": "/manus-storage/prop-005_136a5116.jpg",   // Polaris at Together Center
  "prop-016": "/manus-storage/prop-016_e10dba2b.jpg",   // AVA Esterra Park
  "prop-017": "/manus-storage/prop-017_a5c3432f.jpg",   // Avalon Esterra Park
  "prop-019": "/manus-storage/prop-019_cdab2ae0.jpg",   // Bell Marymoor Park
  "prop-032": "/manus-storage/prop-032_f5229409.jpg",   // Cadence at Totem Lake
  "prop-079": "/manus-storage/prop-079_21b0d820.jpg",   // Magnolia at Moss Bay
  "prop-090": "/manus-storage/prop-090_f500028f.jpg",   // Nuovo
  "prop-092": "/manus-storage/prop-092_66b2ed9f.jpg",   // Ondina
  "prop-106": "/manus-storage/prop-106_7668ddeb.jpg",   // Radiate Apartments
  "prop-128": "/manus-storage/prop-128_04f51f5c.jpg",   // Soma Towers
  "prop-129": "/manus-storage/prop-129_4d9039d2.webp",  // Spectra
  "prop-134": "/manus-storage/prop-134_4a404d2b.jpg",   // Stokely (fka Cerasa)
  "prop-139": "/manus-storage/prop-139_77e333f7.jpg",   // The Bond
  "prop-140": "/manus-storage/prop-140_bc973bc4.webp",  // The Bower
  "prop-141": "/manus-storage/prop-141_48131821.jpg",   // The Brynn
  "prop-142": "/manus-storage/prop-142_ae5bcd94.jpg",   // The Carter on the Park
  "prop-147": "/manus-storage/prop-147_aa363200.jpg",   // The McKee
  "prop-155": "/manus-storage/prop-155_ce1e910c.jpg",   // Uptown at Kirkland Urban
  "prop-158": "/manus-storage/prop-158_5fa35e7e.webp",  // Vantage on Market
  "prop-160": "/manus-storage/prop-160_273e0941.jpg",   // Veloce
  "prop-166": "/manus-storage/prop-166_6c9b8184.jpg",   // Vue 22 [BelRed II]
  "prop-167": "/manus-storage/prop-167_27e14775.jpg",   // Vue Kirkland
  "prop-180": "/manus-storage/prop-180_68e4c8cb.jpg",   // Congregations for the Homeless (CFH)
  "prop-182": "/manus-storage/prop-182_007b60a5.jpg",   // Sophia Way – Eastside Women's Shelter
  "prop-183": "/manus-storage/prop-183_3fefbb2e.jpg",   // Eastgate Terrace
};

/**
 * Curated fallback pool of high-quality Eastside apartment exterior photos.
 * Used for properties without a specific photo match.
 * Sourced from Unsplash (free to use).
 */
export const FALLBACK_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",  // Modern apt complex
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",  // Urban apartments
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80", // Suburban complex
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", // Modern townhomes
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",  // Apartment building
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80", // Residential complex
  "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80", // Modern housing
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", // Apartment exterior
  "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80", // Residential building
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", // Modern home
];

/**
 * Get the photo URL for a property, falling back to a deterministic
 * selection from the fallback pool based on property ID.
 */
export function getPropertyPhoto(propId: string): string {
  if (PROPERTY_PHOTOS[propId]) {
    return PROPERTY_PHOTOS[propId];
  }
  // Deterministic fallback: hash the prop ID to pick from the pool
  const num = parseInt(propId.replace("prop-", ""), 10) || 0;
  return FALLBACK_PHOTOS[num % FALLBACK_PHOTOS.length];
}

/**
 * Get 3 photos for the property detail mosaic.
 * Returns [primary, secondary, tertiary].
 */
export function getPropertyMosaicPhotos(propId: string): [string, string, string] {
  const primary = getPropertyPhoto(propId);
  const num = parseInt(propId.replace("prop-", ""), 10) || 0;
  const secondary = FALLBACK_PHOTOS[(num + 3) % FALLBACK_PHOTOS.length];
  const tertiary = FALLBACK_PHOTOS[(num + 6) % FALLBACK_PHOTOS.length];
  return [primary, secondary, tertiary];
}

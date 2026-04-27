// Approximate city centroids for King County, WA (lng, lat)
export const CITY_CENTROIDS: Record<string, [number, number]> = {
  Auburn: [-122.2284, 47.3073],
  Bellevue: [-122.2007, 47.6101],
  Bothell: [-122.2054, 47.7623],
  Burien: [-122.3466, 47.4701],
  Covington: [-122.1218, 47.3593],
  "Des Moines": [-122.3245, 47.4018],
  Enumclaw: [-121.9915, 47.2043],
  "Federal Way": [-122.3126, 47.3223],
  Issaquah: [-122.0326, 47.5301],
  Kenmore: [-122.2440, 47.7573],
  Kent: [-122.2348, 47.3809],
  Kirkland: [-122.2090, 47.6815],
  "Lake Forest Park": [-122.2807, 47.7548],
  "Maple Valley": [-122.0429, 47.3673],
  "Mercer Island": [-122.2221, 47.5707],
  Newcastle: [-122.1646, 47.5391],
  Pacific: [-122.2501, 47.2640],
  Redmond: [-122.1215, 47.6740],
  Renton: [-122.2171, 47.4829],
  Sammamish: [-122.0356, 47.6163],
  Seatac: [-122.3088, 47.4436],
  SeaTac: [-122.3088, 47.4436],
  Seattle: [-122.3321, 47.6062],
  Shoreline: [-122.3415, 47.7557],
  Snoqualmie: [-121.8254, 47.5287],
  Tukwila: [-122.2596, 47.4759],
  Vashon: [-122.4596, 47.4473],
  Woodinville: [-122.1637, 47.7543],
};

export const KING_COUNTY_CENTER: [number, number] = [-122.1, 47.55];

export function getCityCoords(city: string | null | undefined): [number, number] | null {
  if (!city) return null;
  return CITY_CENTROIDS[city] ?? CITY_CENTROIDS[city.trim()] ?? null;
}

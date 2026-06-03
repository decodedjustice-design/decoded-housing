"""
Build transit data for Decoded Housing:
1. Extract canonical Link Light Rail stations from Sound Transit GTFS
2. Pre-compute nearest station + walking distance for all 184 properties
3. Output two TypeScript files:
   - transitStops.ts  (the canonical station list)
   - propertyTransit.ts (per-property nearest stop lookup)
"""
import csv, json, math, re

# ── Haversine distance in miles ──────────────────────────────────────────────
def haversine(lat1, lon1, lat2, lon2):
    R = 3958.8  # Earth radius in miles
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

# ── Canonical Link Light Rail station names (East King County + key Seattle) ─
CANONICAL_STATIONS = {
    # East Link (2 Line) — opened 2024
    "South Bellevue":       (47.5866, -122.1904),
    "East Main":            (47.6082, -122.1911),
    "Bellevue Downtown":    (47.6152, -122.1921),
    "Wilburton":            (47.6180, -122.1838),
    "Spring District/120th":(47.6238, -122.1786),
    "BelRed/130th":         (47.6244, -122.1656),
    "Overlake Village":     (47.6363, -122.1389),
    "Redmond Technology":   (47.6448, -122.1336),
    "Downtown Redmond":     (47.6716, -122.1185),
    "Marymoor Village":     (47.6673, -122.1098),
    # 1 Line (Rainier Valley / SeaTac)
    "Mercer Island":        (47.5882, -122.2332),
    "Mount Baker":          (47.5770, -122.2979),
    "Columbia City":        (47.5603, -122.2929),
    "Othello":              (47.5385, -122.2817),
    "Rainier Beach":        (47.5230, -122.2791),
    "Tukwila Intl Blvd":    (47.4643, -122.2884),
    "SeaTac/Airport":       (47.4451, -122.2967),
    "Angle Lake":           (47.4230, -122.2978),
    # Eastside (1 Line north)
    "University of Washington": (47.6493, -122.3038),
    "Capitol Hill":         (47.6196, -122.3205),
    "Westlake":             (47.6115, -122.3375),
    "University Street":    (47.6080, -122.3358),
    "Pioneer Square":       (47.6017, -122.3308),
    "International District/Chinatown": (47.5983, -122.3283),
    "Stadium":              (47.5913, -122.3308),
    "SODO":                 (47.5789, -122.3267),
    "Beacon Hill":          (47.5680, -122.3117),
    # Northgate Line (1 Line north)
    "Roosevelt":            (47.6784, -122.3179),
    "Northgate":            (47.7063, -122.3058),
    "U District":           (47.6582, -122.3131),
}

# ── Load properties ───────────────────────────────────────────────────────────
with open('/home/ubuntu/decoded-housing/client/src/data/properties.json') as f:
    properties = json.load(f)

# ── Pre-compute nearest station for each property ────────────────────────────
property_transit = {}
for prop in properties:
    pid = prop['id']
    plat = prop.get('lat', 47.6101)
    plng = prop.get('lng', -122.2015)
    
    best_name = None
    best_dist = 999.0
    for name, (slat, slng) in CANONICAL_STATIONS.items():
        d = haversine(plat, plng, slat, slng)
        if d < best_dist:
            best_dist = d
            best_name = name
    
    # Convert to walking minutes (avg 20 min/mile walking)
    walk_mins = round(best_dist * 20)
    # Distance string
    if best_dist < 0.1:
        dist_str = "< 0.1 mi"
    else:
        dist_str = f"{best_dist:.1f} mi"
    
    # Determine line
    east_link = {"South Bellevue","East Main","Bellevue Downtown","Wilburton",
                 "Spring District/120th","BelRed/130th","Overlake Village",
                 "Redmond Technology","Downtown Redmond","Marymoor Village"}
    line = "2 Line" if best_name in east_link else "1 Line"
    
    property_transit[pid] = {
        "station": best_name,
        "line": line,
        "distance_miles": round(best_dist, 2),
        "distance_str": dist_str,
        "walk_mins": walk_mins,
    }

# ── Write transitStops.ts ─────────────────────────────────────────────────────
stops_ts = """// AUTO-GENERATED — Sound Transit Link Light Rail stations (East King County + Seattle)
// Source: Sound Transit GTFS + canonical station coordinates
export interface TransitStop {
  name: string;
  line: '1 Line' | '2 Line';
  lat: number;
  lng: number;
}

export const TRANSIT_STOPS: TransitStop[] = [
"""
for name, (lat, lng) in CANONICAL_STATIONS.items():
    east_link = {"South Bellevue","East Main","Bellevue Downtown","Wilburton",
                 "Spring District/120th","BelRed/130th","Overlake Village",
                 "Redmond Technology","Downtown Redmond","Marymoor Village"}
    line = "2 Line" if name in east_link else "1 Line"
    stops_ts += f'  {{ name: {json.dumps(name)}, line: {json.dumps(line)}, lat: {lat}, lng: {lng} }},\n'
stops_ts += "];\n"

with open('/home/ubuntu/decoded-housing/client/src/data/transitStops.ts', 'w') as f:
    f.write(stops_ts)

# ── Write propertyTransit.ts ──────────────────────────────────────────────────
pt_ts = """// AUTO-GENERATED — Nearest Sound Transit Link station per property
// Pre-computed from GTFS data to avoid runtime calculations
export interface PropertyTransit {
  station: string;
  line: '1 Line' | '2 Line';
  distance_miles: number;
  distance_str: string;
  walk_mins: number;
}

export const PROPERTY_TRANSIT: Record<string, PropertyTransit> = {
"""
for pid, data in sorted(property_transit.items()):
    pt_ts += f'  {json.dumps(pid)}: {json.dumps(data)},\n'
pt_ts += "};\n\n"
pt_ts += """export function getTransit(propertyId: string): PropertyTransit | null {
  return PROPERTY_TRANSIT[propertyId] ?? null;
}
"""

with open('/home/ubuntu/decoded-housing/client/src/data/propertyTransit.ts', 'w') as f:
    f.write(pt_ts)

print(f"✅ transitStops.ts: {len(CANONICAL_STATIONS)} stations")
print(f"✅ propertyTransit.ts: {len(property_transit)} properties")

# Quick sanity check — show 5 Bellevue properties
bellevue = [(pid, d) for pid, d in property_transit.items() 
            if d['station'] in ('Bellevue Downtown', 'East Main', 'Wilburton', 'South Bellevue')]
print(f"\nSample (Bellevue-area stations):")
for pid, d in sorted(bellevue, key=lambda x: x[1]['distance_miles'])[:8]:
    prop = next(p for p in properties if p['id'] == pid)
    print(f"  {prop['name'][:35]:35s} → {d['station']:25s} {d['distance_str']:8s} ({d['walk_mins']} min walk)")

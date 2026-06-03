"""
Enrich properties.json with data from PRR_AllUnits_Properties_20260317.xlsx.

New fields added to each property:
  - prr_jurisdiction: official jurisdiction from spreadsheet
  - prr_status: "In Service" | "In Development"
  - prr_total_units: total units across all affordability tiers
  - prr_market_units: unrestricted/market-rate units
  - prr_affordable_units: total affordable units
  - prr_ami_breakdown: { "30 AMI": 24, "60 AMI": 191, ... }
  - prr_ami_tiers: sorted list of AMI tier strings (e.g. ["30 AMI","60 AMI"])
  - prr_has_lost_affordability: bool
  - prr_short_term_units: units with short-term affordability
  - prr_matched: bool (whether a match was found in the spreadsheet)
"""

import json
import openpyxl
from collections import defaultdict
import re
import os

# ── 1. Load spreadsheet ──────────────────────────────────────────────────────
wb = openpyxl.load_workbook(
    '/home/ubuntu/upload/PRR_AllUnits_Properties_20260317.xlsx',
    read_only=True, data_only=True
)
ws = wb['PRR_AllUnits_Properties_2026031']

# Build a lookup: normalised_name → { jurisdiction, status, ami_breakdown, total_units, ... }
def normalise(name):
    """Lowercase, strip brackets/parens content, collapse whitespace."""
    if not name:
        return ''
    n = name.lower()
    n = re.sub(r'\[.*?\]', '', n)   # remove [alias]
    n = re.sub(r'\(.*?\)', '', n)   # remove (aka ...)
    n = re.sub(r'\s+', ' ', n).strip()
    return n

prr_data = defaultdict(lambda: {
    'jurisdiction': None,
    'status': None,
    'ami_breakdown': defaultdict(int),
    'market_units': 0,
    'short_term_units': 0,
    'lost_affordability_units': 0,
})

for row in ws.iter_rows(min_row=2, values_only=True):
    jurisdiction, prop_name, status, affordability, current_affordability, unit_count = row
    if not prop_name:
        continue
    key = normalise(prop_name)
    entry = prr_data[key]
    entry['jurisdiction'] = jurisdiction
    entry['status'] = status
    entry['original_name'] = prop_name

    units = int(unit_count) if unit_count else 0
    if affordability == 'Affordable':
        if current_affordability == 'Lost affordability':
            entry['lost_affordability_units'] += units
        elif current_affordability == 'Short-term':
            entry['short_term_units'] += units
        else:
            entry['ami_breakdown'][current_affordability] += units
    else:  # Unrestricted / Market
        entry['market_units'] += units

# ── 2. Load existing properties.json ────────────────────────────────────────
props_path = '/home/ubuntu/decoded-housing/client/src/data/properties.json'
with open(props_path) as f:
    properties = json.load(f)

# ── 3. Match and enrich ──────────────────────────────────────────────────────
matched = 0
unmatched = []

for prop in properties:
    key = normalise(prop.get('name', ''))
    
    # Try exact normalised match first
    entry = prr_data.get(key)
    
    # If no exact match, try partial match (first significant word)
    if not entry:
        for prr_key, prr_entry in prr_data.items():
            # Check if the first 3+ words of the property name appear in the PRR key
            words = key.split()[:3]
            if len(words) >= 2 and all(w in prr_key for w in words):
                entry = prr_entry
                break
    
    if entry:
        matched += 1
        ami_breakdown = dict(entry['ami_breakdown'])
        ami_tiers = sorted(
            [t for t in ami_breakdown.keys() if t not in ('Market', 'Lost affordability', 'Short-term')],
            key=lambda x: int(x.replace(' AMI', ''))
        )
        total_affordable = sum(ami_breakdown.values())
        
        prop['prr_jurisdiction'] = entry['jurisdiction']
        prop['prr_status'] = entry['status']
        prop['prr_total_units'] = total_affordable + entry['market_units'] + entry['short_term_units'] + entry['lost_affordability_units']
        prop['prr_market_units'] = entry['market_units']
        prop['prr_affordable_units'] = total_affordable
        prop['prr_ami_breakdown'] = ami_breakdown
        prop['prr_ami_tiers'] = ami_tiers
        prop['prr_has_lost_affordability'] = entry['lost_affordability_units'] > 0
        prop['prr_short_term_units'] = entry['short_term_units']
        prop['prr_matched'] = True
    else:
        unmatched.append(prop.get('name', ''))
        prop['prr_matched'] = False

# ── 4. Save enriched properties.json ────────────────────────────────────────
with open(props_path, 'w') as f:
    json.dump(properties, f, indent=2)

print(f"Total properties: {len(properties)}")
print(f"Matched: {matched}")
print(f"Unmatched ({len(unmatched)}): {unmatched[:20]}")
print(f"\nSample enriched property:")
for p in properties:
    if p.get('prr_matched'):
        print(json.dumps({k: v for k, v in p.items() if k.startswith('prr_') or k == 'name'}, indent=2))
        break

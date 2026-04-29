import fs from 'node:fs/promises';

const INPUT_PATH = new URL('../public/data/properties_enriched.json', import.meta.url);
const USER_AGENT = 'decoded-housing/1.0 (housing data enrichment)';

async function geocodeProperty(property) {
  const query = `${property.name} ${property.city} WA`;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', query);

  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'en',
    },
  });

  if (!response.ok) {
    return null;
  }

  const results = await response.json();
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const [first] = results;
  const lat = Number(first.lat);
  const lng = Number(first.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

async function run() {
  const raw = await fs.readFile(INPUT_PATH, 'utf8');
  const data = JSON.parse(raw);

  let updated = 0;
  let keptNull = 0;

  for (const property of data.properties) {
    if (property.location !== null) {
      continue;
    }

    const location = await geocodeProperty(property);
    property.location = location;

    if (location) {
      updated += 1;
    } else {
      keptNull += 1;
    }
  }

  await fs.writeFile(INPUT_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  console.log(`Updated locations: ${updated}`);
  console.log(`Still null: ${keptNull}`);
}

run().catch((error) => {
  console.error('Failed to enrich property locations:', error);
  process.exitCode = 1;
});

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const INPUT_PATH = path.resolve(process.cwd(), 'public/data/properties_enriched.json');
const MAX_CONCURRENCY = 3;
const MAX_IMAGES = 5;
const MAX_SAVED_IMAGES = 3;
const REQUEST_DELAY_MS = 800;

const PREFERRED_DOMAINS = [
  'apartments.com',
  'zillow.com',
  'apartmentfinder.com',
  'rent.com',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeUrl = (url) => {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
};

const isImageCandidate = (url) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (!/^https?:\/\//.test(lower)) return false;
  if (!/\.(jpg|jpeg|png|webp)(\?|$)/.test(lower)) return false;

  const blockedTokens = [
    'logo',
    'icon',
    'sprite',
    'favicon',
    'avatar',
    'badge',
    'thumb',
    'placeholder',
  ];

  return !blockedTokens.some((token) => lower.includes(token));
};

const scoreSearchResult = (property, result) => {
  const haystack = `${result.title} ${result.snippet} ${result.url}`.toLowerCase();
  let score = 0;

  if (haystack.includes(property.name.toLowerCase())) score += 6;
  if (property.city && haystack.includes(property.city.toLowerCase())) score += 3;

  const urlHost = (() => {
    try {
      return new URL(result.url).hostname.toLowerCase();
    } catch {
      return '';
    }
  })();

  if (!urlHost) score -= 100;
  if (urlHost.includes('facebook.com') || urlHost.includes('instagram.com')) score -= 4;

  if (!PREFERRED_DOMAINS.some((domain) => urlHost.includes(domain))) {
    score += 2;
  } else {
    score += 1;
  }

  return score;
};

const pickBestSearchResult = async (page, property) => {
  const query = `${property.name} ${property.city ?? ''} WA apartments`.replace(/\s+/g, ' ').trim();
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });

  const results = await page.$$eval('.result', (nodes) =>
    nodes
      .map((node) => {
        const linkEl = node.querySelector('.result__title a.result__a');
        const snippetEl = node.querySelector('.result__snippet');

        return {
          title: linkEl?.textContent?.trim() ?? '',
          url: linkEl?.getAttribute('href') ?? '',
          snippet: snippetEl?.textContent?.trim() ?? '',
        };
      })
      .filter((item) => item.url),
  );

  if (!results.length) return null;

  const ranked = results
    .map((result) => ({ result, score: scoreSearchResult(property, result) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.result ?? null;
};

const maybeNavigateToGallery = async (page, baseUrl) => {
  const galleryHints = ['/gallery', '/photos', '/photo-gallery', '/images'];
  const normalizedBase = normalizeUrl(baseUrl);
  if (!normalizedBase) return;

  for (const hint of galleryHints) {
    try {
      const u = new URL(normalizedBase);
      u.pathname = hint;
      await page.goto(u.toString(), { waitUntil: 'domcontentloaded', timeout: 20000 });
      const hasImage = await page.locator('img').count();
      if (hasImage > 0) return;
    } catch {
      // continue
    }
  }

  const galleryLink = page.locator('a[href*="gallery"], a[href*="photo"], a[href*="image"]');
  const count = await galleryLink.count();
  if (count > 0) {
    try {
      await galleryLink.first().click({ timeout: 10000 });
      await page.waitForLoadState('domcontentloaded', { timeout: 15000 });
    } catch {
      // continue with current page
    }
  }
};

const extractImageUrls = async (page) => {
  const urls = await page.evaluate(() => {
    const candidates = new Set();

    document.querySelectorAll('img').forEach((img) => {
      const src = img.currentSrc || img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
      if (src) candidates.add(src);
    });

    document.querySelectorAll('[style*="background-image"]').forEach((el) => {
      const style = el.getAttribute('style') || '';
      const match = style.match(/url\(["']?([^"')]+)["']?\)/i);
      if (match?.[1]) candidates.add(match[1]);
    });

    return Array.from(candidates);
  });

  return urls
    .map((url) => normalizeUrl(url))
    .filter((url) => isImageCandidate(url))
    .slice(0, MAX_IMAGES);
};

const processProperty = async (browser, property, index, total) => {
  const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await context.newPage();

  const existingPhotos = Array.isArray(property.photos) ? property.photos : [];

  try {
    console.log(`[${index + 1}/${total}] Searching images for ${property.name} (${property.city ?? 'Unknown city'})`);

    const bestResult = await pickBestSearchResult(page, property);
    if (!bestResult?.url) {
      return { property: { ...property, photos: existingPhotos, photos_verified: false }, verified: false, fallback: true };
    }

    await sleep(REQUEST_DELAY_MS);
    await page.goto(bestResult.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await maybeNavigateToGallery(page, bestResult.url);
    await sleep(REQUEST_DELAY_MS);

    const images = await extractImageUrls(page);
    const selected = images.slice(0, MAX_SAVED_IMAGES);
    const verified = selected.length >= 2;

    if (!selected.length) {
      return { property: { ...property, photos: existingPhotos, photos_verified: false }, verified: false, fallback: true };
    }

    return {
      property: {
        ...property,
        photos: selected,
        photos_verified: verified,
      },
      verified,
      fallback: false,
    };
  } catch (error) {
    console.error(`[${index + 1}/${total}] Failed ${property.name}:`, error.message);
    return { property: { ...property, photos: existingPhotos, photos_verified: false }, verified: false, fallback: true };
  } finally {
    await context.close();
  }
};

const runWithConcurrency = async (items, concurrency, handler) => {
  const results = new Array(items.length);
  let cursor = 0;

  const worker = async () => {
    while (cursor < items.length) {
      const current = cursor;
      cursor += 1;
      results[current] = await handler(items[current], current, items.length);
      await sleep(300);
    }
  };

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
};

const main = async () => {
  const raw = await fs.readFile(INPUT_PATH, 'utf-8');
  const properties = JSON.parse(raw);

  if (!Array.isArray(properties)) {
    throw new Error('Expected properties_enriched.json to be an array of properties.');
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const results = await runWithConcurrency(properties, MAX_CONCURRENCY, (property, index, total) =>
      processProperty(browser, property, index, total),
    );

    const updated = results.map((item) => item.property);
    const verifiedCount = results.filter((item) => item.verified).length;
    const fallbackCount = results.filter((item) => item.fallback).length;

    await fs.writeFile(INPUT_PATH, `${JSON.stringify(updated, null, 2)}\n`, 'utf-8');

    console.log('--- Image enrichment summary ---');
    console.log(`Total processed: ${properties.length}`);
    console.log(`Verified count: ${verifiedCount}`);
    console.log(`Fallback count: ${fallbackCount}`);
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error('Property image enrichment failed:', error);
  process.exitCode = 1;
});

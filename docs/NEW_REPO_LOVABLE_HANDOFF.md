# New Repository + Lovable Handoff Plan

## Decision

The previous in-place replacement has been reverted. The next website should start as a new repository and a new Lovable project instead of continuing to overwrite the current Decoded Housing codebase.

This repository should remain the source archive for useful housing-stability assets:

- Stable Housing Navigator workflow content.
- Affordable housing/property data assets.
- ARCH, MFTE, LIHTC, voucher, shelter, and basic-needs guidance.
- Existing Supabase migrations and property ingestion scripts.
- Tenant-rights education, documents/checklist tools, family shelter support, and phone scripts.

## New-site foundation requirements

The new Lovable site should be built around these product pillars:

1. **Property search first** — searchable affordable-housing and shelter options with program, city, household, voucher, waitlist, and document-readiness filters.
2. **No-abandonment flow** — every result and workflow must provide a next step and a backup path.
3. **Stable Housing Navigator** — urgent risk triage, eligibility guidance, barrier triage, document checklist, call scripts, and follow-through tasks should stay connected.
4. **Mobile-first UX** — core flows must work on a phone without requiring a map, large screen, or account.
5. **Real data only** — no fake contacts, mock listings, stock-listing images, or placeholder resources.
6. **Accessibility by default** — semantic headings, labeled form controls, visible focus states, keyboard navigation, and clear error states.

## Recommended new repo structure

```text
new-decoded-housing-site/
├── src/
│   ├── components/
│   ├── routes/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   └── styles.css
├── public/
│   └── data/
├── scripts/
├── supabase/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Files to export into the new repo

Use `scripts/export-lovable-new-site.mjs` to copy the useful project foundation into a clean target directory. The export intentionally excludes Git history, build outputs, dependency folders, and prior migration artifacts.

Recommended command from this repo root:

```bash
node scripts/export-lovable-new-site.mjs ../decoded-housing-lovable-new-site --force
```

Then initialize the new repository from the export directory:

```bash
cd ../decoded-housing-lovable-new-site
git init
git add .
git commit -m "Start Decoded Housing Lovable site"
```

## Lovable import instructions

1. Create a new Lovable project.
2. Connect the new Git repository, not this historical working repository.
3. Keep the first Lovable prompt focused on the new app foundation:
   - Build a housing-stability platform for King County residents.
   - Use real property data from `public/data` and Supabase when configured.
   - Preserve the Stable Housing Navigator, property search, eligibility guidance, barrier triage, documents/checklists, shelter routing, family support, and phone scripts.
   - Do not invent listings, phone numbers, websites, contacts, eligibility rules, or availability statuses.
4. Ask Lovable to create one cohesive navigation system and remove duplicate or orphaned routes in the new project only after the first build passes.

## Required environment variables

The new project should support these variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL` for server-side contexts that use non-Vite naming
- `SUPABASE_PUBLISHABLE_KEY` for server-side contexts that use non-Vite naming
- `VITE_MAPBOX_TOKEN` if the new site keeps the interactive map

## Data preservation rules

- Keep `public/data/raw/*` and `public/data/properties_enriched.json` during the new-site startup.
- Keep `supabase/migrations/*` until the new data model is finalized.
- Keep property ingestion scripts until the new repository has a verified replacement pipeline.
- Do not delete property data just because the first Lovable screen does not display it.

## First milestone for the new site

The new site is ready for design iteration when it can:

- Build successfully.
- Render the homepage.
- Render property search from static data without Supabase env vars.
- Render property search from Supabase when env vars are present.
- Provide non-map fallback results.
- Link to navigator, documents, eligibility, shelter, family support, tenant-rights, and phone-script flows without dead ends.

# Decoded Housing Website Migration Report — 2026-06-03

## Audit scope

- Reviewed the current Decoded Housing / Stable Housing Navigator frontend, route structure, property-data hooks, Supabase integration, static enriched property file, ingestion schema, and navigation.
- Reviewed the external Manus properties experience at `housingtrack-2t7ggdqa.manus.space/properties` through the accessible page metadata available to this environment. The observable page direction is an affordable-housing availability tracker centered on property discovery.
- Attempted to access the uploaded design branch from the local Git checkout. The branch was not present in local refs and no remote is configured in this container, so the migration used the available uploaded-style route assets already present in this checkout together with the Manus properties direction.

## 1. What the uploaded/new site direction does better

- Stronger professional landing-page hierarchy with a clear hero, trust bar, high-priority entry cards, and a guided workflow instead of a minimal tile directory.
- Better user journey framing: property search, urgent shelter, and stability planning are presented as coordinated paths rather than isolated pages.
- Better visual design language: editorial typography, warm housing-stability palette, rounded cards, layered shadows, and mobile-friendly sections.
- More production-ready SEO metadata for the homepage and property tracker.
- Stronger no-abandonment messaging that keeps users connected to next steps, backup plans, documents, and scripts.

## 2. What the current site does better

- It already preserves critical housing-stability workflows: Stable Housing Navigator, housing and shelter discovery, basic-needs routing, tenant-rights education, call scripts, saved pages, urgent shelter flows, document guidance, and eligibility/application help.
- It contains real property assets and data pathways: Supabase properties table, static enriched property fallback, raw ARCH/MFTE and affordable-housing source files, and ingestion scripts.
- It has an existing route tree and a mature set of route-specific support pages that should not be discarded.

## 3. What must be preserved

- Stable Housing Navigator workflow and no-abandonment model.
- ARCH, MFTE, LIHTC, voucher-friendly, public-housing, and affordable-housing property data.
- Property search and map/list fallback behavior.
- Eligibility guidance and application-support pages.
- Barrier triage concepts, documents/checklist tools, phone scripts, and tenant-rights prompts.
- Family, youth/young-adult, single-adult, urgent shelter, and crisis-routing pages.
- Supabase property table and static JSON fallback so property search is not dependent on one runtime service.

## 4. What should be removed

- The old minimalist homepage as the primary front door.
- Duplicate search destinations that fragment the housing search journey.
- Mock property contact data and stock-property images that could mislead users.
- Private build-tool dependency usage that blocks installation in standard environments.

## 5. What should be rebuilt

- Homepage as a polished Decoded Housing front door with search, urgent routing, stability planning, and support tools.
- Property search as a dedicated availability-tracker workspace inspired by the Manus properties page.
- Search redirects so old `/search` and `/search-v2` paths land on the new property tracker without orphaning existing links.
- Property-data schema so ingestion and UI share one richer structure.

## 6. Manus properties page features to copy or recreate

- Dedicated `/properties` route focused on affordable-housing availability tracking.
- Search-first layout with filters, result counts, verification/status signals, and application-oriented next steps.
- Property cards that show program badges, bedroom/unit information, waitlist signals, transit context, and contact/application actions.
- A list-first experience that remains useful when a map integration is unavailable.

## 7. Missing files, broken imports, dead routes, and dependency issues

- The named uploaded design branch was not available in local Git refs and no remote is configured, so direct branch comparison could not be performed in this container.
- `node_modules` was missing at audit time.
- `npm install` and `bun install` were blocked by registry 403 responses in this environment.
- The app depended on a private Vite configuration package that blocked standard installs. This was replaced with public Vite, React, Tailwind, TanStack Router, and tsconfig-path plugins.
- `/search` and `/search-v2` existed only as redirects; they now redirect to the rebuilt property tracker.

## 8. Database and property-data structure changes needed

No destructive database change is required for this migration. Recommended future additions to the `properties` table:

- `phone text` for verified leasing/intake phone numbers.
- `website text` for verified application or property pages.
- `photos text[]` for verified property images only.
- `latitude double precision` and `longitude double precision` for property-level maps instead of city-level fallback markers.
- `availability_status text` and `availability_verified_at timestamptz` to distinguish open units, waitlists, call-to-confirm, and stale records.
- `application_methods text[]` for online, phone, email, in-person, mail, or referral-only workflows.
- `eligibility_notes text` for ARCH/MFTE/AMI/voucher-specific guidance.

## Required environment variables and API keys

- `VITE_SUPABASE_URL` or `SUPABASE_URL`.
- `VITE_SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_PUBLISHABLE_KEY`.
- `VITE_MAPBOX_TOKEN` for the interactive map. Without it, the list remains fully available.

## Migration execution summary

- Rebuilt the homepage around the new design direction and Decoded Housing no-abandonment journey.
- Added a production-oriented `/properties` availability tracker using existing property data.
- Preserved support routes and existing housing-stability workflows.
- Removed misleading mock property email addresses and fallback stock photos.
- Hardened property loading so missing Supabase env vars fall back to the static property file instead of breaking the UI.
- Replaced private Vite config dependency with public build tooling.

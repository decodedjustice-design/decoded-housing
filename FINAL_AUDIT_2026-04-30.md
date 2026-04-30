# Final Audit — Decoded Housing (2026-04-30)

This report documents remaining major issues found in the codebase.

## Critical remaining issues

1. Route manifest is stale/incomplete: many route files exist but are not in `src/routeTree.gen.ts`, making those pages unreachable at runtime.
2. `/our-story` and `/saved-shelters` redirect to `/about` and `/saved`, but those targets are also missing from `routeTree.gen.ts`.
3. `/search`, `/search-v2`, and `/shelter` all redirect to `/housing-shelter`; legacy split exists in route files but is mostly alias redirects.
4. Property details are still synthetic for key fields (address, pricing, units, phone, eligibility barriers): data is mostly null and filled with fallback UI text.
5. Map depends on client-provided token stored in localStorage if env token is missing; this blocks map for first-time users and indicates no configured public token in runtime.
6. Visual direction still has startup/tech language in key hero copy (e.g., "Discovery Engine").
7. Some pages are still placeholder-level content and explicitly marked as scaffolding.
8. Build/lint verification could not run due restricted package fetch (private dependency 403).

## Data/backend gaps

- Real eligibility/barrier logic is not implemented (filters only; no policy engine).
- Contact data enrichment is incomplete (email fabricated in UI when missing).
- Pricing, unit size, waitlist status are mostly fallback/generated from sparse JSON.

# Phase 1 Implementation Plan (4–6 Weeks)

## Scope and constraints

This Phase 1 plan is intentionally tight and limited to the current Decoded Housing front-end architecture:

- TanStack Router file-based routes under `src/routes`
- Shared shell/layout via `src/routes/__root.tsx`
- Shared navigation and quick actions via `src/components/Navbar.tsx` and `src/components/QuickAssistSidebar.tsx`
- Route-local data/UI for first release (no backend/API expansion in this phase)

Included workstreams:

1. Homepage rebuild
2. Search portal upgrade
3. Eligibility Checker
4. Rental Assistance page
5. Tenant Rights page
6. Help Center
7. Shelter rebrand and polish

Out of scope for Phase 1:

- New backend services
- Account/auth system
- Intake/case management workflows
- Deep CMS integration

---

## Delivery timeline (4–6 weeks)

## Week 1 — Foundation and IA lock

### Step-by-step tasks

1. Confirm updated sitemap and route ownership for all Phase 1 pages.
2. Define reusable UI patterns for page headers, cards, checklist blocks, and action CTAs.
3. Align global navigation labels/order to match the Phase 1 information architecture.
4. Finalize page-level content outlines and acceptance criteria (per route).
5. Add route stubs and navigation wiring for new pages to avoid late integration risk.

### File-level changes

- `src/components/Navbar.tsx`
  - Update top-nav structure and labels to include Help Center and clearer shelter entrypoint.
- `src/routes/__root.tsx`
  - Keep shell stable; verify global placement/behavior of shared sidebar while new pages roll out.
- `src/routes/index.tsx`
  - Replace current home module layout with final content hierarchy and CTA flow.
- `src/routes/help-center.tsx` (new)
  - Add new route shell/stub and metadata.
- `src/routes/rental-assistance.tsx` (new)
  - Add new route shell/stub and metadata.
- `src/routeTree.gen.ts`
  - Regenerate after route additions.

### Component-level work

- Refactor homepage sections into composable blocks:
  - `HomeHero`
  - `ActionPathGrid`
  - `UrgentHelpBand`
- Create reusable informational components for downstream pages:
  - `PageIntro`
  - `InfoCard`
  - `StepList`

---

## Week 2 — Homepage rebuild + Shelter polish

### Step-by-step tasks

1. Implement complete homepage rebuild with clearer “start here” pathways.
2. Reframe shelter experience around urgency and immediate next actions.
3. Improve cross-linking between home, shelter, and rental assistance flows.
4. Validate mobile readability and first-click clarity on top tasks.

### File-level changes

- `src/routes/index.tsx`
  - Ship final homepage composition, tighter content, and stronger primary CTAs.
- `src/routes/shelter.tsx`
  - Replace placeholder route with rebranded shelter page layout, quick action checklist, and hotline/resource block.
- `src/components/QuickAssistSidebar.tsx`
  - Align quick assist labels and targets with new homepage/shelter wording.
- `src/styles.css`
  - Minor token/util updates for urgency states, card spacing, and responsive polish.

### Component-level work

- Shelter-specific modules:
  - `ShelterHero`
  - `ImmediateActionsChecklist`
  - `TonightResourcesPanel`
- Homepage enhancement modules:
  - `NeedStateCards`
  - `GuidedNextStepBanner`

---

## Week 3 — Search portal upgrade + Eligibility Checker

### Step-by-step tasks

1. Upgrade search layout for clearer filter/result/map organization.
2. Improve listing cards with decision-critical facts (AMI, voucher acceptance, unit size).
3. Add first release of Eligibility Checker with simple guided questions.
4. Connect Eligibility Checker outputs to relevant search filters and next-step links.
5. Add empty/loading/no-match UX states with clear recovery actions.

### File-level changes

- `src/routes/search.tsx`
  - Replace static filter placeholders with structured filter controls and improved results scaffolding.
- `src/routes/eligibility.tsx` (new)
  - Add guided eligibility flow route.
- `src/components/Navbar.tsx`
  - Add Eligibility Checker as a top-level or secondary nav target (based on IA decision in Week 1).
- `src/routeTree.gen.ts`
  - Regenerate for new route wiring.

### Component-level work

- Search components:
  - `SearchFilterBar`
  - `ListingGrid`
  - `ListingCard`
  - `MapPlaceholderPanel` (Phase 1 static/fallback)
- Eligibility components:
  - `EligibilityQuestionFlow`
  - `EligibilitySummaryCard`
  - `EligibilityNextSteps`

---

## Week 4 — Rental Assistance + Tenant Rights

### Step-by-step tasks

1. Launch dedicated Rental Assistance page separated from generic basic-needs content.
2. Build tenant-rights education page with plain-language categories and “what to do now” actions.
3. Add internal link pathways between tenant rights, shelter, and rental assistance pages.
4. Ensure all content uses scannable structure for stressed users (bullets, short sections, clear labels).

### File-level changes

- `src/routes/rental-assistance.tsx`
  - Implement assistance overview, eligibility cues, and action steps.
- `src/routes/tenant-rights.tsx`
  - Replace placeholder page with practical rights education structure.
- `src/routes/basic-needs.tsx`
  - Reframe page as hub and route users to dedicated rental assistance content.
- `src/components/QuickAssistSidebar.tsx`
  - Point Rent quick action to dedicated Rental Assistance page.

### Component-level work

- Rental assistance modules:
  - `AssistanceProgramCards`
  - `RequiredDocumentsChecklist`
  - `ApplyNowPanel`
- Tenant rights modules:
  - `RightsTopicAccordion`
  - `WhatToDoNowSteps`
  - `GetHelpContacts`

---

## Week 5 — Help Center + Integration + QA hardening

### Step-by-step tasks

1. Implement Help Center with task-based FAQs and route-aware “where should I go next?” guidance.
2. Add cross-page consistency pass for headings, CTA labels, card semantics, and voice.
3. Run accessibility sweep (focus order, landmarks, color contrast, keyboard behavior).
4. Perform responsive QA for key breakpoints and core user tasks.
5. Finalize launch checklist and defect triage.

### File-level changes

- `src/routes/help-center.tsx`
  - Implement searchable/helpful FAQ sections and routing shortcuts.
- `src/components/Navbar.tsx`
  - Ensure final nav ordering and labels are stable for launch.
- `src/routes/__root.tsx`
  - Validate shell-level UX (sidebar overlap, route transitions, focus behavior).
- `src/styles.css`
  - Final spacing/typography adjustments for consistency and accessibility.

### Component-level work

- Help center modules:
  - `HelpTopicList`
  - `FAQSection`
  - `NextStepRouter`
- Shared QA/reuse modules:
  - `InlineCallout`
  - `ActionButtonGroup`

---

## Week 6 (buffer, optional) — Stabilization and launch prep

Use only if needed to stay realistic and low-risk.

### Step-by-step tasks

1. Resolve high-priority QA/accessibility defects.
2. Tighten copy and reduce cognitive load where users hesitate.
3. Run final smoke tests across all Phase 1 routes.
4. Freeze scope and prep post-Phase-1 backlog.

### File-level changes

- Bug-fix only across touched routes/components from Weeks 1–5.

### Component-level work

- Bug-fix and refinement only (no new feature surfaces).

---

## Component/workstream checklist by feature

## 1) Homepage rebuild

- Route: `src/routes/index.tsx`
- Key components:
  - `HomeHero`
  - `NeedStateCards`
  - `ActionPathGrid`
  - `GuidedNextStepBanner`

## 2) Search portal upgrade

- Route: `src/routes/search.tsx`
- Key components:
  - `SearchFilterBar`
  - `ListingGrid`
  - `ListingCard`
  - `MapPlaceholderPanel`

## 3) Eligibility Checker

- Route: `src/routes/eligibility.tsx` (new)
- Key components:
  - `EligibilityQuestionFlow`
  - `EligibilitySummaryCard`
  - `EligibilityNextSteps`

## 4) Rental Assistance page

- Route: `src/routes/rental-assistance.tsx` (new)
- Key components:
  - `AssistanceProgramCards`
  - `RequiredDocumentsChecklist`
  - `ApplyNowPanel`

## 5) Tenant Rights page

- Route: `src/routes/tenant-rights.tsx`
- Key components:
  - `RightsTopicAccordion`
  - `WhatToDoNowSteps`
  - `GetHelpContacts`

## 6) Help Center

- Route: `src/routes/help-center.tsx` (new)
- Key components:
  - `HelpTopicList`
  - `FAQSection`
  - `NextStepRouter`

## 7) Shelter rebrand and polish

- Route: `src/routes/shelter.tsx`
- Key components:
  - `ShelterHero`
  - `ImmediateActionsChecklist`
  - `TonightResourcesPanel`

---

## Practical acceptance criteria for Phase 1 completion

1. All seven workstreams have live, navigable routes with complete non-placeholder content.
2. Navbar and cross-links create a clear path for urgent, planned, and informational user needs.
3. Search + eligibility + rental assistance paths are coherent and connected.
4. Tenant rights and help center pages provide actionable next steps (not just static reference text).
5. Core mobile flows are usable end-to-end without layout breaks.
6. Accessibility pass completed for headings, keyboard access, and contrast on all new/updated routes.

---

## Risk controls to keep 4–6 week scope realistic

- Prioritize route completion over advanced interactivity.
- Keep map experience as explicit placeholder in Phase 1.
- Keep eligibility logic rule-based and transparent (no heavy personalization engine).
- Reuse shared components aggressively; avoid bespoke one-off UI unless essential.
- Use Week 6 only as defect buffer, not as feature expansion.

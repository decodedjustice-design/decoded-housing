# Housing Data Import Validation

This document describes the safety checks that should run before any future housing CSV is loaded into a staging table for human review.

## Preflight checker

Run the preflight checker against a candidate CSV before any staging load:

```bash
npm run validate:housing-import -- path/to/future-housing-import.csv
```

You can also run the script directly:

```bash
node scripts/validate-housing-import-template.mjs path/to/future-housing-import.csv
```

The checker compares the candidate CSV headers with `data/templates/housing-import-template.csv`. The repository includes only the header-only template and a tiny fake invalid fixture for testing. Do not commit real workbook rows, real property names, real addresses, or real source URLs.

## What the checker validates

The preflight checker fails when:

- Required template headers are missing.
- Unknown extra headers are present.
- Required row fields are blank.
- Neither `source_url` nor `source_label` is present.
- `verification_status` is anything other than `pending_review` or `unverified`.
- Any row starts as `verified`.
- `program_type` is not one of the approved values.
- `waitlist_status` is not one of the approved values.
- `availability_status` is not one of the approved values.
- `external_property_id` appears to have been converted from source text into a spreadsheet number, decimal, scientific notation, or formula-like value.
- `notes_public` contains obvious private or sensitive markers such as `client`, `intake`, `DV`, `safety address`, `private`, or `staff only`.

## Approved values

### `verification_status`

- `pending_review`
- `unverified`

No row may start as `verified`.

### `program_type`

- `affordable_housing`
- `housing_choice_voucher`
- `lihtc`
- `mfte`
- `mixed_income`
- `other`
- `permanent_supportive_housing`
- `project_based_voucher`
- `public_housing`
- `senior`
- `unknown`

### `waitlist_status`

- `call_to_confirm`
- `closed`
- `open`
- `unknown`

### `availability_status`

- `available`
- `call_to_confirm`
- `no_known_availability`
- `unknown`
- `waitlist_only`

## Interpreting a pass

Passing preflight does **not** mean records are verified, complete, current, or public-ready.

Passing preflight only means the CSV shape and obvious safety checks are acceptable for a controlled staging load where humans can review every row before anything is treated as verified or exposed in public listing UI.

## Fixture check

A tiny fake invalid fixture is available at `data/fixtures/housing-import-invalid-placeholder.csv`. It intentionally fails validation and exists only to confirm that the preflight checker catches unsafe shapes and values.

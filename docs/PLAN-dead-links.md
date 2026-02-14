
# Brainstorm: Fix Dead Links in User Dashboard

**Problem:** User reported dead links, e.g., `/en/consultation`.
**Goal:** Scan codebase, identify broken paths, map to existing routes, and fix.

## Analysis
- **Reported Broken:** `/en/consultation`
- **Suspected Cause:** Inconsistent naming between code references (`/consultation`) and actual file structure (`/consultations` or `/consultation/new`).

## Scan Results
- **Routes Found:**
    -   `src/app/[locale]/(auth)/consultation/new` (New Request)
    -   `src/app/[locale]/(auth)/consultations` (List)
    -   `src/app/[locale]/(auth)/consultation/[id]` (Detail)
- **Broken References Identified:**
    -   `bottom-tab-bar.tsx`: `href: "/consultation"` -> Should likely be `/consultations` (list) or `/consultation/new`.
    -   `quick-actions.tsx`: `href: "/consultation"` -> Should be `/consultation/new`.
    -   `public/clinics/[slug]/page.tsx`: `href: "/${locale}/consultation"` -> Should be `/consultation/new`.

## Strategy
1.  **Standardize:**
    -   **List View:** `/consultations`
    -   **New Request:** `/consultation/new`
    -   **Detail View:** `/consultation/[id]`
2.  **Fix:** Update all incorrect `href` attributes in components.

## Tasks
- [ ] Fix `bottom-tab-bar.tsx`: Change `/consultation` to `/consultations`.
- [ ] Fix `quick-actions.tsx`: Change `/consultation` to `/consultation/new`.
- [ ] Fix `clinics/[slug]/page.tsx`: Change `/consultation` to `/consultation/new`.
- [ ] Verify `admin` links (looks correct: `/admin/consultations`).

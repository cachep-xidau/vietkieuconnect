# Phase 03: Fix Breadcrumb Links

## Context Links
- [Parent Plan](./plan.md)

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Fix `/consultation` link in consultation detail breadcrumb |

## Related Code Files

### Modify
- `src/app/[locale]/(auth)/consultation/[id]/page.tsx` - Fix breadcrumb link

## Implementation Steps

### Step 1: Read Consultation Detail Page
1. Open `src/app/[locale]/(auth)/consultation/[id]/page.tsx`
2. Find breadcrumb link (around line 47)

### Step 2: Fix Breadcrumb Link
1. Change `<a href="/consultation">` to `<a href="/consultations">`
2. This points to user's consultation list page

### Step 3: Verify
1. Test breadcrumb navigates to consultations page
2. Verify navigation flow works

## Todo List
- [ ] Fix breadcrumb consultation link
- [ ] Test EN: /en/consultations works from breadcrumb
- [ ] Test VI: /vi/consultations works from breadcrumb

## Success Criteria
- [ ] Breadcrumb "Consultations" links to `/consultations`
- [ ] Navigates to user's consultation list
- [ ] No 404 error

## Next Steps
- Phase 04: Fix How It Works Link

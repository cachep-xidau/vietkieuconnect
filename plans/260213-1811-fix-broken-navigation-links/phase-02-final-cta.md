# Phase 02: Fix Final CTA Link

## Context Links
- [Parent Plan](./plan.md)

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Fix `/consultation` link in Final CTA section to `/consultation/new` |

## Related Code Files

### Modify
- `src/components/landing/final-cta-section.tsx` - Fix consultation link

## Implementation Steps

### Step 1: Read Final CTA Component
1. Open `src/components/landing/final-cta-section.tsx`
2. Find line with `/consultation` link (around line 30)

### Step 2: Fix Consultation Link
1. Change `href="/consultation"` to `href="/consultation/new"`
2. This points directly to new consultation form

### Step 3: Verify
1. Test CTA navigates to consultation form
2. Test on both EN and VI languages

## Todo List
- [ ] Fix Final CTA consultation link
- [ ] Test EN: /en/consultation/new works from CTA
- [ ] Test VI: /vi/consultation/new works from CTA

## Success Criteria
- [ ] Final CTA "Get Free Consultation" links to `/consultation/new`
- [ ] Form loads correctly
- [ ] Both languages navigate correctly

## Next Steps
- Phase 03: Fix Breadcrumb Links

# Phase 01: Fix Footer Navigation Links

## Context Links
- [Parent Plan](./plan.md)

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Fix `/consultation` links in footer to `/consultations` |

## Related Code Files

### Modify
- `src/components/layout/footer.tsx` - Fix consultation link

## Implementation Steps

### Step 1: Read Footer Component
1. Open `src/components/layout/footer.tsx`
2. Find line with `/consultation` link (around line 75)

### Step 2: Fix Consultation Link
1. Change `href="/consultation"` to `href="/consultations"`
2. This points to user's consultation list page under `(auth)` route

### Step 3: Verify
1. Test on both EN and VI languages
2. Verify link navigates to consultations page

## Todo List
- [ ] Fix footer consultation link
- [ ] Test EN: /en/consultations works
- [ ] Test VI: /vi/consultations works

## Success Criteria
- [ ] Footer "Free Consultation" links to `/consultations` (not `/consultation`)
- [ ] No 404 error when clicking footer link
- [ ] Both languages navigate correctly

## Next Steps
- Phase 02: Fix Final CTA Link

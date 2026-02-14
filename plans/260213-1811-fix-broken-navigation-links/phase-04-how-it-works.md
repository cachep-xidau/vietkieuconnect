# Phase 04: Fix How It Works Link

## Context Links
- [Parent Plan](./plan.md)

## Overview
| Field | Value |
|-------|-------|
| Priority | P1 |
| Status | Pending |
| Description | Fix `/consultation` link in How It Works section |

## Related Code Files

### Modify
- `src/app/[locale]/how-it-works/page.tsx` - Fix consultation CTA link

## Implementation Steps

### Step 1: Read How It Works Page
1. Open `src/app/[locale]/how-it-works/page.tsx`
2. Find consultation link (around line 130)

### Step 2: Fix Consultation CTA Link
1. Change `href="/consultation"` to `href="/consultation/new"`
2. This points directly to new consultation form

### Step 3: Verify
1. Test CTA in How It Works section
2. Test on both EN and VI languages

## Todo List
- [ ] Fix How It Works consultation link
- [ ] Test EN: /en/consultation/new works from How It Works
- [ ] Test VI: /vi/consultation/new works from How It Works

## Success Criteria
- [ ] How It Works CTA links to `/consultation/new`
- [ ] Form loads correctly
- [ ] Both languages navigate correctly

## Next Steps
- All phases complete - ready for testing

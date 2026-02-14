---
title: "Fix Broken Navigation Links"
description: "Fix all routes and navigation links that return 404 errors"
status: pending
priority: P1
effort: 1h
branch: main
tags: [bugfix, navigation, routing, 404]
created: 2026-02-13
---

# Plan: Fix Broken Navigation Links

## Problem
Many navigation links return 404 errors because routes don't match:
- `/consultation` → 404 (should be `/consultations` or `/consultation/new`)
- `/signin` → 404 (should be `/auth/login`)
- `/signup` → 404 (should be `/auth/register`)

## Routes Structure

### Current Structure
```
src/app/[locale]/
├── (auth)/
│   ├── consultation/
│   │   ├── [id]/page.tsx (detail view)
│   │   └── new/page.tsx (new consultation form)
│   └── dashboard/page.tsx
├── (public)/auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
└── admin/consultations/ (admin listing)
```

### Correct Route Mapping
| Wrong Link | Correct Route | Purpose |
|-----------|---------------|---------|
| `/consultation` | `/consultations` | User consultation list |
| `/consultation/new` | `/consultation/new` | New consultation form |
| `/signin` | `/auth/login` | Login page |
| `/signup` | `/auth/register` | Register page |

## Files to Fix

| File | Issue | Fix |
|------|-------|-----|
| `src/components/layout/footer.tsx` | Line 75: `/consultation` → `/consultations` |
| `src/components/landing/final-cta-section.tsx` | Line 30: `/consultation` → `/consultation/new` |
| `src/app/[locale]/(auth)/consultation/[id]/page.tsx` | Line 47: `/consultation` → `/consultations` |
| `src/app/[locale]/how-it-works/page.tsx` | Line 130: `/consultation` → `/consultation/new` |

## Phases

| # | Phase | Status | Progress |
|---|-------|--------|----------|
| 1 | [Fix Footer Links](./phase-01-footer-links.md) | Pending | 0% |
| 2 | [Fix Final CTA Link](./phase-02-final-cta.md) | Pending | 0% |
| 3 | [Fix Breadcrumb Links](./phase-03-breadcrumbs.md) | Pending | 0% |
| 4 | [Fix How It Works Link](./phase-04-how-it-works.md) | Pending | 0% |

## Success Criteria
- [ ] All footer links navigate to correct routes
- [ ] All navigation links navigate to correct routes
- [ ] No 404 errors when clicking CTAs
- [ ] Both EN and VI languages work correctly

## Risk Assessment
| Risk | Level | Mitigation |
|------|-------|------------|
| Breaking existing bookmarks | Low | Routes are only for new code deployment |
| Auth flow disruption | Low | Login/register routes unchanged |

## Dependencies
- Existing route structure
- No external API changes needed

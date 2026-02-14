# Code Review: Consultation CTA Implementation

**Date:** 2026-02-13
**Reviewer:** code-reviewer agent
**Files Reviewed:** 4

## Scope

| File | Type | Lines |
|------|------|-------|
| `src/components/dashboard/quick-actions.tsx` | New | 74 |
| `src/components/dashboard/fab-consultation.tsx` | New | 25 |
| `src/app/[locale]/(auth)/dashboard/page.tsx` | Modified | 117 |
| `src/components/landing/hero-section.tsx` | Modified | 78 |
| **Total** | | **~294** |

## Overall Assessment

**Quality Score: 8/10** - Well-structured implementation following project conventions. Minor accessibility and UX improvements needed.

### Strengths
- Proper Server/Client component separation
- Consistent i18n usage with next-intl
- Follows project code standards (kebab-case, file size limits)
- Good use of existing UI components (Card, Button)
- Proper Supabase auth patterns

---

## Critical Issues

**None identified.**

---

## High Priority

### 1. Missing Description Text in QuickActions (UX/Accessibility)

**Location:** `quick-actions.tsx:66`

```tsx
<span className="font-medium text-sm">{t(action.labelKey)}</span>
```

**Problem:** The `descKey` property is defined but never rendered. Users lose the additional context like "Start your dental care journey with a free consultation".

**Impact:** Reduced UX, lost opportunity to guide users.

**Fix:**
```tsx
<CardContent className="p-4 flex flex-col items-center text-center gap-2">
  <Icon className={`h-8 w-8 ${action.color} group-hover:scale-110 transition-transform`} />
  <span className="font-medium text-sm">{t(action.labelKey)}</span>
  <span className="text-xs text-muted-foreground line-clamp-2">{t(action.descKey)}</span>
</CardContent>
```

---

### 2. FAB Hidden on Mobile (UX)

**Location:** `fab-consultation.tsx:14`

```tsx
className="fixed bottom-6 right-6 z-40 hidden md:flex"
```

**Problem:** FAB is completely hidden on mobile devices where thumb-reach interactions are most valuable.

**Impact:** Mobile users miss the primary CTA shortcut.

**Recommendation:** Either:
1. Show on mobile with safe area insets: `className="fixed bottom-20 right-4 z-40 flex md:bottom-6 md:right-6"`
2. Or add a mobile-specific CTA in the dashboard header

---

### 3. Hydration Mismatch Risk in HeroSection

**Location:** `hero-section.tsx:12-21`

```tsx
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };
  checkAuth();
}, []);
```

**Problem:** Initial render shows "cta" text, then potentially flashes to "ctaLoggedIn" after hydration. This can cause layout shift and poor UX.

**Impact:** Visual jitter, potential CLS (Cumulative Layout Shift) metric impact.

**Fix Options:**
1. Use skeleton/loading state until auth check completes
2. Accept the flash as low-priority (current behavior is acceptable for non-critical UI)

---

## Medium Priority

### 4. Duplicate "New Consultation" CTA (DRY)

**Location:** `dashboard/page.tsx:56-61` and `quick-actions.tsx:21-27`

Both render the same `/consultation/new` link. While not technically wrong, the dashboard shows:
1. Hero button (line 56)
2. Quick Actions card (first item)
3. FAB button (desktop only)

**Recommendation:** Consider if all three are necessary. The hero CTA + Quick Actions may be sufficient, with FAB only appearing when scrolling past the hero section.

---

### 5. Missing aria-label on QuickActions Links

**Location:** `quick-actions.tsx:61`

```tsx
<Link key={action.href} href={action.href}>
```

**Problem:** Icon-first cards need descriptive aria-labels for screen readers.

**Fix:**
```tsx
<Link
  key={action.href}
  href={action.href}
  aria-label={t(action.labelKey)}
>
```

---

### 6. Hardcoded Emoji in Dashboard Welcome

**Location:** `dashboard/page.tsx:49`

```tsx
<h1 className="text-4xl font-bold truncate">
  👋 {t("dashboard.welcome", { name: userName })}
</h1>
```

**Problem:** Emoji is hardcoded, not i18n-friendly. Some locales may prefer different greetings.

**Fix:** Move emoji to translation file:
```json
"welcome": "👋 Welcome back, {name}"
```

---

### 7. Profile Query Missing Error Handling

**Location:** `dashboard/page.tsx:28-32`

```tsx
const { data: profile } = await supabase
  .from("profiles")
  .select("full_name")
  .eq("id", user.id)
  .single();
```

**Problem:** If profile doesn't exist, `.single()` throws error. Code handles the fallback but not the error case explicitly.

**Impact:** Minor - fallback to email works, but console errors may appear.

**Fix:**
```tsx
const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("full_name")
  .eq("id", user.id)
  .maybeSingle(); // Returns null instead of error when not found
```

---

## Low Priority

### 8. Color Consistency in QuickActions

**Location:** `quick-actions.tsx:26,33,40,47`

Uses Tailwind color classes (`text-blue-500`, `text-green-500`, etc.) instead of CSS variables. This works but doesn't adapt to theme changes.

**Recommendation:** Consider using semantic color tokens for dark mode support.

---

### 9. Index Key in Treatment Recommendations

**Location:** `dashboard/page.tsx:105`

```tsx
{mockRecommendations.treatments.map((treatment, index) => (
  <TreatmentRecommendationCard key={index} treatment={treatment} />
))}
```

**Problem:** Using index as key. Not critical for static lists but anti-pattern.

**Recommendation:** Treatments should have unique IDs.

---

## Security Assessment

| Check | Status |
|-------|--------|
| Auth protection on dashboard | PASS - Server-side redirect |
| No hardcoded secrets | PASS |
| No XSS vulnerabilities | PASS |
| Proper input sanitization | N/A - No user input |
| SQL injection protection | PASS - Supabase parameterized |

---

## Accessibility Assessment

| Check | Status | Notes |
|-------|--------|-------|
| Keyboard navigation | PASS | Links are focusable |
| Color contrast | PASS | Using design system colors |
| aria-labels | PARTIAL | Missing on QuickActions |
| Focus indicators | PASS | Default browser + Tailwind |
| Screen reader support | PARTIAL | FAB has aria-label, cards missing |

---

## Performance Assessment

| Check | Status |
|-------|--------|
| Server Components used | PASS - Dashboard, QuickActions |
| Client Components minimized | PASS - Only FAB, HeroSection |
| No unnecessary re-renders | PASS |
| Bundle size impact | MINIMAL - Using existing components |

---

## i18n Completeness

| Key | en.json | vi.json |
|-----|---------|---------|
| `dashboard.quickActions` | Present | Present |
| `dashboard.newConsultation` | Present | Present |
| `dashboard.myConsultations` | Present | Present |
| `dashboard.myBookings` | Present | Present |
| `dashboard.viewProfile` | Present | Present |
| `dashboard.startJourney` | Present | Present |
| `dashboard.activeConsultations` | Present | Present |
| `dashboard.upcomingBookings` | Present | Present |
| `dashboard.manageAccount` | Present | Present |
| `landing.hero.ctaLoggedIn` | Present | Present |

**Status: COMPLETE** - All translation keys are present in both locales.

---

## Positive Observations

1. **Server Components Priority** - QuickActions is a Server Component, good for performance
2. **Type Safety** - Proper TypeScript interfaces (QuickAction, LucideIcon)
3. **Consistent Styling** - Follows Tailwind patterns, uses CSS variables
4. **Import Organization** - Follows project standards (React/Next first, then internal)
5. **DRY Icon Pattern** - Clean use of Lucide icons with map pattern

---

## Recommended Actions

| Priority | Action | Effort |
|----------|--------|--------|
| 1 | Add description text to QuickActions cards | Low |
| 2 | Add aria-labels to QuickAction links | Low |
| 3 | Consider mobile FAB visibility | Medium |
| 4 | Use `maybeSingle()` for profile query | Low |
| 5 | Move welcome emoji to i18n | Low |

---

## Metrics Summary

| Metric | Value |
|--------|-------|
| Type Coverage | ~95% (good interface usage) |
| Test Coverage | Not assessed (no test files provided) |
| Linting Issues | Not run |
| Files Under 200 Lines | 4/4 (100%) |
| i18n Coverage | 100% |

---

## Unresolved Questions

1. Should FAB be visible on mobile? (Product decision)
2. Is the triple CTA pattern (Hero + QuickActions + FAB) intentional? (UX decision)
3. Are there E2E tests for the consultation flow that need updating?

---

**Review Complete.** No blocking issues. Recommended fixes are quality improvements, not blockers.

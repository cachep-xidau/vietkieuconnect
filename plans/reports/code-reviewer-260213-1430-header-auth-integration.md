# Code Review: Header Auth Integration

**Review Date:** 2026-02-13
**Reviewer:** code-reviewer agent
**Files Reviewed:**
- `/src/components/layout/user-menu.tsx` (75 lines)
- `/src/components/layout/header.tsx` (157 lines)
- `/src/app/[locale]/(auth)/profile/page.tsx` (90 lines)

---

## Overall Assessment

| Metric | Score |
|--------|-------|
| **Overall Score** | **7.5/10** |
| Code Quality | 7/10 |
| Security | 8/10 |
| Performance | 7/10 |
| Accessibility | 6/10 |
| Best Practices | 8/10 |

**Approval Status:** CONDITIONAL APPROVAL

Minor issues should be addressed before production deployment. No critical blockers.

---

## Critical Issues

**None found.**

---

## High Priority Issues

### 1. Duplicate `getInitials` Function (DRY Violation)

**Location:**
- `/src/components/layout/user-menu.tsx:22-27`
- `/src/app/[locale]/(auth)/profile/page.tsx:10-15`

**Problem:** The `getInitials` function is duplicated in two files. This violates DRY and increases maintenance burden.

**Impact:** If logic changes (e.g., handling special characters, Unicode), both files must be updated.

**Recommendation:**
```typescript
// Create src/lib/utils/user.ts
export function getInitials(name: string | undefined): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
```

---

### 2. Missing Error Handling in Profile Page Query

**Location:** `/src/app/[locale]/(auth)/profile/page.tsx:29-33`

**Problem:** The profile query does not handle database errors. If the query fails, the page may crash or show unexpected behavior.

```typescript
const { data: profile } = await supabase
  .from("profiles")
  .select("full_name, phone")
  .eq("id", user.id)
  .single();
```

**Impact:** Database connection issues or malformed queries could cause unhandled promise rejections.

**Recommendation:**
```typescript
const { data: profile, error } = await supabase
  .from("profiles")
  .select("full_name, phone")
  .eq("id", user.id)
  .single();

if (error) {
  console.error("Failed to fetch profile:", error.message);
  // Continue with fallback data
}
```

---

### 3. Logout Does Not Handle Errors

**Location:** `/src/components/layout/user-menu.tsx:35-40`

**Problem:** The `handleLogout` function swallows any errors from `signOut()`. If logout fails, the user is still redirected, potentially leaving them in an inconsistent state.

```typescript
const handleLogout = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push("/");
  router.refresh();
};
```

**Impact:** Silent failures could leave sessions active on the server while the UI shows logged-out state.

**Recommendation:**
```typescript
const handleLogout = async () => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push("/");
    router.refresh();
  } catch (error) {
    console.error("Logout failed:", error);
    // Optionally show a toast notification
  }
};
```

---

## Medium Priority Issues

### 4. Missing Loading States

**Location:** `/src/components/layout/header.tsx:22`

**Problem:** The header shows a login button briefly before the auth state is determined, causing layout shift.

```typescript
const [user, setUser] = useState<User | null>(null);
```

**Impact:** Poor UX with flickering between states.

**Recommendation:** Add a loading state:
```typescript
const [user, setUser] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const supabase = createClient();

  supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user);
    setIsLoading(false);
  });
  // ...
}, []);
```

---

### 5. Accessibility: Missing ARIA Labels on Mobile Menu

**Location:** `/src/components/layout/header.tsx:110-120`

**Problem:** The mobile menu button has `aria-label="Toggle menu"` but does not indicate the current state (open/closed).

**Impact:** Screen reader users cannot tell if the menu is expanded.

**Recommendation:**
```typescript
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="md:hidden"
  aria-label="Toggle menu"
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
>
```

Also add `id="mobile-menu"` to the mobile menu container.

---

### 6. Accessibility: Dropdown Menu Keyboard Navigation

**Location:** `/src/components/layout/user-menu.tsx:42-74`

**Problem:** The dropdown menu does not have an accessible name. Screen readers announce "menu" without context.

**Recommendation:** Add `aria-label` to the dropdown:
```typescript
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      className="flex items-center gap-2 px-2"
      aria-label="User menu"
    >
```

---

### 7. Potential Memory Leak Warning (False Positive)

**Location:** `/src/components/layout/header.tsx:32-46`

**Observation:** The subscription cleanup is correctly implemented. No issue here, just noting for completeness.

```typescript
return () => subscription.unsubscribe();
```

**Status:** Correct implementation.

---

## Low Priority Issues

### 8. Hardcoded English Strings

**Location:** `/src/app/[locale]/(auth)/profile/page.tsx:45, 62, 71, 81`

**Problem:** Some strings are hardcoded in English instead of using translations.

```typescript
<p className="text-xs text-muted-foreground">Email</p>
<p className="text-xs text-muted-foreground">Full Name</p>
<p className="text-xs text-muted-foreground">Phone</p>
```

**Impact:** Inconsistent i18n support.

**Recommendation:** Use `getTranslations("profile")` for these labels.

---

### 9. Avatar Size Prop Type Mismatch

**Location:** `/src/components/layout/user-menu.tsx:46`

**Problem:** Using `size="sm"` on Avatar, but the Avatar component expects `size?: "default" | "sm" | "lg"`. This is correct, but the user-menu uses a non-standard size that may look inconsistent with the design system.

**Status:** Acceptable, but consider standardizing avatar sizes across the app.

---

### 10. Console Warning: Phone Icon Should Use Phone Icon

**Location:** `/src/app/[locale]/(auth)/profile/page.tsx:79`

**Problem:** Using `User` icon for phone field instead of `Phone` icon.

```typescript
{profile?.phone && (
  <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
    <User className="h-5 w-5 text-muted-foreground" />  {/* Should be Phone icon */}
```

**Recommendation:**
```typescript
import { Phone } from "lucide-react";
// ...
<Phone className="h-5 w-5 text-muted-foreground" />
```

---

## Positive Observations

1. **Proper Supabase Client Usage** - Correct use of `createBrowserClient` for client components and `createServerClient` for server components.

2. **Auth State Change Subscription** - Header correctly subscribes to auth state changes and cleans up on unmount.

3. **Protected Route Pattern** - Profile page correctly redirects unauthenticated users.

4. **Type Safety** - User type imported from `@supabase/supabase-js` ensures type safety.

5. **Responsive Design** - Header properly handles mobile/desktop layouts.

6. **Component Composition** - UserMenu is a clean, reusable component.

---

## Metrics Summary

| Check | Status |
|-------|--------|
| TypeScript Errors | None visible |
| Linting Issues | Not checked (run `npm run lint`) |
| Security Vulnerabilities | None found |
| Memory Leaks | None (cleanup implemented) |
| Accessibility | 2 issues (minor) |

---

## Recommended Actions (Priority Order)

1. **[HIGH]** Extract `getInitials` to shared utility
2. **[HIGH]** Add error handling to logout function
3. **[HIGH]** Add error handling to profile query
4. **[MEDIUM]** Add loading state to header auth
5. **[MEDIUM]** Add ARIA attributes for mobile menu state
6. **[LOW]** Replace User icon with Phone icon on profile page
7. **[LOW]** Extract hardcoded strings to translations

---

## Unresolved Questions

1. Should the profile page have an edit functionality, or is it view-only?
2. Is there a design spec for the mobile menu animation/transition?
3. Should logout show a confirmation dialog?

---

## Approval Decision

**CONDITIONAL APPROVAL**

The implementation is solid and follows React/Next.js best practices. The code is clean, readable, and properly typed. The identified issues are minor and can be addressed in a follow-up PR without blocking the current deployment.

**Recommended:**
- Address HIGH priority items before next release
- Schedule MEDIUM/LOW items for a future sprint

# Brainstorm: Header Auth State & User Menu

**Date:** 2026-02-13
**Status:** Agreed - Ready for Planning

## Problem Statement

After login, header still shows "Sign In" button. No logout functionality. Users cannot access profile or sign out.

## Requirements

1. Header shows auth state (logged in vs guest)
2. Logged in: Full user menu (avatar, name, dropdown)
3. Dropdown: Profile link + Logout button
4. Profile page for logged-in users
5. Real-time auth state updates

## Evaluated Approaches

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **A: Client-Side Auth Check** | Real-time, simple, works with SSR | Hydration flash | ✅ Selected |
| B: Server Component Header | No flash | Static until refresh | ❌ |
| C: Middleware + Cookie | Fast | Sync issues | ❌ |

## Selected Solution

**Option A:** Client-side auth check with `onAuthStateChange` listener in header component.

### Architecture

```
Header Component
├── useEffect: supabase.auth.getUser() + onAuthStateChange
├── State: user | null
└── Render:
    ├── Guest: [Sign In] button
    └── LoggedIn: <UserMenu user={user} />

UserMenu Component
├── Avatar (from user.user_metadata.avatar_url)
├── Display Name (from user.user_metadata.full_name)
└── Dropdown:
    ├── Profile → /profile
    └── Logout → signOut() → redirect /
```

### File Changes

**Modify:**
- `src/components/layout/header.tsx` - Add auth state, conditional render

**Create:**
- `src/components/layout/user-menu.tsx` - User dropdown component
- `src/app/[locale]/(auth)/profile/page.tsx` - Profile page

### Implementation Notes

1. Use `createClient()` from `@/lib/supabase/client` in header
2. Subscribe to `onAuthStateChange` for real-time updates
3. Cleanup subscription on unmount
4. Handle loading state to prevent flash
5. Profile page: Server component with `getUser()` for data

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Hydration mismatch | Use `useEffect` for client-only auth check |
| Stale session | `onAuthStateChange` subscription |
| Missing avatar | Fallback to initials |

## Success Criteria

- [ ] Header shows Sign In when logged out
- [ ] Header shows user menu when logged in
- [ ] Dropdown displays avatar, name, profile link, logout
- [ ] Logout clears session and redirects to home
- [ ] Profile page accessible after login
- [ ] Auth state updates in real-time (login/logout)

## Next Steps

Run `/plan` to create detailed implementation plan.

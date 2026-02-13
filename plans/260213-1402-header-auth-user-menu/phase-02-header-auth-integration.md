**Context Links:**
- Parent Plan: [plan.md](./plan.md)
- Previous Phase: [phase-01-user-menu-component.md](./phase-01-user-menu-component.md)

**Overview:**
- **Date:** 2026-02-13
- **Description:** Add auth state detection to header component
- **Priority:** P2
- **Implementation Status:** Complete
- **Review Status:** Complete

**Key Insights:**
- Use `useEffect` with `supabase.auth.getUser()` for initial check
- Subscribe to `onAuthStateChange` for real-time updates
- Cleanup subscription on unmount
- Conditional render: user ? UserMenu : SignIn button

**Requirements:**

Functional:
- Detect if user is logged in
- Update UI when auth state changes (login/logout)
- Show UserMenu when logged in, Sign In button when logged out
- Real-time updates without page refresh

Non-functional:
- No hydration mismatch (client-only auth check)
- Minimal re-renders

**Architecture:**

```
Header Component
├── State: user | null
├── useEffect (mount):
│   ├── supabase.auth.getUser()
│   └── supabase.auth.onAuthStateChange() subscription
├── Cleanup: subscription.unsubscribe()
└── Render:
    ├── user exists → <UserMenu user={user} />
    └── user null → <SignIn button />
```

**Related Code Files:**

Modify:
- `src/components/layout/header.tsx`

Reference:
- `src/lib/supabase/client.ts` - createClient function
- `src/components/layout/user-menu.tsx` - UserMenu component (Phase 1)

**Implementation Steps:**

1. Open `src/components/layout/header.tsx`
2. Import `createClient` from `@/lib/supabase/client`
3. Import `User` type from `@supabase/supabase-js` or use inferred type
4. Import `UserMenu` from `./user-menu`
5. Add state: `const [user, setUser] = useState<User | null>(null)`
6. Add useEffect:
   - Create supabase client
   - Call `supabase.auth.getUser()` and setUser with result
   - Subscribe to `supabase.auth.onAuthStateChange((event, session) => ...)`
   - In callback: setUser(session?.user ?? null)
   - Return cleanup: `subscription.unsubscribe()`
7. In desktop actions (line 78-83):
   - Replace static Sign In button with conditional
   - `{user ? <UserMenu user={user} /> : <Button>Sign In</Button>}`
8. In mobile menu (line 118-123):
   - Same conditional render for mobile
9. Test: login → header shows user menu, logout → shows sign in

**Todo List:**

- [ ] Add supabase client import
- [ ] Add User type import
- [ ] Add UserMenu component import
- [ ] Add user state with useState
- [ ] Add useEffect with getUser + onAuthStateChange
- [ ] Add cleanup for subscription
- [ ] Update desktop actions render
- [ ] Update mobile menu render
- [ ] Test login/logout flow

**Success Criteria:**

- Header shows Sign In when not logged in
- Header shows UserMenu when logged in
- Auth state updates in real-time
- No console errors
- No memory leaks (subscription cleaned up)

**Risk Assessment:**

Medium:
- Hydration mismatch → Use useEffect (client-only)

**Security Considerations:**

- Auth state from Supabase (trusted source)
- No sensitive data exposed

**Next Steps:**

After Phase 2 complete:
- Proceed to Phase 3 (Profile Page)
- Test full auth flow

**Context Links:**
- Parent Plan: [plan.md](./plan.md)

**Overview:**
- **Date:** 2026-02-13
- **Description:** Create profile page for authenticated users
- **Priority:** P2
- **Implementation Status:** Complete
- **Review Status:** Complete

**Key Insights:**
- Server component with `createClient()` from server.ts
- Redirect to login if not authenticated
- Display user info from auth metadata and profiles table
- Simple layout, no complex features

**Requirements:**

Functional:
- Show user's email, name, avatar
- Show profile info from database (if exists)
- Redirect to login if not authenticated
- Link back to dashboard

Non-functional:
- Server-side auth check (no flash)
- Match app styling (Card, etc.)

**Architecture:**

```
Profile Page (Server Component)
├── getServerUser() → redirect if null
├── getProfile(userId) → optional
└── Render:
    ├── Card with user info
    ├── Avatar (large)
    ├── Email
    ├── Name
    └── Back to Dashboard link
```

**Related Code Files:**

Create:
- `src/app/[locale]/(auth)/profile/page.tsx`

Reference:
- `src/lib/supabase/server.ts` - Server client
- `src/components/ui/card.tsx` - Card component
- `src/components/ui/avatar.tsx` - Avatar component
- `src/app/[locale]/(auth)/dashboard/page.tsx` - Similar pattern

**Implementation Steps:**

1. Create `src/app/[locale]/(auth)/profile/page.tsx`
2. Make it async server component
3. Import `createClient` from `@/lib/supabase/server`
4. Import `redirect` from `next/navigation`
5. Import Card components from ui/card
6. Import Avatar components from ui/avatar
7. Import `Link` from i18n/routing
8. Import `getTranslations` from next-intl/server
9. In component:
   - `const supabase = await createClient()`
   - `const { data: { user } } = await supabase.auth.getUser()`
   - `if (!user) redirect('/login')`
   - Optionally fetch profile from database
10. Render Card with:
    - Title: "Profile" (translated)
    - Large Avatar with user image or initials
    - Email display
    - Name display
    - Link back to dashboard

**Todo List:**

- [ ] Create profile/page.tsx file
- [ ] Add server-side auth check with redirect
- [ ] Add Card layout with user info
- [ ] Add Avatar component
- [ ] Add translations (en.json, vi.json)
- [ ] Add back navigation link

**Success Criteria:**

- Page renders at /[locale]/profile
- Redirects to login if not authenticated
- Shows user email and name
- Avatar displays correctly
- Back link works

**Risk Assessment:**

Low:
- Missing profile in DB → show auth metadata only

**Security Considerations:**

- Server-side auth check prevents unauthorized access
- No sensitive operations

**Next Steps:**

After Phase 3 complete:
- Test full flow: login → header shows user menu → click profile → see profile page
- Add i18n translations for "Profile" label

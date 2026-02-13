**Context Links:**
- Parent Plan: [plan.md](./plan.md)

**Overview:**
- **Date:** 2026-02-13
- **Description:** Create UserMenu component with avatar dropdown
- **Priority:** P2
- **Implementation Status:** Complete
- **Review Status:** Complete

**Key Insights:**
- Use existing shadcn dropdown-menu and avatar components
- User info from Supabase `user.user_metadata` (full_name, avatar_url)
- Logout via client-side `supabase.auth.signOut()`
- Fallback avatar shows initials if no image

**Requirements:**

Functional:
- Display user avatar (from OAuth) or initials fallback
- Show display name next to avatar
- Dropdown menu with Profile and Logout options
- Logout clears session and redirects to home

Non-functional:
- Match existing header styling
- Responsive (works on mobile)
- Accessible (keyboard navigation)

**Architecture:**

```
UserMenu Component
├── Trigger: Avatar + Name + ChevronDown
├── Dropdown Content:
│   ├── Profile → Link to /profile
│   ├── Separator
│   └── Logout → signOut() + redirect
└── State: Uses Supabase user prop from parent
```

**Related Code Files:**

Reference:
- `src/components/ui/dropdown-menu.tsx` - Existing dropdown component
- `src/components/ui/avatar.tsx` - Existing avatar component
- `src/components/ui/button.tsx` - Button styling
- `src/lib/supabase/client.ts` - Browser client for signOut

Create:
- `src/components/layout/user-menu.tsx`

**Implementation Steps:**

1. Create `src/components/layout/user-menu.tsx`
2. Import: Avatar, AvatarImage, AvatarFallback from avatar.tsx
3. Import: DropdownMenu components from dropdown-menu.tsx
4. Import: createClient from supabase/client
5. Import: useRouter from next/navigation
6. Import: Link from i18n/routing
7. Import: LogOut, User, ChevronDown icons from lucide-react
8. Accept `user` prop (Supabase User type)
9. Extract displayName from user.user_metadata.full_name or email
10. Extract avatarUrl from user.user_metadata.avatar_url
11. Create getInitials helper (first letter of first/last name)
12. Create handleLogout async function:
    - Call supabase.auth.signOut()
    - router.push('/') to redirect
13. Render DropdownMenu with trigger (Avatar + Name + ChevronDown)
14. DropdownMenuItem: Profile link (use Link component)
15. DropdownMenuSeparator
16. DropdownMenuItem: Logout (onClick = handleLogout, variant="destructive")

**Todo List:**

- [ ] Create user-menu.tsx file
- [ ] Add imports (dropdown, avatar, icons, supabase, router)
- [ ] Define UserMenuProps interface
- [ ] Create getInitials helper
- [ ] Create handleLogout function
- [ ] Render trigger with avatar and name
- [ ] Add Profile menu item
- [ ] Add Logout menu item
- [ ] Style to match header aesthetic

**Success Criteria:**

- Component renders without errors
- Shows avatar or initials fallback
- Dropdown opens on click
- Profile link navigates to /profile
- Logout clears session and redirects

**Risk Assessment:**

Low:
- Missing avatar_url → use initials (handled by AvatarFallback)

**Security Considerations:**

- signOut() clears session cookies
- No sensitive data in component

**Next Steps:**

After Phase 1 complete:
- Proceed to Phase 2 (Header Auth Integration)
- Pass user prop from header to UserMenu

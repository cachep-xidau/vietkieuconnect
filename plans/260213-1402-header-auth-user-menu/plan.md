---
title: "Header Auth State & User Menu"
description: "Add auth-aware header with user menu dropdown and profile page"
status: complete
priority: P2
effort: 2h
branch: main
tags: [auth, header, user-menu, profile]
created: 2026-02-13
---

# Header Auth State & User Menu

## Overview

Implement auth-aware header that shows user menu when logged in, Sign In button when logged out. Add profile page for authenticated users.

## Problem

- Header always shows "Sign In" button regardless of auth state
- No logout functionality
- No profile page

## Implementation Phases

### Phase 1: User Menu Component
**Status:** Complete
**Effort:** 45min
**File:** [phase-01-user-menu-component.md](./phase-01-user-menu-component.md)

Create `UserMenu` component with avatar, dropdown (Profile, Logout).

### Phase 2: Header Auth Integration
**Status:** Complete
**Effort:** 45min
**File:** [phase-02-header-auth-integration.md](./phase-02-header-auth-integration.md)

Add auth state detection to header using Supabase client + onAuthStateChange.

### Phase 3: Profile Page
**Status:** Complete
**Effort:** 30min
**File:** [phase-03-profile-page.md](./phase-03-profile-page.md)

Create profile page showing user info.

## Dependencies

- Phase 2 depends on Phase 1 (UserMenu component)
- Phase 3 independent (can run parallel)

## Success Criteria

- [x] Header shows Sign In when logged out
- [x] Header shows user menu (avatar + dropdown) when logged in
- [x] Logout clears session and redirects to home
- [x] Profile page accessible at /[locale]/profile
- [x] Auth state updates in real-time

## Files Summary

| Action | File |
|--------|------|
| Create | `src/components/layout/user-menu.tsx` |
| Modify | `src/components/layout/header.tsx` |
| Create | `src/app/[locale]/(auth)/profile/page.tsx` |

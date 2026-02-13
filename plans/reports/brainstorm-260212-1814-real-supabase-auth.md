# Brainstorm: Real Supabase Authentication

## Problem Statement
VietKieuConnect app (Next.js 16 + Supabase) currently runs mock authentication with in-memory user storage and cookie-based fake sessions. Need to enable real Supabase auth with Email/Password + Google OAuth.

## Current State
- Mock auth active via re-export files (`auth-actions.ts` → `mock-auth-actions.ts`, `server.ts` → `mock-server.ts`)
- Real Supabase code exists in `.backup` files — fully implemented
- Database migrations ready (7 files + seed)
- Auth callback route exists but has bug (`exchangeCodeForSession()` missing `code` arg)
- Middleware supports dual mode (mock + real)
- No Supabase project created yet

## Evaluated Approaches

### Approach A: Restore Backup Files (Chosen)
**Pros:** Minimal code changes, tested logic, fast turnaround
**Cons:** Need to fix minor bugs, cleanup mock remnants

### Approach B: Rewrite Auth from Scratch
**Pros:** Clean slate, can use latest patterns
**Cons:** Unnecessary — backup code is solid, wastes effort

### Approach C: Better Auth / NextAuth
**Pros:** Framework-agnostic auth
**Cons:** Entire codebase built around Supabase client, would require massive refactor

**Decision: Approach A** — restore backups + configure Supabase cloud.

## Implementation Summary

### Files to Modify
| File | Action |
|------|--------|
| `src/lib/actions/auth-actions.ts` | Overwrite with backup content |
| `src/lib/supabase/server.ts` | Overwrite with backup content |
| `src/middleware.ts` | Remove mock session logic (lines 38-49, 80-81) |
| `src/lib/auth/admin-auth-helper.ts` | Remove mock metadata branch |
| `src/app/[locale]/auth/callback/route.ts` | Fix `exchangeCodeForSession(code)` |
| `.env.local` | Add real Supabase credentials |

### Files to Delete
- `src/lib/actions/mock-auth-actions.ts`
- `src/lib/supabase/mock-server.ts`
- `src/lib/actions/auth-actions.ts.backup` (after restore)
- `src/lib/supabase/server.ts.backup` (after restore)

### External Setup Required (User)
1. Create Supabase project at supabase.com
2. Run database migrations
3. Create Google OAuth credentials (Google Cloud Console)
4. Configure Google provider in Supabase Dashboard

### Bugs to Fix
1. `exchangeCodeForSession()` → `exchangeCodeForSession(code)`
2. `signIn`/`signUp` hardcode `/en` redirect → dynamic locale (optional)

### Risks
- **Low**: Code swap, not new logic
- **Email confirmation**: Supabase default requires email verification on signup — can disable for dev
- **Google OAuth**: Requires Google Cloud Console setup (user-dependent)
- **Locale redirect**: Minor UX issue, not blocking

## Success Criteria
- [ ] Email/password login works
- [ ] Email/password registration works
- [ ] Google OAuth login works
- [ ] Forgot password sends reset email
- [ ] Sign out clears session
- [ ] Protected routes redirect to login
- [ ] Admin routes check `profiles.role`
- [ ] Mock files fully removed

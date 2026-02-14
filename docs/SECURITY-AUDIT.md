# Security & Edge Case Audit Report

**Date:** 2026-02-14
**Scope:** Full codebase — `src/lib/actions/`, `src/middleware.ts`, `src/app/`, RLS policies, env config

---

## 🔴 CRITICAL

### 1. `.env.local` Committed to Git History
**File:** `.env.local`
**Issue:** Contains Supabase URL and anon key. While `NEXT_PUBLIC_*` keys are designed to be public, this file could later contain secrets (e.g., service role key, OAuth client secrets). The Google client secret JSON was nearly committed earlier.
**Fix:** Verify `.env.local` is in `.gitignore`. Audit git history for leaked secrets with `git log --diff-filter=A -- '*.json' '*.env*'`.

### 2. Admin Stats Action — No Auth Check
**File:** `admin-stats-actions.ts` → `getDashboardStats()`
**Issue:** This server action has **NO authentication or admin role check**. Any user (or unauthenticated request) can call it to enumerate total clinics, bookings, revenue, and active users.
**Fix:** Add `checkAdminRole()` call at the top of the function.

---

## 🟠 HIGH

### 3. SQL Injection via `ilike` in Admin Search
**Files:**
- `admin-consultation-actions.ts:62` → `.or(\`treatment_description.ilike.%${filters.search}%\`)`
- `admin-booking-actions.ts:59` → `.or(\`user.email.ilike.%${filters.search}%,...\`)`
- `admin-clinic-queries.ts:39` → `.or(\`name.ilike.%${filters.search}%,...\`)`

**Issue:** User-supplied `filters.search` is interpolated directly into PostgREST filter strings. While Supabase's PostgREST client does some escaping, embedding user input in `.or()` filter strings can be exploited with carefully crafted input containing `,` or `)` characters to manipulate the filter logic.
**Fix:** Sanitize input by escaping special PostgREST characters (`,`, `.`, `(`, `)`, `%`) or use `.ilike()` method instead of string interpolation.

### 4. Missing Middleware Protection for `/consultation/new`
**File:** `middleware.ts:47-53`
**Issue:** The `isProtectedPage` check includes `/consultations` but NOT `/consultation` (singular). This means `/en/consultation/new` and `/en/consultation/[id]` are **NOT protected by middleware** and are accessible to unauthenticated users. The server action itself checks auth, but the page renders before the action fails.
**Fix:** Add `pathname.includes("/consultation")` to the `isProtectedPage` check.

---

## 🟡 MEDIUM

### 5. No Server-Side Input Validation on `submitConsultation`
**File:** `consultation-actions.ts:8-43`
**Issue:** The `submitConsultation` action accepts `ConsultationRequestInput` but does NOT validate it server-side with Zod. The `consultationRequestSchema` is only used on the client (form resolver). A malicious actor can call the server action directly with invalid data (e.g., empty treatment description, patient count = 1000).
**Fix:** Add `consultationRequestSchema.safeParse(data)` validation at the top of the server action.

### 6. Reviews Auto-Approved Without Moderation
**File:** `review-actions.ts:110`
**Issue:** `status: "approved"` is hardcoded. All reviews from "completed" bookings are auto-approved and immediately visible. There is no content moderation, spam detection, or abuse prevention.
**Fix:** Change default to `status: "pending"` and add admin moderation workflow, or integrate basic content filtering.

### 7. Consultation Detail — `travel_dates` Still Uses `JSON.stringify`
**File:** `consultation/[id]/page.tsx:78`
**Issue:** The detail page still renders `{JSON.stringify(consultation.travel_dates)}` which would show the raw Postgres DATERANGE string like `[2026-03-01,2026-03-15)` instead of formatted dates.
**Fix:** Parse the DATERANGE format and display properly, consistent with the fix applied to `consultations/page.tsx`.

---

## 🟢 LOW

### 8. Breadcrumb Links Use `<a>` Instead of `<Link>`
**Files:** `consultation/[id]/page.tsx:45-47`, `bookings/[id]/page.tsx:51-53`
**Issue:** Breadcrumb navigation uses plain `<a>` tags instead of `next-intl`'s `<Link>`, causing full page reloads and bypassing locale routing.
**Fix:** Replace `<a href="/dashboard">` with `<Link href="/dashboard">`.

### 9. No Rate Limiting on Server Actions
**Issue:** No rate limiting on `submitConsultation`, `flagReview`, `signIn`, `signUp`, or `resetPassword`. A bot could spam consultation requests or brute-force login.
**Fix:** Implement rate limiting via Supabase Edge Functions, Vercel middleware, or `@upstash/ratelimit`.

### 10. `signOut` Redirects to `/dashboard` (Protected Route)
**File:** `auth-actions.ts:97`
**Issue:** After signing out, the user is redirected to `/dashboard` which requires auth — causing an immediate re-redirect to `/login`. Should redirect to `/` or `/login` directly.
**Fix:** Change `redirect("/dashboard")` to `redirect("/")`.

---

## ✅ What's Working Well

| Area | Status |
| :--- | :--- |
| RLS Policies | ✅ Correctly scoped per user/admin |
| Admin Action Auth | ✅ All use `verifyAdminAccess()` (except `getDashboardStats`) |
| Booking Ownership | ✅ Verifies `user_id` before mutations |
| Review Ownership | ✅ Checks `booking.user_id === user.id` |
| No XSS Vectors | ✅ No `dangerouslySetInnerHTML` anywhere |
| No API Routes | ✅ All data flows through server actions |
| Env Validation | ✅ `validateEnv()` checks required vars at startup |
| Middleware Auth | ✅ Protects dashboard, profile, bookings, consultations, admin |

---

## Priority Fix Order

1. 🔴 **Admin Stats Auth** — Trivial fix, critical exposure
2. 🟠 **Middleware `/consultation` gap** — Quick fix, auth bypass
3. 🟠 **Admin search sanitization** — Prevent filter manipulation
4. 🟡 **Server-side validation** — Defense in depth
5. 🟡 **Detail page travel_dates** — UX bug
6. 🟢 **Breadcrumb links** — Minor DX/UX
7. 🟢 **SignOut redirect** — Minor UX

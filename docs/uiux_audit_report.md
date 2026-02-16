# VietKieuConnect — Comprehensive UI/UX Audit Report

**Audited URL:** `https://vietkieuconnect-na.vercel.app/`
**Date:** February 14, 2026
**Scope:** All public pages + authenticated user flows (dashboard, consultations)

---

## Executive Summary

VietKieuConnect has a solid functional foundation — core flows (browse clinics → create consultation → track status) work end-to-end. The shadcn/ui component library provides consistent styling. However, several issues need addressing across **visual polish**, **content/i18n**, **interaction design**, and **broken links** to reach production quality.

| Category | Critical | High | Medium | Low |
|---|---|---|---|---|
| Broken Functionality | 1 | — | — | — |
| i18n / Content | — | 3 | 2 | 1 |
| Visual Design | — | 2 | 4 | 3 |
| Interaction / UX | — | 1 | 3 | 2 |
| Layout / Spacing | — | — | 3 | 2 |

---

## 🔴 Critical Issues

### C-1 · Footer "Tính Chi Phí" link → 404

> [!CAUTION]
> The footer link "Tính Chi Phí" (Cost Calculator) navigates to `/vi/calculator` which returns a **404 page**. The correct route is `/vi/cost-calculator`.

**Pages affected:** Every page (global footer)
**Fix:** Update the footer link href from `/calculator` to `/cost-calculator`.

![Footer showing broken link](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_home_bottom_1771065717258.png)

---

## 🟠 High Priority Issues

### H-1 · Untranslated strings in Clinic Detail pricing table

The "Bảng Giá" (Pricing) section on the clinic detail page displays **"consultation"** and **"$Free"** in English, even when browsing in Vietnamese (`/vi/`). These should be localized (e.g., "Tư vấn" / "Miễn phí").

![Pricing table with untranslated strings](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_clinic_detail_mid_1771065758662.png)

### H-2 · Consultation Detail — partially untranslated

The Consultation Detail page shows English labels ("Consultation Details", "Request Information", "Treatment Description", "Number of Patients", "Submitted") despite the site being in Vietnamese mode. Only the waiting-state message ("Đang chờ phản hồi từ nha khoa") is translated.

![Consultation detail with mixed languages](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_consultation_detail_1771066133182.png)

### H-3 · Consultation list — English consultation titles

Consultation card titles display test data in English ("Buffer fix test – dental cleaning consultation"). While this is test data, if real user data also appears unlocalized, the status labels ("Đã Gửi", "Đang Xem Xét") should be consistently Vietnamese throughout.

### H-4 · Homepage hero lacks visual imagery

The hero section is pure text on a flat light-gray background. For a dental tourism platform, adding a hero photograph (e.g., modern dental clinic, Vietnam landmark, or smiling patient) with a gradient overlay would dramatically increase emotional connection and trust.

![Plain hero section](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_home_hero_1771065670344.png)

### H-5 · Featured clinics on homepage have no photos

The "Phòng Khám Nổi Bật" section shows 3 clinics with **gray placeholder boxes** instead of actual clinic photos. This is the first content users see below the hero — missing imagery severely undermines credibility.

![Featured clinics with placeholder images](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_home_mid_1771065706112.png)

---

## 🟡 Medium Priority Issues

### M-1 · Clinics list — missing photos for 2 of 3 clinics

On the clinics list page, "Nha Khoa Thế Giới Implant" and "Nha Khoa San Dentist" display a gray box with a single letter "N" placeholder instead of real photos. Only "Nha Khoa Teennie Clinic" shows a doctor's photo.

![Clinics list with missing photos](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_clinics_list_1771065730378.png)

### M-2 · Clinic detail page has no header photo/gallery

The clinic detail page jumps straight into the clinic name, address, and rating without any visual header. A photo gallery or hero image of the clinic interior/exterior would build trust and help users visualize the location.

![Clinic detail without photos](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_clinic_detail_top_1771065744138.png)

### M-3 · Rating displays "(0)" review count

All clinics show high ratings (4.7–4.9) but with **(0)** reviews. This creates a credibility paradox — high rating with zero reviews looks fabricated. Consider either:
- Hiding the review count when it's zero
- Showing "Chưa có đánh giá" (No reviews yet) instead

### M-4 · "How It Works" page — excessive vertical whitespace

The section between the page heading ("Cách Hoạt Động") and the first step ("Gửi Yêu Cầu") has ~200px of empty space, creating a disconnected feel. Tighten the gap.

![Excessive whitespace on How It Works](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_how_it_works_top_1771065797605.png)

### M-5 · Dashboard "Hẹn Tiếp Theo" card text overflow

The "Hẹn Tiếp Theo" (Next Appointment) card shows "Chưa có lịch hẹn" text that's oversized and breaks onto two lines, creating visual asymmetry with the other stat cards that use single-line values.

![Dashboard stat card overflow](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_dashboard_1771066043781.png)

### M-6 · Consultation form — clinic avatar shows "N" initial

In the "Phòng Khám Ưu Tiên" (Preferred Clinics) selector, clinic avatars show a generic "N" letter on a dark green circle instead of the clinic logo/photo. This doesn't help users visually identify clinics.

![Clinic avatars in consultation form](file:///Users/lucasbraci/.gemini/antigravity/brain/430ffb73-dcae-4b63-af67-d496e1e2db8f/audit_consultation_form_bottom_1771066093858.png)

### M-7 · Footer links to non-existent pages

Several footer links appear to point to placeholder pages:
- "Hướng Dẫn Du Lịch Nha Khoa" (Dental Travel Guide) — verify it exists
- "Câu Hỏi Thường Gặp" (FAQ) — verify it exists
- "Email" / "Hỗ Trợ" — verify they have proper targets (`mailto:` / support page)

---

## 🟢 Low Priority / Polish Items

### L-1 · City filter chips inconsistency

The clinics page uses "TP.HCM" as a city filter but clinic cards display "Ho Chi Minh" (English). Standardize to one format (recommend "TP.HCM" for Vietnamese mode).

### L-2 · Statistics bar on homepage lacks animation

The "60-80% / 50+ / 2.000+ / 98%" stats bar would benefit from count-up animations on scroll-into-view to add dynamism.

### L-3 · No favicon or custom loading state

The browser tab shows a generic Next.js favicon. Add the VietKieuConnect logo as favicon for brand consistency.

### L-4 · Homepage section gap between "Phòng Khám Nổi Bật" and CTA

The transition from featured clinics to the teal CTA banner ("Sẵn Sàng Tiết Kiệm Chi Phí Nha Khoa?") is abrupt — no testimonials, trust badges, or social proof section in between.

### L-5 · Consultation stepper icons are small

On the consultations list, the 4-step progress stepper (Đã Gửi → Đang Xem Xét → Đã Báo Giá → Đã Đặt Lịch) uses icons that are quite small at the regular viewport width. Consider slightly larger icons or adding connector line animations.

---

## Page-by-Page Summary

### Homepage (`/vi`)

| Aspect | Score | Notes |
|---|---|---|
| Visual Impact | ⭐⭐ | No hero image, plain gray background |
| Content | ⭐⭐⭐ | Good value proposition, stats bar works well |
| Trust Signals | ⭐⭐ | Featured clinics have no photos |
| CTA Clarity | ⭐⭐⭐⭐ | Two clear CTAs: "Tư Vấn Mới" + "Cách Hoạt Động" |

### Clinics List (`/vi/clinics`)

| Aspect | Score | Notes |
|---|---|---|
| Filtering | ⭐⭐⭐⭐ | City pills + service tags + sort dropdown |
| Card Design | ⭐⭐⭐ | Good layout with clickable address, but missing photos |
| Data Quality | ⭐⭐ | 0 reviews, placeholder images |

### Clinic Detail (`/vi/clinics/[slug]`)

| Aspect | Score | Notes |
|---|---|---|
| Information | ⭐⭐⭐ | Description, services, pricing, contact all present |
| Visual | ⭐⭐ | No gallery, no header image |
| i18n | ⭐⭐ | "consultation" / "$Free" untranslated |
| CTAs | ⭐⭐⭐⭐ | "Tư Vấn Miễn Phí" + "Đánh Giá" buttons clear |

### How It Works (`/vi/how-it-works`)

| Aspect | Score | Notes |
|---|---|---|
| Clarity | ⭐⭐⭐⭐ | 3-step Process well-explained with icons |
| Layout | ⭐⭐⭐ | Excessive whitespace between header and content |
| CTA | ⭐⭐⭐⭐ | "Tư Vấn Miễn Phí" CTA at bottom |

### Dashboard (`/vi/dashboard`)

| Aspect | Score | Notes |
|---|---|---|
| Information | ⭐⭐⭐⭐ | Stats, quick actions, activity history all present |
| Layout | ⭐⭐⭐ | Clean 4-column grid, slight overflow on "Hẹn Tiếp Theo" |
| Personalization | ⭐⭐⭐⭐ | Greeting with user name + emoji |

### Consultations (`/vi/consultations`)

| Aspect | Score | Notes |
|---|---|---|
| List View | ⭐⭐⭐⭐ | Status filters, progress stepper per card, edit/delete icons |
| Detail View | ⭐⭐ | Mixed language (EN labels), sparse layout |
| Create Form | ⭐⭐⭐⭐ | Multi-step with progress bar, clinic selector |

---

## Recommended Action Plan

### Phase 1 — Quick Fixes (1–2 days)
1. Fix footer "Tính Chi Phí" link → `/cost-calculator`
2. Translate clinic detail pricing ("consultation" → "Tư vấn", "$Free" → "Miễn phí")
3. Translate consultation detail labels to Vietnamese
4. Fix "Hẹn Tiếp Theo" card text sizing

### Phase 2 — Visual Enhancement (3–5 days)
5. Add hero background image with gradient overlay
6. Populate featured clinic photos (or use generated placeholders)
7. Add clinic detail photo gallery/hero
8. Reduce whitespace on "How It Works" page
9. Add count-up animation to homepage stats

### Phase 3 — Content & Trust (ongoing)
10. Populate real review data or hide "(0)" counts
11. Verify all footer links work (FAQ, Travel Guide, Support)
12. Add testimonials / trust badges section to homepage
13. Add favicon + meta tags for SEO
14. Standardize city naming (TP.HCM vs Ho Chi Minh)

---

*Report generated by UI/UX audit of VietKieuConnect production deployment.*

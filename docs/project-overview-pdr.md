# Project Overview & PDR

## Executive Summary

VietKieu Connect is a dental tourism marketplace connecting overseas Vietnamese with verified dental clinics in Vietnam.

## Product Requirements

### Core Features

**User Journey:**
1. Discover clinics (search, filter, compare)
2. Request consultation (multi-step wizard with X-ray upload)
3. Receive treatment plan quote
4. Book appointment
5. Complete treatment and review

**Admin Dashboard:**
- Manage clinics (CRUD, verify)
- Review consultations
- Create treatment plans
- Manage bookings
- Moderate reviews

### Functional Requirements

**FR-1: Clinic Discovery**
- Paginated clinic directory
- Search by treatment type, city
- Filter by verified status
- Clinic profiles with galleries
- Before/after slider
- Compare clinics side-by-side

**FR-2: Consultation System**
- Multi-step form (5 steps)
- X-ray image upload (drag & drop)
- Treatment description
- Travel dates selection
- Patient count and budget
- Status tracking

**FR-3: Booking Management**
- Book from approved treatment plans
- View booking status
- Cancel bookings
- View treatment plans

**FR-4: Reviews**
- Submit reviews for completed bookings
- Photo upload (5 max)
- Rating system (1-5 stars)
- View clinic ratings

**FR-5: Admin Panel**
- Dashboard metrics
- Clinic management
- Consultation queue
- Treatment plan creation
- Booking status updates
- Review moderation

### Non-Functional Requirements

**NFR-1: Performance**
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Interactive < 3s

**NFR-2: Security**
- RLS on all database tables
- Input validation on all forms
- Protected admin routes
- Secure authentication (Supabase Auth)

**NFR-3: Internationalization**
- Bilingual support (English + Vietnamese)
- URL-based locale routing (/en/*, /vi/*)

**NFR-4: Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility

## Technical Architecture

### Frontend Stack
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui components

### Backend Stack
- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Storage
- Server Actions

### Database
8 tables with RLS:
- profiles
- clinics
- consultations
- consultation_images
- treatment_plans
- bookings
- reviews
- flagged_reviews

## Component Catalog

### Layout Components
| Component | File | Description |
|-----------|------|-------------|
| Header | `components/layout/header.tsx` | Navigation with auth state |
| Footer | `components/layout/footer.tsx` | Footer links and info |
| UserMenu | `components/layout/user-menu.tsx` | User dropdown with logout |
| LanguageToggle | `components/layout/language-toggle.tsx` | Language switcher |

### UI Components
All shadcn/ui components in `components/ui/`:
- Avatar, Button, Card, Dialog, Dropdown, Form, Input, etc.

## API Endpoints

Server Actions (internal, not public API):
- `/lib/actions/auth/*` - Auth operations
- `/lib/actions/clinics/*` - Clinic CRUD
- `/lib/actions/consultations/*` - Consultation management
- `/lib/actions/bookings/*` - Booking operations
- `/lib/actions/reviews/*` - Review management

## Acceptance Criteria

### AC-1: Authentication
- Users can sign up with email
- Users can log in with email/password
- Protected routes redirect unauthenticated users
- Auth state persists across page navigation

### AC-2: Profile Page
- Logged-in users see their profile
- Displays email, full name, phone (if available)
- Avatar with initials
- Back to dashboard link

### AC-3: Header Auth
- Shows Sign In button when not authenticated
- Shows UserMenu when authenticated
- Avatar displays user initials
- Logout redirects to home and refreshes state

## Success Metrics

- User registration conversion: > 5%
- Consultation submission rate: > 20% of registered users
- Booking completion rate: > 60% of consultations
- Review submission rate: > 40% of bookings
- Admin response time: < 24 hours for consultations

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Clinic verification | High | Manual review + badge system |
| Payment disputes | Medium | Clear refund policy in UI |
| Data breach | High | RLS + secure auth |
| Poor UX on mobile | Medium | Responsive testing |

## Future Enhancements

**Phase 2:**
- Email notifications (Resend)
- Payment integration (Stripe)
- Live chat support
- Mobile apps (React Native)

**Phase 3:**
- Advanced search (Elasticsearch)
- AI treatment recommendations
- Video consultations
- Multi-currency support

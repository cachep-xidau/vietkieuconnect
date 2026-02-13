# VietKieu Connect

**A comprehensive dental tourism platform connecting overseas Vietnamese with trusted dental clinics in Vietnam.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Overview

VietKieu Connect bridges the gap between overseas Vietnamese seeking affordable, high-quality dental care and verified dental clinics in Vietnam. The platform offers:

- **Clinic Discovery:** Browse and compare verified dental clinics across Vietnam
- **Smart Consultations:** Submit consultation requests with X-ray uploads
- **Transparent Pricing:** Get detailed treatment plan quotes from clinics
- **Easy Booking:** Manage bookings and track treatment progress
- **Trust System:** Read verified reviews from real patients
- **Bilingual Support:** Full English and Vietnamese translations

---

## ✨ Features

### For Patients

- 🏥 **Clinic Directory** - Search and filter clinics by treatment, city, verification status
- 📊 **Comparison Tool** - Compare multiple clinics side-by-side
- 💬 **Consultation Wizard** - 5-step process with X-ray image upload
- 📅 **Booking Management** - Track consultation status and treatment plans
- ⭐ **Review System** - Submit reviews with photos for completed treatments
- 💰 **Savings Calculator** - See potential cost savings vs home country
- 📸 **Before/After Gallery** - View clinic results and success stories

### For Clinics (Admin Dashboard)

- 🏢 **Clinic Management** - Complete CRUD operations for clinic profiles
- 📋 **Consultation Queue** - View and respond to consultation requests
- 💵 **Quote Creation** - Generate detailed treatment plan quotes
- 📊 **Booking Tracking** - Manage booking statuses (pending → confirmed → completed)
- 🔍 **Review Moderation** - Flag and manage inappropriate reviews
- 📈 **Dashboard Analytics** - View key metrics and performance stats

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Internationalization:** next-intl (English + Vietnamese)

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage (images, X-rays)
- **Server Actions:** Next.js Server Actions
- **Validation:** Zod schemas
- **ORM:** Supabase JavaScript Client

### Security
- Row Level Security (RLS) on all tables
- Server-side role-based access control
- Input validation (Zod)
- SQL injection prevention
- XSS prevention (React auto-escaping)
- File upload validation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account (free tier available)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vietkieuconnect/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local` file:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**

   Run migrations:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
app/
├── src/
│   ├── app/[locale]/
│   │   ├── (public)/           # Public routes (landing, clinics, compare)
│   │   ├── (auth)/             # Authenticated routes (dashboard, bookings)
│   │   └── admin/              # Admin dashboard
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── clinic/             # Clinic-related components
│   │   ├── booking/            # Booking components
│   │   ├── review/             # Review components
│   │   └── admin/              # Admin components
│   ├── lib/
│   │   ├── actions/            # Server actions
│   │   ├── validators/         # Zod validation schemas
│   │   ├── auth/               # Auth helpers
│   │   └── utils/              # Utility functions
│   ├── hooks/                  # React hooks
│   ├── types/                  # TypeScript types
│   └── middleware.ts           # Auth + i18n middleware
├── messages/                   # Translations (en.json, vi.json)
├── supabase/
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

---

## 📊 Database Schema

**8 Main Tables:**

1. `profiles` - User profiles with roles (user/admin)
2. `clinics` - Dental clinic information
3. `consultations` - Consultation requests
4. `consultation_images` - X-ray uploads
5. `treatment_plans` - Admin-generated quotes
6. `bookings` - Confirmed bookings
7. `reviews` - User reviews with ratings
8. `flagged_reviews` - Review moderation data

**Key Features:**
- Row Level Security (RLS) enabled on all tables
- Foreign key relationships
- Soft deletes (active flags)
- Automatic timestamps
- JSONB for flexible data (services, pricing)

---

## 🔒 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Server-side role checks for admin routes
- ✅ Input validation with Zod schemas
- ✅ SQL injection prevention (Supabase client)
- ✅ XSS prevention (React auto-escaping)
- ✅ File upload validation (types, sizes)
- ✅ HTTPS enforced (production)
- ✅ Environment variables secured

**Recommended Additions:**
- Rate limiting on sensitive endpoints
- CAPTCHA on registration/contact forms
- Email verification enforcement
- 2FA for admin accounts
- Security headers (CSP, HSTS)

---

## 🌐 Internationalization

Full bilingual support:
- **English** - Primary language for international users
- **Vietnamese** - Native language for local clinics and Vietnamese diaspora

Translation keys: 300+ entries covering all UI text, form labels, error messages, and content.

---

## 📈 Performance

**Optimizations:**
- Server Components (reduce client JS)
- Image optimization (Next.js Image)
- Pagination (20 items per page)
- ISR for clinic profiles (1 hour revalidate)
- Lazy loading for images
- Code splitting (automatic via Next.js)

**Recommended:**
- Redis caching
- CDN for static assets
- Database indexes on frequently queried fields
- Lighthouse CI for monitoring

---

## 🚢 Deployment

For complete deployment instructions, see:
- **Deployment Guide:** `/plans/260212-0841-phase-10-deployment/DEPLOYMENT-GUIDE.md`
- **Handoff Checklist:** `/plans/260212-0841-phase-10-deployment/FINAL-HANDOFF-CHECKLIST.md`

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

### Supabase Production Setup

1. Create production project
2. Run database migrations
3. Configure authentication providers
4. Create storage buckets
5. Set up RLS policies

---

## 📚 Documentation

- **Project Summary:** `/docs/PROJECT-SUMMARY.md` - Complete feature list and architecture
- **Deployment Guide:** `/plans/260212-0841-phase-10-deployment/DEPLOYMENT-GUIDE.md`
- **Phase Plans:** `/plans/` - All implementation phase plans
- **Code Standards:** `/docs/code-standards.md` (if exists)

---

## 🧪 Testing

### Manual Testing

Run development server and test critical flows:
1. User registration/login
2. Clinic discovery and search
3. Consultation submission with X-ray upload
4. Admin dashboard access
5. Treatment plan quote creation
6. Booking acceptance and management
7. Review submission

### Automated Testing (Planned)

- E2E tests with Playwright
- Unit tests with Vitest
- Integration tests for server actions

---

## 🎨 UI Components

Built with shadcn/ui (Radix UI + Tailwind CSS):
- Forms (input, textarea, select, checkbox, radio)
- Navigation (sidebar, tabs, breadcrumbs)
- Feedback (toast, alert-dialog, skeleton)
- Data display (card, table, badge, avatar)
- Overlays (dialog, sheet, popover, dropdown)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🆘 Support

**Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

**Community:**
- Next.js Discord
- Supabase Discord
- GitHub Issues

---

## 📊 Project Stats

- **Total Files:** 100+ TypeScript/TSX files
- **Total Lines:** 6,000+ lines of code
- **Components:** 50+ React components
- **Server Actions:** 20+ server action files
- **Pages:** 25+ routes
- **Translations:** 300+ keys (EN + VI)
- **Dependencies:** 30+ npm packages

---

## 🎯 Roadmap

### ✅ Completed (Phases 01-07)
- Landing page and clinic discovery
- Consultation and booking system
- Review and trust features
- Admin dashboard (full CRUD)

### 🔄 In Progress (Phase 10)
- Production deployment preparation
- Documentation finalization

### 📋 Planned (Post-Launch)
- Email notifications (Phase 08.1)
- Loading states and error boundaries (Phase 08.2)
- Automated testing suite (Phase 09)
- Payment integration
- Mobile apps (React Native)
- Advanced search (Elasticsearch)

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Supabase Team** - Excellent BaaS platform
- **shadcn** - Beautiful UI components
- **Radix UI Team** - Accessible primitives
- **Vercel** - Seamless deployment platform

---

**Built with ❤️ for the Vietnamese diaspora community**

**🚀 Ready to connect Viet Kieu with trusted dental care in Vietnam!**

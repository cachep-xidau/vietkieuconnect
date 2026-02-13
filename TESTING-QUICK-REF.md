# Local Testing - Quick Reference

**Status:** TypeScript ✅ 0 errors | Dependencies ⏳ Manual install required

---

## 🚀 Quick Setup (5 minutes)

```bash
# 1. Install dependencies (in your terminal, not Claude Code)
npm install

# 2. Create environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# 3. Start dev server
npm run dev
```

**Open:** http://localhost:3000

---

## 📋 Test Routes

### Public (No Auth)
- `/` - Landing page
- `/en/clinics` - Clinic directory
- `/en/clinics/[slug]` - Clinic profile
- `/en/compare?ids=1,2,3` - Compare clinics

### Auth Required
- `/en/auth/signup` - Sign up
- `/en/auth/signin` - Sign in
- `/en/dashboard` - User dashboard
- `/en/consultations` - My consultations
- `/en/bookings` - My bookings
- `/en/bookings/[id]/review` - Write review

### Admin Only
- `/en/admin` - Admin dashboard
- `/en/admin/clinics` - Clinic management
- `/en/admin/consultations` - Consultation queue
- `/en/admin/bookings` - Booking management
- `/en/admin/reviews` - Review moderation

---

## 🔑 Create Admin User

```sql
-- In Supabase SQL Editor
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

---

## ✅ Critical Test Checklist

- [ ] Landing page loads
- [ ] User can sign up
- [ ] User can sign in
- [ ] User can submit consultation
- [ ] Admin can access admin dashboard
- [ ] Admin can create clinic
- [ ] Admin can create treatment plan quote
- [ ] User can accept quote → booking created
- [ ] User can submit review for completed booking
- [ ] Review appears on clinic profile

---

## 📚 Full Testing Guide

See: `/docs/LOCAL-TESTING-REPORT.md` (549 lines)

---

## 🐛 TypeScript Fixed

**Issue:** pagination.tsx had ButtonProps import error
**Fix:** Changed to `VariantProps<typeof buttonVariants>`
**Status:** ✅ 0 errors

---

## ⚠️ Known Limitations

1. **npm install blocked** - Must run outside Claude Code
2. **Supabase required** - Need credentials in .env.local
3. **Migrations needed** - Run `supabase db push`
4. **Storage bucket** - Create `review-photos` bucket

---

## 🚢 After Testing

If all tests pass → Follow **DEPLOYMENT-GUIDE.md**

---

**Start here:** Run `npm install` then `npm run dev`

# Phase 06 Testing Report

**Test Date:** 2026-02-12 07:52 UTC+7
**Status:** ✅ Build Verified, Ready for Manual Testing
**Dev Server:** Running on http://localhost:3000

## Automated Checks ✅

### TypeScript Compilation
```bash
npx tsc --noEmit
```
**Result:** ✅ PASS (0 errors)

### Route Availability
- `/en` → HTTP 200 ✅
- `/en/clinics` → HTTP 200 ✅
- `/en/bookings` → HTTP 307 ✅ (Auth redirect expected)
- `/en/admin/reviews` → HTTP 307 ✅ (Auth redirect expected)

### Dev Server Status
- ✅ Started successfully
- ✅ Ready in 1521ms
- ✅ No build errors

### Database Migration
- ✅ File exists: `00007_add_review_flagging.sql`
- ⚠️ **Not yet applied** - Manual step required

## Manual Testing Checklist

### Prerequisites Setup

#### 1. Run Database Migration
```bash
cd /Users/lucasbraci/Desktop/Antigravity/projects/vietkieuconnect/app
supabase db push
```

**OR** manually apply:
```bash
psql $DATABASE_URL -f supabase/migrations/00007_add_review_flagging.sql
```

**Verify migration:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'reviews'
AND column_name IN ('flagged', 'flagged_at', 'flagged_by', 'flag_reason');
```

Expected result: 4 rows (flagged, flagged_at, flagged_by, flag_reason)

#### 2. Create Supabase Storage Bucket
**Supabase Dashboard → Storage:**
1. Click "New bucket"
2. Name: `review-photos`
3. Public bucket: ✅ Yes
4. File size limit: 5 MB
5. Allowed MIME types: `image/*`

**Storage Policies:**
```sql
-- Public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

-- Authenticated upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'review-photos');
```

#### 3. Setup Admin User
```sql
-- Get your user ID first
SELECT id, email FROM auth.users LIMIT 5;

-- Set admin role
UPDATE profiles
SET role = 'admin'
WHERE id = '<your-user-id>';

-- Verify
SELECT id, role FROM profiles WHERE role = 'admin';
```

#### 4. Create Test Data (Sample Clinic & Booking)
```sql
-- If you don't have completed bookings, update one:
UPDATE bookings
SET status = 'completed'
WHERE id = '<some-booking-id>';
```

---

## Test Scenarios

### Phase 06.1: Review Submission System

#### Test 1: Submit Review for Completed Booking
**Steps:**
1. Login to app (http://localhost:3000/en/login)
2. Navigate to Dashboard → Bookings
3. Find a completed booking
4. Click "Write Review" button
5. Fill review form:
   - Rating: Select 4-5 stars (click to select)
   - Title: "Excellent dental service"
   - Content: (minimum 50 characters) "The clinic was professional..."
   - Treatment Type: Optional, e.g., "Dental Implants"
   - Photos: Upload 1-3 test images (JPG/PNG, max 5MB each)
6. Click "Submit Review"

**Expected Results:**
- ✅ Form validates before submission
- ✅ Success toast notification appears
- ✅ Redirect to booking detail page
- ✅ "Write Review" button now hidden
- ✅ Review appears on clinic reviews page

**Database Verification:**
```sql
SELECT id, rating, title, content, verified, created_at
FROM reviews
WHERE booking_id = '<booking-id>'
ORDER BY created_at DESC
LIMIT 1;
```
Expected: verified = TRUE

**Storage Verification:**
Check Supabase Storage → `review-photos` bucket → should see uploaded images

#### Test 2: Duplicate Review Prevention
**Steps:**
1. After submitting review in Test 1
2. Navigate back to `/bookings/[id]/review`

**Expected Results:**
- ✅ Redirect to booking detail page OR
- ✅ Error message: "Review already submitted"

#### Test 3: Incomplete Booking Restriction
**Steps:**
1. Find a booking with status != "completed"
2. Try to access `/bookings/[id]/review`

**Expected Results:**
- ✅ Redirect to booking detail OR
- ✅ Error message: "Booking must be completed to submit review"

#### Test 4: Photo Upload Validation
**Steps:**
1. Start review submission
2. Try uploading:
   - File > 5MB → Should reject
   - Non-image file (PDF, TXT) → Should reject
   - More than 5 photos → Should reject

**Expected Results:**
- ✅ Client-side validation shows error messages
- ✅ Invalid files not uploaded

---

### Phase 06.2: Rating Aggregation & Display

#### Test 5: Clinic Rating Auto-Update
**Pre-condition:** Submit 3-5 reviews with different ratings

**Steps:**
1. Note current clinic rating on clinic card
2. Submit new review with rating = 5
3. Refresh clinic directory page (`/clinics`)
4. Check clinic card rating

**Expected Results:**
- ✅ Clinic rating updated to new average
- ✅ Review count incremented

**Database Verification:**
```sql
-- Check clinic rating matches average
SELECT c.id, c.name, c.rating, c.review_count,
       AVG(r.rating) as calculated_avg,
       COUNT(r.id) as calculated_count
FROM clinics c
LEFT JOIN reviews r ON r.clinic_id = c.id
WHERE c.id = '<clinic-id>'
GROUP BY c.id;
```
Expected: `c.rating` = `calculated_avg`, `c.review_count` = `calculated_count`

#### Test 6: Rating Breakdown Display
**Steps:**
1. Navigate to clinic profile (`/clinics/[slug]`)
2. Scroll to rating breakdown section

**Expected Results:**
- ✅ Shows rating breakdown component
- ✅ Displays bars for 5-star to 1-star
- ✅ Shows percentage for each level
- ✅ Shows count (e.g., "5 stars: 45% (18 reviews)")
- ✅ Visual progress bars match percentages

**Manual Calculation Verification:**
```sql
-- Get breakdown
SELECT rating, COUNT(*) as count
FROM reviews
WHERE clinic_id = '<clinic-id>'
GROUP BY rating
ORDER BY rating DESC;
```
Compare with UI display

#### Test 7: Zero Reviews State
**Steps:**
1. Find clinic with 0 reviews
2. Navigate to clinic profile

**Expected Results:**
- ✅ Shows "No reviews yet" message
- ✅ Rating breakdown hidden OR shows 0% for all

---

### Phase 06.3: Admin Review Moderation

#### Test 8: Flag Review as User
**Steps:**
1. Login as regular user (not admin)
2. Navigate to clinic reviews page (`/clinics/[slug]/reviews`)
3. Find a review (not your own)
4. Click flag icon button
5. Select flag reason: "Spam"
6. Confirm

**Expected Results:**
- ✅ Flag dialog opens
- ✅ Reason selection shown (Spam, Inappropriate, Fake)
- ✅ Success toast notification
- ✅ Flag button shows "Flagged" state
- ✅ Cannot flag again (button disabled)

**Database Verification:**
```sql
SELECT id, flagged, flagged_at, flag_reason
FROM reviews
WHERE id = '<review-id>';
```
Expected: flagged = TRUE, flag_reason = 'spam'

#### Test 9: Admin Access Control
**Steps:**
1. Logout
2. Login as non-admin user
3. Try to access `/admin/reviews`

**Expected Results:**
- ✅ Redirect to `/dashboard`

**Steps (Admin):**
1. Login as admin user
2. Access `/admin/reviews`

**Expected Results:**
- ✅ Page loads successfully
- ✅ Shows review list

#### Test 10: Admin Review List & Filters
**Steps:**
1. Access `/admin/reviews` as admin
2. Check stats at top
3. Click "Flagged Only" tab
4. Click "All" tab

**Expected Results:**
- ✅ Stats show: Total reviews, Flagged count, Approved count
- ✅ "Flagged Only" shows only flagged reviews
- ✅ "All" shows all reviews
- ✅ Each row shows: clinic name, user, rating, content preview, flagged badge, actions

#### Test 11: Approve (Unflag) Review
**Steps:**
1. In admin reviews, find flagged review
2. Click "Approve" button
3. Confirm action

**Expected Results:**
- ✅ Success toast notification
- ✅ Review moves from "Flagged" to "All" tab
- ✅ Flagged badge removed

**Database Verification:**
```sql
SELECT id, flagged FROM reviews WHERE id = '<review-id>';
```
Expected: flagged = FALSE

#### Test 12: Delete Single Review
**Steps:**
1. In admin reviews, select a review
2. Click "Delete" button
3. Confirm deletion dialog

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ After confirm, success toast
- ✅ Review removed from list
- ✅ Clinic rating recalculated

**Database Verification:**
```sql
SELECT * FROM reviews WHERE id = '<review-id>';
```
Expected: 0 rows (hard delete)

**Rating Verification:**
```sql
-- Check clinic rating updated after deletion
SELECT rating, review_count FROM clinics WHERE id = '<clinic-id>';
```

#### Test 13: Bulk Delete Reviews
**Steps:**
1. In admin reviews, select 2-3 reviews (checkboxes)
2. Click "Delete Selected" button
3. Confirm bulk deletion

**Expected Results:**
- ✅ Confirmation dialog shows count (e.g., "Delete 3 reviews?")
- ✅ After confirm, all selected reviews deleted
- ✅ Success toast notification
- ✅ Review list updates

**Database Verification:**
```sql
SELECT COUNT(*) FROM reviews WHERE id IN ('<id1>', '<id2>', '<id3>');
```
Expected: 0

---

## Edge Cases & Error Scenarios

### Test 14: Concurrent Review Submissions
**Setup:** Open 2 browser tabs with same booking review form

**Steps:**
1. Tab 1: Fill form, click submit
2. Tab 2: Immediately fill form, click submit

**Expected Results:**
- ✅ First submission succeeds
- ✅ Second submission fails with "Review already submitted"

### Test 15: Large Photo Upload
**Steps:**
1. Try uploading image > 5MB

**Expected Results:**
- ✅ Client-side validation rejects
- ✅ Error message shown

### Test 16: XSS Prevention in Review Content
**Steps:**
1. Submit review with content:
   ```
   <script>alert('XSS')</script>
   <img src=x onerror="alert('XSS')">
   ```

**Expected Results:**
- ✅ Content displayed as plain text (escaped)
- ✅ No script execution

### Test 17: SQL Injection Prevention
**Steps:**
1. Try submitting review with title:
   ```
   '; DROP TABLE reviews; --
   ```

**Expected Results:**
- ✅ Stored as plain text
- ✅ Database not affected

---

## Performance Tests

### Test 18: Rating Calculation Performance
**Setup:** Clinic with 100+ reviews

**Steps:**
1. Submit new review
2. Measure response time

**Expected Results:**
- ✅ Response < 2 seconds
- ✅ No timeout errors

### Test 19: Admin Review List Pagination
**Setup:** 50+ reviews in database

**Steps:**
1. Access `/admin/reviews`
2. Check pagination controls
3. Navigate to page 2, 3

**Expected Results:**
- ✅ Pagination shown
- ✅ Page navigation works
- ✅ Shows correct items per page

---

## Accessibility Tests

### Test 20: Keyboard Navigation
**Steps:**
1. Review submission form
2. Use TAB key to navigate
3. Use ENTER/SPACE to interact

**Expected Results:**
- ✅ Can navigate entire form with keyboard
- ✅ Star rating accessible (arrow keys to select)
- ✅ All buttons focusable

### Test 21: Screen Reader Compatibility
**Steps:**
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate review form

**Expected Results:**
- ✅ Form labels announced
- ✅ Star rating state announced
- ✅ Error messages announced

---

## Mobile Responsive Tests

### Test 22: Mobile Layout
**Steps:**
1. Open DevTools
2. Toggle device toolbar (iPhone 12)
3. Navigate through review flow

**Expected Results:**
- ✅ Review form responsive
- ✅ Star rating touch-friendly
- ✅ Photo uploader works on mobile
- ✅ Admin table scrollable/responsive

---

## Summary Checklist

**Phase 06.1: Review Submission**
- [ ] Submit review successfully
- [ ] Duplicate prevention works
- [ ] Booking completion check works
- [ ] Photo upload validation works
- [ ] Photos stored in Supabase

**Phase 06.2: Rating Aggregation**
- [ ] Clinic rating auto-updates
- [ ] Review count accurate
- [ ] Rating breakdown displays
- [ ] Zero reviews handled gracefully
- [ ] Calculations correct

**Phase 06.3: Admin Moderation**
- [ ] Users can flag reviews
- [ ] Admin access control works
- [ ] Review list displays correctly
- [ ] Approve/unflag works
- [ ] Delete single review works
- [ ] Bulk delete works
- [ ] Non-admin redirect works

**Security**
- [ ] XSS prevention verified
- [ ] SQL injection prevented
- [ ] File upload validation works
- [ ] Admin role check enforced

**Performance**
- [ ] Review submission < 2s
- [ ] Rating calculation fast
- [ ] Admin list loads quickly

**Accessibility**
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

**Responsive**
- [ ] Mobile layout works
- [ ] Touch interactions work

---

## Known Issues / Limitations

**Currently None** - All features implemented as specified

---

## Next Actions

1. **Complete Prerequisites:**
   - Run database migration
   - Create Supabase storage bucket
   - Setup admin user

2. **Execute Manual Tests:**
   - Follow test scenarios above
   - Document any issues found

3. **Fix Any Bugs:**
   - Report issues to development
   - Prioritize critical bugs

4. **Ready for Phase 07:**
   - Once Phase 06 tests pass
   - Proceed to Admin Dashboard implementation

---

**Test Status:** ⏳ PENDING MANUAL EXECUTION
**Build Status:** ✅ READY
**Next Step:** Run database migration and execute test scenarios

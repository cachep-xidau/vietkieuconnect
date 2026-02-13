-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());

-- CLINICS (public read for active)
CREATE POLICY "Anyone can view active clinics" ON clinics FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage clinics" ON clinics FOR ALL USING (is_admin());

-- CONSULTATION REQUESTS
CREATE POLICY "Users can view own consultations" ON consultation_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create consultations" ON consultation_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own consultations" ON consultation_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all consultations" ON consultation_requests FOR SELECT USING (is_admin());

-- CONSULTATION IMAGES
CREATE POLICY "Users can view own consultation images" ON consultation_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM consultation_requests WHERE id = consultation_images.consultation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can add images to own consultations" ON consultation_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM consultation_requests WHERE id = consultation_images.consultation_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all images" ON consultation_images FOR SELECT USING (is_admin());

-- TREATMENT PLANS
CREATE POLICY "Users can view own treatment plans" ON treatment_plans FOR SELECT USING (
  EXISTS (SELECT 1 FROM consultation_requests WHERE id = treatment_plans.consultation_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage treatment plans" ON treatment_plans FOR ALL USING (is_admin());

-- BOOKINGS
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all bookings" ON bookings FOR ALL USING (is_admin());

-- REVIEWS
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON reviews FOR ALL USING (is_admin());

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON notifications FOR ALL USING (is_admin());

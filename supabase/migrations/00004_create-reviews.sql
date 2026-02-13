CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  clinic_id UUID REFERENCES clinics(id) NOT NULL,
  booking_id UUID REFERENCES bookings(id) UNIQUE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  treatment_type TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged', 'removed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update clinic rating/review_count on review changes
CREATE OR REPLACE FUNCTION update_clinic_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE clinics SET
      rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE clinic_id = OLD.clinic_id AND status = 'approved'), 0),
      review_count = (SELECT COUNT(*) FROM reviews WHERE clinic_id = OLD.clinic_id AND status = 'approved')
    WHERE id = OLD.clinic_id;
    RETURN OLD;
  ELSE
    UPDATE clinics SET
      rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE clinic_id = NEW.clinic_id AND status = 'approved'), 0),
      review_count = (SELECT COUNT(*) FROM reviews WHERE clinic_id = NEW.clinic_id AND status = 'approved')
    WHERE id = NEW.clinic_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clinic_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_clinic_rating();

CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description_en TEXT,
  description_vi TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  services JSONB DEFAULT '[]'::jsonb,
  pricing JSONB DEFAULT '{}'::jsonb,
  rating NUMERIC(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INT DEFAULT 0,
  photos TEXT[] DEFAULT '{}',
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clinics_city ON clinics(city);
CREATE INDEX idx_clinics_verified ON clinics(verified);
CREATE INDEX idx_clinics_active ON clinics(active);

CREATE TRIGGER set_clinics_updated_at
  BEFORE UPDATE ON clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

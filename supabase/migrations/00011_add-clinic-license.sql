-- Add license and medical director columns to clinics table
ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS license_number TEXT,
  ADD COLUMN IF NOT EXISTS license_authority TEXT,
  ADD COLUMN IF NOT EXISTS license_expiry DATE,
  ADD COLUMN IF NOT EXISTS medical_director TEXT,
  ADD COLUMN IF NOT EXISTS medical_director_license TEXT;

COMMENT ON COLUMN clinics.license_number IS 'CCHN / business license number';
COMMENT ON COLUMN clinics.license_authority IS 'Issuing authority, e.g. Sở Y tế Đồng Nai';
COMMENT ON COLUMN clinics.license_expiry IS 'License expiry date';
COMMENT ON COLUMN clinics.medical_director IS 'Name of the medical director';
COMMENT ON COLUMN clinics.medical_director_license IS 'CCHN of the medical director';

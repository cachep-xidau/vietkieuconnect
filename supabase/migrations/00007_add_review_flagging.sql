-- Add flagging columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS flagged_at TIMESTAMPTZ;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS flagged_by UUID REFERENCES auth.users(id);
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS flag_reason TEXT;

-- Create index for fast filtering of flagged reviews
CREATE INDEX IF NOT EXISTS idx_reviews_flagged ON reviews(flagged) WHERE flagged = TRUE;

-- Create index for clinic_id + flagged for admin filtering
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_flagged ON reviews(clinic_id, flagged);

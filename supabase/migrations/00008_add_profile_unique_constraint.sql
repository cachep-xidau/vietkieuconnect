-- Migration: Add UNIQUE constraint on profiles.id
-- Purpose: Prevent race condition duplicate profiles at database level
-- Date: 2026-02-12
-- Priority: P0 (Security Fix)

-- profiles.id references auth.users(id) which is already unique via PK,
-- but adding an explicit unique constraint ensures ON CONFLICT (id) works
-- in application-level upserts without relying on the FK relationship.

CREATE UNIQUE INDEX IF NOT EXISTS profiles_id_unique_idx ON profiles(id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_unique'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_id_unique UNIQUE USING INDEX profiles_id_unique_idx;
  END IF;
END $$;

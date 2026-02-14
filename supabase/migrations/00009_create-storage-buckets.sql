-- =============================================
-- Migration: Create Storage Buckets + Policies
-- =============================================
-- This creates the Supabase Storage buckets used
-- by the application for image uploads.
--
-- NOTE: Run this via Supabase SQL Editor on the
-- remote project. Storage bucket creation via SQL
-- uses the storage schema.
-- =============================================

-- 1. Create consultation-images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'consultation-images',
  'consultation-images',
  true,
  20971520, -- 20MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create review-photos bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  20971520, -- 20MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Storage RLS Policies: consultation-images
-- =============================================

-- Anyone can view consultation images (public bucket)
CREATE POLICY "Public read consultation images"
ON storage.objects FOR SELECT
USING (bucket_id = 'consultation-images');

-- Authenticated users can upload consultation images
CREATE POLICY "Authenticated upload consultation images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'consultation-images');

-- Users can delete their own uploads
CREATE POLICY "Users delete own consultation images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'consultation-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =============================================
-- Storage RLS Policies: review-photos
-- =============================================

-- Anyone can view review photos (public bucket)
CREATE POLICY "Public read review photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-photos');

-- Authenticated users can upload review photos
CREATE POLICY "Authenticated upload review photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'review-photos');

-- Users can delete their own review photos
CREATE POLICY "Users delete own review photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'review-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

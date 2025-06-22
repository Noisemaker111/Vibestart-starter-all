-- Add author tracking fields to ideas table
ALTER TABLE "ideas"
  ADD COLUMN IF NOT EXISTS "user_id" uuid,
  ADD COLUMN IF NOT EXISTS "author_name" text,
  ADD COLUMN IF NOT EXISTS "author_avatar_url" text; 
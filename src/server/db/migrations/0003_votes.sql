-- Add score column to ideas
ALTER TABLE "ideas" ADD COLUMN IF NOT EXISTS "score" integer NOT NULL DEFAULT 0;

-- Create idea_votes table
CREATE TABLE IF NOT EXISTS "idea_votes" (
  "id" serial PRIMARY KEY NOT NULL,
  "idea_id" integer NOT NULL REFERENCES "ideas"(id) ON DELETE CASCADE,
  "user_id" uuid NOT NULL,
  "value" smallint NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  UNIQUE (idea_id, user_id)
); 
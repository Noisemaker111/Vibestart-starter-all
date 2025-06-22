CREATE TABLE "instruments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

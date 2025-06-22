CREATE TABLE "ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"occupation" text,
	"state" text,
	"country" text,
	"level" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "instruments" CASCADE;
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pgTable, text, timestamp, integer, bigint, serial, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Load environment variables (supports .env, .env.local, etc.)
config();

// Support both server-side (process.env) and Vite-exposed (import.meta.env) variables
const DATABASE_URL = (import.meta as any).env?.VITE_DATABASE_URL ?? process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please define DATABASE_URL in your .env file or VITE_DATABASE_URL for Vite."
  );
}

const client = postgres(DATABASE_URL);
export const db = drizzle({ client });

// ────────────────────────────────────────────────────────────────────────────────
// Table definitions
// ────────────────────────────────────────────────────────────────────────────────

export const rateLimitsTable = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  requests: integer("requests").notNull().default(0),
  reset_time: bigint("reset_time", { mode: "number" }).notNull(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
export type InsertRateLimit = typeof rateLimitsTable.$inferInsert;
export type SelectRateLimit = typeof rateLimitsTable.$inferSelect;

export const animalsTable = pgTable("animals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  owner_token: text("owner_token").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
export type InsertAnimal = typeof animalsTable.$inferInsert;
export type SelectAnimal = typeof animalsTable.$inferSelect;

export const uploadsTable = pgTable("uploads", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  key: text("key").notNull(),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  owner_token: text("owner_token").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
export type InsertUpload = typeof uploadsTable.$inferInsert;
export type SelectUpload = typeof uploadsTable.$inferSelect;

export const organizationsTable = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  owner_id: text("owner_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
export type InsertOrganization = typeof organizationsTable.$inferInsert;
export type SelectOrganization = typeof organizationsTable.$inferSelect;

export const profilesTable = pgTable("profiles", {
  user_id: uuid("user_id").primaryKey(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow(),
});
export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;

// ────────────────────────────────────────────────────────────────────────────────
// Zod schemas generated from Drizzle definitions (reuse across API handlers)
// ────────────────────────────────────────────────────────────────────────────────

export const rateLimitInsertSchema = createInsertSchema(rateLimitsTable);
export const rateLimitSelectSchema = createSelectSchema(rateLimitsTable);

export const animalInsertSchema = createInsertSchema(animalsTable);
export const animalSelectSchema = createSelectSchema(animalsTable);

export const uploadInsertSchema = createInsertSchema(uploadsTable);
export const uploadSelectSchema = createSelectSchema(uploadsTable);

export const organizationInsertSchema = createInsertSchema(organizationsTable);
export const organizationSelectSchema = createSelectSchema(organizationsTable);

export const profileInsertSchema = createInsertSchema(profilesTable);
export const profileSelectSchema = createSelectSchema(profilesTable); 
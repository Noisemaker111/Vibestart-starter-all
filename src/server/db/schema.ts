import { pgTable, text, timestamp, integer, bigint, serial, uuid } from 'drizzle-orm/pg-core';

// Rate limits table for unified rate limiting
export const rateLimitsTable = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  requests: integer('requests').notNull().default(0),
  reset_time: bigint('reset_time', { mode: 'number' }).notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type InsertRateLimit = typeof rateLimitsTable.$inferInsert;
export type SelectRateLimit = typeof rateLimitsTable.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// Animals demo table (used by Test utilities)
// ─────────────────────────────────────────────────────────────────────────────

export const animalsTable = pgTable('animals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  owner_token: text('owner_token').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertAnimal = typeof animalsTable.$inferInsert;
export type SelectAnimal = typeof animalsTable.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// Uploaded files table (images uploaded via UploadThing)
// ─────────────────────────────────────────────────────────────────────────────

export const uploadsTable = pgTable('uploads', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  key: text('key').notNull(),
  name: text('name').notNull(),
  size: integer('size').notNull(),
  owner_token: text('owner_token').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertUpload = typeof uploadsTable.$inferInsert;
export type SelectUpload = typeof uploadsTable.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// Organizations table (user-created organizations)
// ─────────────────────────────────────────────────────────────────────────────

export const organizationsTable = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  owner_id: text('owner_id').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertOrganization = typeof organizationsTable.$inferInsert;
export type SelectOrganization = typeof organizationsTable.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// User profile table (additional data linked to auth.users)
// ─────────────────────────────────────────────────────────────────────────────

export const profilesTable = pgTable('profiles', {
  user_id: uuid('user_id').primaryKey(), // references auth.users.id
  full_name: text('full_name'),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow(),
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect; 
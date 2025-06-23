import { pgTable, text, timestamp, integer, bigint, serial } from 'drizzle-orm/pg-core';

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
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertAnimal = typeof animalsTable.$inferInsert;
export type SelectAnimal = typeof animalsTable.$inferSelect; 
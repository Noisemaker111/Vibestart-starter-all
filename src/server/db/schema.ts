import { pgTable, text, timestamp, integer, bigint } from 'drizzle-orm/pg-core';

// Rate limits table for unified rate limiting
export const rateLimitsTable = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  requests: integer('requests').notNull().default(0),
  reset_time: bigint('reset_time', { mode: 'number' }).notNull(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});

export type InsertRateLimit = typeof rateLimitsTable.$inferInsert;
export type SelectRateLimit = typeof rateLimitsTable.$inferSelect; 
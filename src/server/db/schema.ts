import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Add waitlist table
export const waitlistTable = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  company: text('company'),
  occupation: text('occupation'),
  state: text('state'),
  country: text('country'),
  level: text('level').notNull(), // college_grad | intern | junior | senior
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertWaitlist = typeof waitlistTable.$inferInsert;
export type SelectWaitlist = typeof waitlistTable.$inferSelect;

// Add ideas table
export const ideasTable = pgTable('ideas', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  user_id: uuid('user_id'),
  author_name: text('author_name'),
  author_avatar_url: text('author_avatar_url'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});

export type InsertIdea = typeof ideasTable.$inferInsert;
export type SelectIdea = typeof ideasTable.$inferSelect; 
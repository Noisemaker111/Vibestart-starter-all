import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const instrumentsTable = pgTable('instruments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  image_url: text('image_url'),
  user_id: uuid('user_id').notNull(), // References auth.users(id) in Supabase
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Type inference for TypeScript
export type InsertInstrument = typeof instrumentsTable.$inferInsert;
export type SelectInstrument = typeof instrumentsTable.$inferSelect;

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
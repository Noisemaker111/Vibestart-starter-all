import { db } from '../index';
import { waitlistTable } from '../schema';
import type { InsertWaitlist, SelectWaitlist } from '../schema';

export async function createWaitlistEntry(data: InsertWaitlist): Promise<SelectWaitlist[]> {
  return db.insert(waitlistTable).values(data).returning();
} 
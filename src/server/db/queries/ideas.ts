import { db } from '../index';
import { ideasTable } from '../schema';
import type { InsertIdea, SelectIdea } from '../schema';
import { desc } from 'drizzle-orm';

export async function createIdea(data: InsertIdea): Promise<SelectIdea> {
  const [created] = await db.insert(ideasTable).values(data).returning();
  return created;
}

export async function listIdeas(): Promise<SelectIdea[]> {
  return db.select().from(ideasTable).orderBy(desc(ideasTable.created_at));
} 
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../index';
import { instrumentsTable } from '../schema';
import type { InsertInstrument, SelectInstrument } from '../schema';

// Get all instruments for a user
export async function getInstrumentsByUserId(userId: string): Promise<SelectInstrument[]> {
  return db
    .select()
    .from(instrumentsTable)
    .where(eq(instrumentsTable.user_id, userId))
    .orderBy(desc(instrumentsTable.created_at));
}

// Get a single instrument by ID and user
export async function getInstrumentById(id: number, userId: string): Promise<SelectInstrument | undefined> {
  const result = await db
    .select()
    .from(instrumentsTable)
    .where(and(eq(instrumentsTable.id, id), eq(instrumentsTable.user_id, userId)))
    .limit(1);
  
  return result[0];
}

// Create a new instrument
export async function createInstrument(data: InsertInstrument): Promise<SelectInstrument[]> {
  return db.insert(instrumentsTable).values(data).returning();
}

// Update an instrument
export async function updateInstrument(
  id: number, 
  userId: string, 
  data: Partial<Omit<InsertInstrument, 'id' | 'user_id'>>
): Promise<SelectInstrument[]> {
  return db
    .update(instrumentsTable)
    .set({ ...data, updated_at: new Date() })
    .where(and(eq(instrumentsTable.id, id), eq(instrumentsTable.user_id, userId)))
    .returning();
}

// Delete an instrument
export async function deleteInstrument(id: number, userId: string): Promise<SelectInstrument[]> {
  return db
    .delete(instrumentsTable)
    .where(and(eq(instrumentsTable.id, id), eq(instrumentsTable.user_id, userId)))
    .returning();
} 
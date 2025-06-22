import { db } from '../index';
import { ideaVotesTable, ideasTable } from '../schema';
import type { InsertIdeaVote } from '../schema';
import { sql } from 'drizzle-orm';

export async function upsertIdeaVote(ideaId: number, userId: string, value: 1 | -1 | 0) {
  // Upsert pattern: try update, if 0 rows inserted then insert
  const score = await db.transaction(async (tx) => {
    if (value === 0) {
      await tx.delete(ideaVotesTable).where(sql`${ideaVotesTable.idea_id} = ${ideaId} AND ${ideaVotesTable.user_id} = ${userId}`);
    } else {
      const existing = await tx
        .select({ value: ideaVotesTable.value })
        .from(ideaVotesTable)
        .where(sql`${ideaVotesTable.idea_id} = ${ideaId} AND ${ideaVotesTable.user_id} = ${userId}`);

      if (existing.length === 0) {
        await tx.insert(ideaVotesTable).values({ idea_id: ideaId, user_id: userId, value } as InsertIdeaVote);
      } else {
        await tx
          .update(ideaVotesTable)
          .set({ value })
          .where(sql`${ideaVotesTable.idea_id} = ${ideaId} AND ${ideaVotesTable.user_id} = ${userId}`);
      }
    }

    // Recalc score
    const sumRes = await tx
      .select({ score: sql<number>`COALESCE(SUM(${ideaVotesTable.value}), 0)` })
      .from(ideaVotesTable)
      .where(sql`${ideaVotesTable.idea_id} = ${ideaId}`);
    const newScore = Number(sumRes[0]?.score ?? 0);

    await tx.update(ideasTable).set({ score: newScore }).where(sql`${ideasTable.id} = ${ideaId}`);

    return newScore;
  });
  return score;
}

export async function getUserVote(ideaId: number, userId: string) {
  const result = await db
    .select({ value: ideaVotesTable.value })
    .from(ideaVotesTable)
    .where(sql`${ideaVotesTable.idea_id} = ${ideaId} AND ${ideaVotesTable.user_id} = ${userId}`);
  return result[0]?.value ?? 0;
}

export async function getIdeaScore(ideaId: number) {
  const sumRes = await db
    .select({ score: sql<number>`COALESCE(SUM(${ideaVotesTable.value}), 0)` })
    .from(ideaVotesTable)
    .where(sql`${ideaVotesTable.idea_id} = ${ideaId}`);
  return Number(sumRes[0]?.score ?? 0);
} 
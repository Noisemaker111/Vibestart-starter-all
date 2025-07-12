import { db, imageCreditsTable, imageGenerationsTable } from "@server/integrations/database";
import { eq } from "drizzle-orm";

export async function getCredits(ownerToken: string): Promise<number> {
  const rows = await db
    .select()
    .from(imageCreditsTable)
    .where(eq(imageCreditsTable.owner_token, ownerToken))
    .limit(1);
  return rows[0]?.credits_available ?? 0;
}

export async function debitCreditsAndLogGenerations(
  ownerToken: string,
  prompt: string,
  urls: string[],
  unlimited: boolean
): Promise<void> {
  if (urls.length === 0 && unlimited) return;

  await db.transaction(async (tx) => {
    if (!unlimited) {
      const currentRow = await tx
        .select()
        .from(imageCreditsTable)
        .where(eq(imageCreditsTable.owner_token, ownerToken))
        .limit(1);

      const currentCredits = currentRow[0]?.credits_available ?? 0;
      const newCredits = currentCredits - urls.length;

      if (currentRow.length === 0) {
        await tx.insert(imageCreditsTable).values({
          owner_token: ownerToken,
          credits_available: newCredits,
        });
      } else {
        await tx
          .update(imageCreditsTable)
          .set({ credits_available: newCredits })
          .where(eq(imageCreditsTable.owner_token, ownerToken));
      }
    }

    if (urls.length > 0) {
      const insertValues = urls.map((u) => ({
        url: u,
        prompt,
        owner_token: ownerToken,
      }));
      await tx.insert(imageGenerationsTable).values(insertValues);
    }
  });
} 
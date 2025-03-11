import { eq } from "drizzle-orm";

import { db } from "~/db";
import { moneyTable } from "~/db/_schema";

export async function dbCreateEventPayment(
  eventId: number,
  amount: number,
  currency: string,
) {
  await db.insert(moneyTable).values({
    historyEntryId: eventId,
    amount,
    currency,
  });
}

export async function dbUpdateEventPayment(
  eventId: number,
  amount: number,
  currency: string,
) {
  await db
    .update(moneyTable)
    .set({
      amount,
      currency,
    })
    .where(eq(moneyTable.historyEntryId, eventId));
}

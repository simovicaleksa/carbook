import { eq } from "drizzle-orm";

import { db } from "~/db";
import { moneyTable } from "~/db/_schema";

import { type DbOptions } from "./types";

export async function createPaymentForHistoryEvent(
  eventId: number,
  amount: number,
  currency: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  await client.insert(moneyTable).values({
    historyEntryId: eventId,
    amount,
    currency,
  });
}

export async function updatePaymentForHistoryEvent(
  eventId: number,
  amount: number,
  currency: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  await client
    .update(moneyTable)
    .set({
      amount,
      currency,
    })
    .where(eq(moneyTable.historyEntryId, eventId));
}

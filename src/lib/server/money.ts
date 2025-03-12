import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { eq } from "drizzle-orm";

import { db } from "~/db";
import { historyTable, moneyTable } from "~/db/_schema";

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

export async function dbGetVehicleTransactions(vehicleId: string) {
  "use cache";
  cacheTag(`vehicle-${vehicleId}-events`);

  const eventsWithTransactions = await db.query.historyTable.findMany({
    where: eq(historyTable.vehicleId, vehicleId),
    columns: {
      type: true,
    },
    with: {
      cost: {
        columns: {
          currency: true,
          amount: true,
        },
      },
    },
  });

  return eventsWithTransactions;
}

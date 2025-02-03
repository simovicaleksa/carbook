import { desc, eq } from "drizzle-orm";

import { type addHistoryEventSchema } from "~/app/actions/history-validators";

import { db } from "~/db";
import { historyTable } from "~/db/_schema";

export async function createHistoryEvent(
  vehicleId: string,
  newEvent: Zod.infer<typeof addHistoryEventSchema>,
) {
  await db.insert(historyTable).values({
    ...newEvent,
    vehicleId,
  });
}

export async function getHistoryEvents(vehicleId: string) {
  return await db.query.historyTable.findMany({
    where: eq(historyTable.vehicleId, vehicleId),
    orderBy: desc(historyTable.date),
    limit: 20,
  });
}

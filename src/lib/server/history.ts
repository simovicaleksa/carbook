import { desc, eq } from "drizzle-orm";

import { type addHistoryEventSchema } from "~/app/actions/history-validators";

import { db } from "~/db";
import { historyTable } from "~/db/_schema";

export async function createHistoryEvent(
  vehicleId: string,
  newEvent: Zod.infer<typeof addHistoryEventSchema>,
) {
  const [insertedEvent] = await db
    .insert(historyTable)
    .values({
      ...newEvent,
      vehicleId,
    })
    .returning();

  return insertedEvent;
}

export async function getHistoryEvents(vehicleId: string) {
  return await db.query.historyTable.findMany({
    where: eq(historyTable.vehicleId, vehicleId),
    with: {
      cost: true,
    },
    orderBy: desc(historyTable.date),
    limit: 20,
  });
}

export async function updateHistoryEvent(
  eventId: number,
  event: Partial<typeof historyTable.$inferInsert>,
) {
  await db.update(historyTable).set(event).where(eq(historyTable.id, eventId));

  const updatedEvent = await db.query.historyTable.findFirst({
    where: eq(historyTable.id, eventId),
    with: {
      cost: true,
    },
  });

  return updatedEvent;
}

export async function deleteHistoryEvent(eventId: number) {
  await db.delete(historyTable).where(eq(historyTable.id, eventId));
}

export async function getLatestHistoryEvent(vehicleId: string) {
  const event = await db.query.historyTable.findFirst({
    where: eq(historyTable.vehicleId, vehicleId),
    orderBy: desc(historyTable.atDistanceTraveled),
  });

  return event;
}

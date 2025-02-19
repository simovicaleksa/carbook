import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

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

  revalidateTag(`vehicle-${vehicleId}-events`);
  revalidateTag(`vehicle-${vehicleId}-latest-event`);

  return insertedEvent;
}

export async function getHistoryEvents(
  vehicleId: string,
  page = 1,
  perPage = 20,
) {
  "use cache";
  cacheTag(
    `vehicle-${vehicleId}-events`,
    `vehicle-${vehicleId}-events-page-${page}-perPage-${perPage}`,
  );

  return await db.query.historyTable.findMany({
    where: eq(historyTable.vehicleId, vehicleId),
    with: {
      cost: true,
    },
    orderBy: desc(historyTable.date),
    limit: perPage,
    offset: (page - 1) * perPage,
  });
}

export async function getHistoryEventsCount(vehicleId: string) {
  "use cache";
  cacheTag(`vehicle-${vehicleId}-events`);
  return await db.$count(historyTable, eq(historyTable.vehicleId, vehicleId));
}

export async function updateHistoryEvent(
  eventId: number,
  event: Partial<typeof historyTable.$inferInsert>,
) {
  await db.update(historyTable).set(event).where(eq(historyTable.id, eventId));

  revalidateTag(`vehicle-${event.vehicleId}-events`);
  revalidateTag(`vehicle-${event.vehicleId}-latest-event`);

  const updatedEvent = await db.query.historyTable.findFirst({
    where: eq(historyTable.id, eventId),
    with: {
      cost: true,
    },
  });

  return updatedEvent;
}

export async function deleteHistoryEvent(eventId: number) {
  const [deletedEvent] = await db
    .delete(historyTable)
    .where(eq(historyTable.id, eventId))
    .returning();

  if (deletedEvent) {
    revalidateTag(`vehicle-${deletedEvent.vehicleId}-events`);
    revalidateTag(`vehicle-${deletedEvent.vehicleId}-latest-event`);
  }

  return deletedEvent;
}

export async function getLatestHistoryEvent(vehicleId: string) {
  "use cache";
  cacheTag(`vehicle-${vehicleId}-latest-event`);
  const event = await db.query.historyTable.findFirst({
    where: eq(historyTable.vehicleId, vehicleId),
    orderBy: desc(historyTable.atDistanceTraveled),
  });

  return event;
}

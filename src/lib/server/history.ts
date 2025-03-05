import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "~/db";
import { historyTable } from "~/db/_schema";

import { type addHistoryEventSchema } from "~/lib/validators/history-validators";

import { type HistoryEntryType } from "~/types/history";

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
  perPage = 10,
  sortBy: "newest" | "oldest" = "newest",
  filterType: HistoryEntryType | "all" = "all",
) {
  "use cache";
  cacheTag(
    `vehicle-${vehicleId}-events`,
    // `vehicle-${vehicleId}-events-page-${page}-perPage-${perPage}`,
  );

  const where =
    filterType === "all"
      ? eq(historyTable.vehicleId, vehicleId)
      : and(
          eq(historyTable.vehicleId, vehicleId),
          eq(historyTable.type, filterType),
        );

  const orderBy =
    sortBy === "oldest" ? asc(historyTable.date) : desc(historyTable.date);

  return await db.query.historyTable.findMany({
    where,
    with: {
      cost: true,
    },
    orderBy,
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

  const updatedEvent = await db.query.historyTable.findFirst({
    where: eq(historyTable.id, eventId),
    with: {
      cost: true,
    },
  });

  revalidateTag(`vehicle-${event.vehicleId}-events`);
  revalidateTag(`vehicle-${event.vehicleId}-latest-event`);

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

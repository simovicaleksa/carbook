import { desc, eq } from "drizzle-orm";

import { type addHistoryEventSchema } from "~/app/actions/history-validators";

import { db } from "~/db";
import { historyTable } from "~/db/_schema";

import { type DbOptions } from "./types";

export async function createHistoryEvent(
  vehicleId: string,
  newEvent: Zod.infer<typeof addHistoryEventSchema>,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const [insertedEvent] = await client
    .insert(historyTable)
    .values({
      ...newEvent,
      vehicleId,
    })
    .returning();

  return insertedEvent;
}

export async function getHistoryEvents(
  vehicleId: string,
  page = 1,
  perPage = 20,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  return await client.query.historyTable.findMany({
    where: eq(historyTable.vehicleId, vehicleId),
    with: {
      cost: true,
    },
    orderBy: desc(historyTable.date),
    limit: perPage,
    offset: (page - 1) * perPage,
  });
}

export async function getHistoryEventsCount(
  vehicleId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  return await client.$count(
    historyTable,
    eq(historyTable.vehicleId, vehicleId),
  );
}

export async function updateHistoryEvent(
  eventId: number,
  event: Partial<typeof historyTable.$inferInsert>,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  await client
    .update(historyTable)
    .set(event)
    .where(eq(historyTable.id, eventId));

  const updatedEvent = await client.query.historyTable.findFirst({
    where: eq(historyTable.id, eventId),
    with: {
      cost: true,
    },
  });

  return updatedEvent;
}

export async function deleteHistoryEvent(
  eventId: number,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  await client.delete(historyTable).where(eq(historyTable.id, eventId));
}

export async function getLatestHistoryEvent(
  vehicleId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const event = await client.query.historyTable.findFirst({
    where: eq(historyTable.vehicleId, vehicleId),
    orderBy: desc(historyTable.atDistanceTraveled),
  });

  return event;
}

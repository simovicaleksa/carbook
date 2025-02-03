"use server";

import { and, desc, eq, gt, lt } from "drizzle-orm";
import { ZodError, type z } from "zod";

import { addHistoryEventSchema } from "~/app/actions/history-validators";

import { db } from "~/db";
import { historyTable, vehicleTable } from "~/db/_schema";

import { AuthorizationError, authorize } from "~/lib/server/authorize";
import {
  createHistoryEvent,
  getHistoryEvents,
  updateHistoryEvent,
} from "~/lib/server/history";

import { type EventType } from "~/context/events-context";

export async function createUserHistoryEvent(
  vehicleId: string,
  newEvent: z.infer<typeof addHistoryEventSchema>,
) {
  try {
    await authorize(async (user) => {
      const vehicle = await db.query.vehicleTable.findFirst({
        where: and(
          eq(vehicleTable.id, vehicleId),
          eq(vehicleTable.ownerId, user.id),
        ),
      });

      if (!vehicle) return false;

      return true;
    });

    addHistoryEventSchema.parse(newEvent);

    // Check for preceding events with higher distance traveled
    const precedingConflict = await db
      .select()
      .from(historyTable)
      .where(
        and(
          eq(historyTable.vehicleId, vehicleId),
          lt(historyTable.date, newEvent.date),
          gt(historyTable.atDistanceTraveled, newEvent.atDistanceTraveled),
        ),
      )
      .limit(1);

    if (precedingConflict.length > 0) {
      return {
        ok: false,
        status: 400,
        error: new Error("Older entry with higher distance traveled exists"),
      };
    }

    // Check for upcoming events with lower distance traveled
    const upcomingConflict = await db
      .select()
      .from(historyTable)
      .where(
        and(
          eq(historyTable.vehicleId, vehicleId),
          gt(historyTable.date, newEvent.date),
          lt(historyTable.atDistanceTraveled, newEvent.atDistanceTraveled),
        ),
      )
      .limit(1);

    if (upcomingConflict.length > 0) {
      return {
        ok: false,
        status: 400,
        error: new Error("Newer entry with lower distance traveled exists"),
      };
    }

    const latestEvent = await db.query.historyTable.findFirst({
      orderBy: desc(historyTable.atDistanceTraveled),
      where: and(eq(historyTable.vehicleId, vehicleId)),
    });

    // update current vehicle distanceTraveled
    if (
      !latestEvent ||
      latestEvent.atDistanceTraveled < newEvent.atDistanceTraveled
    ) {
      await db
        .update(vehicleTable)
        .set({
          distanceTraveled: newEvent.atDistanceTraveled,
        })
        .where(eq(vehicleTable.id, vehicleId));
    }

    await createHistoryEvent(vehicleId, newEvent);

    return {
      ok: true,
      status: 200,
    };
  } catch (error) {
    if (error instanceof AuthorizationError)
      return {
        ok: false,
        status: 401,
        error: error,
      };
    if (error instanceof ZodError)
      return {
        ok: false,
        status: 400,
        error: error,
      };
    return {
      ok: false,
      status: 500,
      error: error as Error,
    };
  }
}

export async function getVehicleHistoryEvents(vehicleId: string) {
  try {
    await authorize(async (user) => {
      const vehicle = await db.query.vehicleTable.findFirst({
        where: eq(vehicleTable.id, vehicleId),
      });

      if (vehicle?.ownerId !== user.id) return false;

      return true;
    });

    const events = await getHistoryEvents(vehicleId);

    return {
      ok: true,
      status: 200,
      data: events,
    };
  } catch (error) {
    if (error instanceof AuthorizationError)
      return {
        ok: false,
        status: 401,
        error: error,
      };
    return {
      ok: false,
      status: 500,
      error: error as Error,
    };
  }
}

export async function updateVehicleHistoryEvent(
  eventId: number,
  newEvent: Partial<EventType>,
) {
  try {
    addHistoryEventSchema.partial().parse(newEvent);

    await authorize(async (user) => {
      const event = await db.query.historyTable.findFirst({
        where: eq(historyTable.id, eventId),
        with: {
          vehicle: true,
        },
      });

      if (event?.vehicle.ownerId !== user.id) return false;

      return true;
    });

    await updateHistoryEvent(eventId, newEvent);

    return {
      ok: true,
      status: 200,
      data: newEvent,
    };
  } catch (error) {
    if (error instanceof AuthorizationError)
      return {
        ok: false,
        status: 401,
        error: error,
      };
    if (error instanceof ZodError)
      return {
        ok: false,
        status: 400,
        error: error,
      };
    return {
      ok: false,
      status: 500,
      error: error as Error,
    };
  }
}

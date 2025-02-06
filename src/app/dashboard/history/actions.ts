"use server";

import { and, desc, eq, gt, lt } from "drizzle-orm";
import { type z } from "zod";

import { addHistoryEventSchema } from "~/app/actions/history-validators";

import { db } from "~/db";
import { historyTable, vehicleTable } from "~/db/_schema";

import { authorize } from "~/lib/server/authorize";
import {
  createHistoryEvent,
  deleteHistoryEvent,
  getHistoryEvents,
  updateHistoryEvent,
} from "~/lib/server/history";
import { NotFoundError, UserInputError } from "~/lib/utils/error";
import { responseError, responseSuccess } from "~/lib/utils/response";

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
      throw new UserInputError(
        "Older entry with higher distance traveled exists",
      );
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
      throw new UserInputError(
        "Newer entry with lower distance traveled exists",
      );
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

    return responseSuccess();
  } catch (error) {
    return responseError(error);
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

    return responseSuccess(events);
  } catch (error) {
    return responseError(error);
  }
}

export async function updateVehicleHistoryEvent(
  eventId: number,
  newEvent: z.infer<typeof addHistoryEventSchema>,
) {
  try {
    addHistoryEventSchema.partial().parse(newEvent);
    const event = await db.query.historyTable.findFirst({
      where: eq(historyTable.id, eventId),
      with: {
        vehicle: true,
      },
    });

    if (!event) throw new NotFoundError("Event not found");

    await authorize(async (user) => {
      if (event.vehicle.ownerId !== user.id) return false;
      return true;
    });

    // Check for preceding events with higher distance traveled
    const precedingConflict = await db
      .select()
      .from(historyTable)
      .where(
        and(
          eq(historyTable.vehicleId, event.vehicleId),
          lt(historyTable.date, newEvent.date),
          gt(historyTable.atDistanceTraveled, newEvent.atDistanceTraveled),
        ),
      )
      .limit(1);

    if (precedingConflict.length > 0) {
      throw new UserInputError(
        "Older entry with higher distance traveled exists",
      );
    }

    // Check for upcoming events with lower distance traveled
    const upcomingConflict = await db
      .select()
      .from(historyTable)
      .where(
        and(
          eq(historyTable.vehicleId, event.vehicleId),
          gt(historyTable.date, newEvent.date),
          lt(historyTable.atDistanceTraveled, newEvent.atDistanceTraveled),
        ),
      )
      .limit(1);

    if (upcomingConflict.length > 0) {
      throw new UserInputError(
        "Newer entry with lower distance traveled exists",
      );
    }

    const [updatedEvent] = await updateHistoryEvent(eventId, newEvent);

    return responseSuccess(updatedEvent);
  } catch (error) {
    return responseError(error);
  }
}

export async function deleteVehicleHistoryEvent(eventId: number) {
  try {
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

    await deleteHistoryEvent(eventId);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

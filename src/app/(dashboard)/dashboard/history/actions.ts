"use server";

import { and, desc, eq, gt, lt } from "drizzle-orm";
import { type z } from "zod";

import { db } from "~/db";
import { historyTable, vehicleTable } from "~/db/_schema";

import { authorize } from "~/lib/server/authorize";
import {
  createHistoryEvent,
  deleteHistoryEvent,
  getHistoryEvents,
  getHistoryEventsCount,
  getLatestHistoryEvent,
  updateHistoryEvent,
} from "~/lib/server/history";
import {
  createPaymentForHistoryEvent,
  updatePaymentForHistoryEvent,
} from "~/lib/server/money";
import { getUserCurrency, getUserUnits } from "~/lib/server/user-profile";
import { updateVehicle } from "~/lib/server/vehicle";
import { NotFoundError, UserInputError } from "~/lib/utils/error";
import { responseError, responseSuccess } from "~/lib/utils/response";
import { convertToMetric } from "~/lib/utils/units";
import { addHistoryEventSchema } from "~/lib/validators/history";

export async function createUserHistoryEvent(
  vehicleId: string,
  newEvent: z.infer<typeof addHistoryEventSchema>,
) {
  try {
    const user = await authorize(async (user) => {
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

    const units = await getUserUnits(user.id);
    const newAtDistanceTraveled = convertToMetric(
      newEvent.atDistanceTraveled,
      units,
    );

    // Check for preceding events with higher distance traveled
    const precedingConflict = await db
      .select()
      .from(historyTable)
      .where(
        and(
          eq(historyTable.vehicleId, vehicleId),
          lt(historyTable.date, newEvent.date),
          gt(historyTable.atDistanceTraveled, newAtDistanceTraveled),
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
          lt(historyTable.atDistanceTraveled, newAtDistanceTraveled),
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
      latestEvent.atDistanceTraveled < newAtDistanceTraveled
    ) {
      await db
        .update(vehicleTable)
        .set({
          distanceTraveled: newAtDistanceTraveled,
        })
        .where(eq(vehicleTable.id, vehicleId));
    }

    const addedEvent = await createHistoryEvent(vehicleId, {
      ...newEvent,
      atDistanceTraveled: newAtDistanceTraveled,
    });

    if (!addedEvent) throw new Error("Failed to create event");
    const currency = await getUserCurrency(user.id);

    await createPaymentForHistoryEvent(addedEvent.id, newEvent.cost, currency);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

export async function getVehicleHistoryEvents(
  vehicleId: string,
  page = 1,
  perPage = 10,
  sortBy?: "newest" | "oldest",
  filters?: string,
  search?: string,
) {
  try {
    await authorize(async (user) => {
      const vehicle = await db.query.vehicleTable.findFirst({
        where: eq(vehicleTable.id, vehicleId),
      });

      if (vehicle?.ownerId !== user.id) return false;

      return true;
    });

    const events = await getHistoryEvents(
      vehicleId,
      page,
      perPage,
      sortBy,
      filters,
      search,
    );

    const total = await getHistoryEventsCount(vehicleId, filters, search);

    const responseObject = {
      events,
      total,
    };

    return responseSuccess(responseObject);
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

    const user = await authorize(async (user) => {
      if (event.vehicle.ownerId !== user.id) return false;
      return true;
    });

    const units = await getUserUnits(user.id);
    const newAtDistanceTraveled = convertToMetric(
      newEvent.atDistanceTraveled,
      units,
    );

    // Check for preceding events with higher distance traveled
    const precedingConflict = await db
      .select()
      .from(historyTable)
      .where(
        and(
          eq(historyTable.vehicleId, event.vehicleId),
          lt(historyTable.date, newEvent.date),
          gt(historyTable.atDistanceTraveled, newAtDistanceTraveled),
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
          lt(historyTable.atDistanceTraveled, newAtDistanceTraveled),
        ),
      )
      .limit(1);

    if (upcomingConflict.length > 0) {
      throw new UserInputError(
        "Newer entry with lower distance traveled exists",
      );
    }

    const latestEvent = await getLatestHistoryEvent(event.vehicleId);

    if (latestEvent && latestEvent.atDistanceTraveled < newAtDistanceTraveled) {
      await updateVehicle(event.vehicleId, {
        distanceTraveled: newAtDistanceTraveled,
      });
    }

    const currency = await getUserCurrency(user.id);
    await updatePaymentForHistoryEvent(eventId, newEvent.cost, currency);
    const updatedEvent = await updateHistoryEvent(eventId, newEvent);

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

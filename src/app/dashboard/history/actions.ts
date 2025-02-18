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
  getHistoryEventsCount,
  getLatestHistoryEvent,
  updateHistoryEvent,
} from "~/lib/server/history";
import {
  createPaymentForHistoryEvent,
  updatePaymentForHistoryEvent,
} from "~/lib/server/money";
import { getUserCurrency, getUserUnits } from "~/lib/server/user-profile";
import { getVehicleFromId, updateVehicle } from "~/lib/server/vehicle";
import { NotFoundError, UserInputError } from "~/lib/utils/error";
import { responseError, responseSuccess } from "~/lib/utils/response";
import { convertToMetric } from "~/lib/utils/units";

export async function createUserHistoryEvent(
  vehicleId: string,
  newEvent: z.infer<typeof addHistoryEventSchema>,
) {
  try {
    return await db.transaction(async (tx) => {
      const user = await authorize(
        async (user) => {
          const vehicle = await getVehicleFromId(vehicleId, {
            transaction: tx,
          });
          return vehicle?.ownerId === user.id;
        },
        { transaction: tx },
      );

      addHistoryEventSchema.parse(newEvent);

      const units = await getUserUnits(user.id, { transaction: tx });
      const newAtDistanceTraveled = convertToMetric(
        newEvent.atDistanceTraveled,
        units,
      );

      // Check for preceding events with higher distance traveled
      const precedingConflict = await tx
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
      const upcomingConflict = await tx
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

      const latestEvent = await tx.query.historyTable.findFirst({
        orderBy: desc(historyTable.atDistanceTraveled),
        where: and(eq(historyTable.vehicleId, vehicleId)),
      });

      // update current vehicle distanceTraveled
      if (
        !latestEvent ||
        latestEvent.atDistanceTraveled < newAtDistanceTraveled
      ) {
        await tx
          .update(vehicleTable)
          .set({
            distanceTraveled: newAtDistanceTraveled,
          })
          .where(eq(vehicleTable.id, vehicleId));
      }

      const addedEvent = await createHistoryEvent(
        vehicleId,
        {
          ...newEvent,
          atDistanceTraveled: newAtDistanceTraveled,
        },
        { transaction: tx },
      );

      if (!addedEvent) throw new Error("Failed to create event");

      const currency = await getUserCurrency(user.id, { transaction: tx });
      await createPaymentForHistoryEvent(
        addedEvent.id,
        newEvent.cost,
        currency,
        { transaction: tx },
      );

      return responseSuccess();
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function getVehicleHistoryEvents(
  vehicleId: string,
  page = 1,
  perPage = 20,
) {
  try {
    return await db.transaction(async (tx) => {
      await authorize(
        async (user) => {
          const vehicle = await tx.query.vehicleTable.findFirst({
            where: eq(vehicleTable.id, vehicleId),
          });

          if (vehicle?.ownerId !== user.id) return false;

          return true;
        },
        {
          transaction: tx,
        },
      );

      const events = await getHistoryEvents(vehicleId, page, perPage, {
        transaction: tx,
      });
      const total = await getHistoryEventsCount(vehicleId, {
        transaction: tx,
      });

      const responseObject = {
        events,
        total,
      };

      return responseSuccess(responseObject);
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function updateVehicleHistoryEvent(
  eventId: number,
  newEvent: z.infer<typeof addHistoryEventSchema>,
) {
  try {
    return await db.transaction(async (tx) => {
      addHistoryEventSchema.partial().parse(newEvent);

      const event = await tx.query.historyTable.findFirst({
        where: eq(historyTable.id, eventId),
        with: {
          vehicle: true,
        },
      });

      if (!event) throw new NotFoundError("Event not found");

      const user = await authorize(
        async (user) => {
          if (event.vehicle.ownerId !== user.id) return false;
          return true;
        },
        {
          transaction: tx,
        },
      );

      const units = await getUserUnits(user.id, { transaction: tx });
      const newAtDistanceTraveled = convertToMetric(
        newEvent.atDistanceTraveled,
        units,
      );

      // Check for preceding events with higher distance traveled
      const precedingConflict = await tx
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
      const upcomingConflict = await tx
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

      const latestEvent = await getLatestHistoryEvent(event.vehicleId, {
        transaction: tx,
      });

      if (
        latestEvent &&
        latestEvent.atDistanceTraveled < newAtDistanceTraveled
      ) {
        await updateVehicle(
          event.vehicleId,
          {
            distanceTraveled: newAtDistanceTraveled,
          },
          {
            transaction: tx,
          },
        );
      }

      const currency = await getUserCurrency(user.id, { transaction: tx });
      await updatePaymentForHistoryEvent(eventId, newEvent.cost, currency, {
        transaction: tx,
      });
      const updatedEvent = await updateHistoryEvent(eventId, newEvent, {
        transaction: tx,
      });

      return responseSuccess(updatedEvent);
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function deleteVehicleHistoryEvent(eventId: number) {
  try {
    return await db.transaction(async (tx) => {
      await authorize(
        async (user) => {
          const event = await tx.query.historyTable.findFirst({
            where: eq(historyTable.id, eventId),
            with: {
              vehicle: true,
            },
          });

          if (event?.vehicle.ownerId !== user.id) return false;

          return true;
        },
        {
          transaction: tx,
        },
      );

      await deleteHistoryEvent(eventId, {
        transaction: tx,
      });

      return responseSuccess();
    });
  } catch (error) {
    return responseError(error);
  }
}

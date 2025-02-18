"use server";

import { eq } from "drizzle-orm";
import { type z } from "zod";

import { db } from "~/db";
import { userProfileTable } from "~/db/_schema";

import { authorize } from "~/lib/server/authorize";
import { getLatestHistoryEvent } from "~/lib/server/history";
import {
  getUserProfileFromUserId,
  updateUserProfileFromUserId,
  updateUserProfileSelectedVehicle,
} from "~/lib/server/user-profile";
import {
  createVehicle,
  getVehicleFromId,
  getVehiclesFromUserId,
  updateVehicle,
} from "~/lib/server/vehicle";
import { NotFoundError, UserInputError } from "~/lib/utils/error";
import { responseError, responseSuccess } from "~/lib/utils/response";

import { userProfileSchema } from "../actions/user-profile-validators";
import { addVehicleSchema } from "../actions/vehicle-validators";

export async function getUserVehicles() {
  try {
    return await db.transaction(async (tx) => {
      const user = await authorize(undefined, { transaction: tx });
      const userVehicles = await getVehiclesFromUserId(user.id, {
        transaction: tx,
      });
      return responseSuccess(userVehicles);
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function createUserVehicle(
  newVehicle: z.infer<typeof addVehicleSchema>,
) {
  try {
    return await db.transaction(async (tx) => {
      addVehicleSchema.parse(newVehicle);

      const user = await authorize(undefined, { transaction: tx });
      const vehicle = await createVehicle(user.id, newVehicle, {
        transaction: tx,
      });
      const userProfile = await getUserProfileFromUserId(user.id, {
        transaction: tx,
      });

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      if (!userProfile.selectedVehicle) {
        await updateUserProfileSelectedVehicle(user.id, vehicle.id, {
          transaction: tx,
        });
      }

      return responseSuccess();
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function selectUserVehicle(vehicleId: string) {
  try {
    return await db.transaction(async (tx) => {
      const vehicle = await getVehicleFromId(vehicleId, {
        transaction: tx,
      });

      if (!vehicle) throw new NotFoundError("Vehicle not found");

      const user = await authorize(
        (user) => {
          return vehicle.ownerId === user.id;
        },
        {
          transaction: tx,
        },
      );

      await tx
        .update(userProfileTable)
        .set({
          selectedVehicleId: vehicle.id,
        })
        .where(eq(userProfileTable.userId, user.id));

      return responseSuccess(vehicle);
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function getCurrentSelectedVehicle() {
  try {
    return await db.transaction(async (tx) => {
      const user = await authorize(undefined, { transaction: tx });

      const userProfile = await tx.query.userProfileTable.findFirst({
        where: eq(userProfileTable.userId, user.id),
        with: {
          selectedVehicle: true,
        },
      });

      return responseSuccess(userProfile?.selectedVehicle);
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function getUserSelectedVehicle(userId: string) {
  try {
    return await db.transaction(async (tx) => {
      await authorize((user) => user.id == userId, { transaction: tx });

      const userProfile = await tx.query.userProfileTable.findFirst({
        where: eq(userProfileTable.userId, userId),
        with: {
          selectedVehicle: true,
        },
      });

      return responseSuccess(userProfile?.selectedVehicle);
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function updateUserSelectedVehicle(vehicleId: string) {
  try {
    return await db.transaction(async (tx) => {
      const vehicle = await getVehicleFromId(vehicleId, { transaction: tx });

      if (!vehicle) throw new NotFoundError("Vehicle not found");

      const user = await authorize((user) => vehicle.ownerId === user.id, {
        transaction: tx,
      });

      await updateUserProfileSelectedVehicle(user.id, vehicleId, {
        transaction: tx,
      });

      return responseSuccess();
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function updateUserVehicle(
  vehicleId: string,
  newVehicle: z.infer<typeof addVehicleSchema>,
) {
  try {
    return await db.transaction(async (tx) => {
      addVehicleSchema.parse(newVehicle);

      const vehicle = await getVehicleFromId(vehicleId, { transaction: tx });

      if (!vehicle) throw new NotFoundError("Vehicle not found");

      await authorize((user) => vehicle.ownerId === user.id, {
        transaction: tx,
      });

      const latestEvent = await getLatestHistoryEvent(vehicleId, {
        transaction: tx,
      });

      if (
        latestEvent &&
        latestEvent?.atDistanceTraveled > newVehicle.distanceTraveled
      ) {
        throw new UserInputError(
          "Distance traveled is lower than the latest event",
        );
      }

      await updateVehicle(vehicleId, newVehicle, {
        transaction: tx,
      });

      return responseSuccess();
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function getUserProfile(userId: string) {
  try {
    return await db.transaction(async (tx) => {
      await authorize(
        async (user) => {
          return user.id === userId;
        },
        { transaction: tx },
      );

      const userProfile = await getUserProfileFromUserId(userId, {
        transaction: tx,
      });

      return responseSuccess(userProfile);
    });
  } catch (error) {
    return responseError(error);
  }
}

export async function updateUserProfile(
  userId: string,
  newUserProfile: z.infer<typeof userProfileSchema>,
) {
  try {
    return await db.transaction(async (tx) => {
      await authorize(
        async (user) => {
          return user.id === userId;
        },
        {
          transaction: tx,
        },
      );

      userProfileSchema.parse(newUserProfile);

      await updateUserProfileFromUserId(userId, newUserProfile, {
        transaction: tx,
      });

      return responseSuccess();
    });
  } catch (error) {
    return responseError(error);
  }
}

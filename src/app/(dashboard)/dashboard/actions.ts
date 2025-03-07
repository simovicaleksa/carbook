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
import { userProfileSchema } from "~/lib/validators/user-profile-validators";
import { addVehicleSchema } from "~/lib/validators/vehicle-validators";

export async function getUserVehicles() {
  try {
    const user = await authorize();

    const userVehicles = await getVehiclesFromUserId(user.id);

    return responseSuccess(userVehicles);
  } catch (error) {
    return responseError(error);
  }
}

export async function createUserVehicle(
  newVehicle: z.infer<typeof addVehicleSchema>,
) {
  try {
    addVehicleSchema.parse(newVehicle);

    const user = await authorize();

    const vehicle = await createVehicle(user.id, newVehicle);

    const userProfile = await getUserProfileFromUserId(user.id);

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    if (!userProfile.selectedVehicle) {
      await updateUserProfileSelectedVehicle(user.id, vehicle.id);
    }

    await db
      .update(userProfileTable)
      .set({
        selectedVehicleId: vehicle.id,
      })
      .where(eq(userProfileTable.userId, user.id));

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

export async function selectUserVehicle(vehicleId: string) {
  try {
    const vehicle = await getVehicleFromId(vehicleId);

    if (!vehicle) throw new NotFoundError("Vehicle not found");

    const user = await authorize((user) => {
      return vehicle.ownerId === user.id;
    });

    await db
      .update(userProfileTable)
      .set({
        selectedVehicleId: vehicle.id,
      })
      .where(eq(userProfileTable.userId, user.id));

    return responseSuccess(vehicle);
  } catch (error) {
    return responseError(error);
  }
}

export async function getCurrentSelectedVehicle() {
  try {
    const user = await authorize();

    const userProfile = await db.query.userProfileTable.findFirst({
      where: eq(userProfileTable.userId, user.id),
      with: {
        selectedVehicle: true,
      },
    });

    return responseSuccess(userProfile?.selectedVehicle);
  } catch (error) {
    return responseError(error);
  }
}

export async function getUserSelectedVehicle(userId: string) {
  try {
    await authorize((user) => user.id == userId);

    const userProfile = await db.query.userProfileTable.findFirst({
      where: eq(userProfileTable.userId, userId),
      with: {
        selectedVehicle: true,
      },
    });

    return responseSuccess(userProfile?.selectedVehicle);
  } catch (error) {
    return responseError(error);
  }
}

export async function updateUserSelectedVehicle(vehicleId: string) {
  try {
    const vehicle = await getVehicleFromId(vehicleId);

    if (!vehicle) throw new NotFoundError("Vehicle not found");

    const user = await authorize((user) => vehicle.ownerId === user.id);

    await updateUserProfileSelectedVehicle(user.id, vehicleId);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

export async function updateUserVehicle(
  vehicleId: string,
  newVehicle: z.infer<typeof addVehicleSchema>,
) {
  try {
    addVehicleSchema.parse(newVehicle);

    const vehicle = await getVehicleFromId(vehicleId);

    if (!vehicle) throw new NotFoundError("Vehicle not found");

    await authorize((user) => vehicle.ownerId === user.id);

    const latestEvent = await getLatestHistoryEvent(vehicleId);

    if (
      latestEvent &&
      latestEvent?.atDistanceTraveled > newVehicle.distanceTraveled
    ) {
      throw new UserInputError(
        "Distance traveled is lower than the latest event",
      );
    }

    await updateVehicle(vehicleId, newVehicle);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

export async function getUserProfile(userId: string) {
  try {
    await authorize(async (user) => {
      return user.id === userId;
    });

    const userProfile = await getUserProfileFromUserId(userId);

    return responseSuccess(userProfile);
  } catch (error) {
    return responseError(error);
  }
}

export async function updateUserProfile(
  userId: string,
  newUserProfile: z.infer<typeof userProfileSchema>,
) {
  try {
    await authorize(async (user) => {
      return user.id === userId;
    });

    userProfileSchema.parse(newUserProfile);

    await updateUserProfileFromUserId(userId, newUserProfile);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

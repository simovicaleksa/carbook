"use server";

import { eq } from "drizzle-orm";
import { type z } from "zod";

import { db } from "~/db";
import { userProfileTable } from "~/db/_schema";

import { authorize } from "~/lib/server/authorize";
import { dbGetLatestHistoryEvent } from "~/lib/server/history";
import {
  dbGetUserProfileFromUserId,
  dbUpdateUserProfileFromUserId,
  dbUpdateUserProfileSelectedVehicle,
} from "~/lib/server/user-profile";
import {
  dbCreateVehicle,
  dbGetVehicleFromId,
  dbGetVehiclesFromUserId,
  dbUpdateVehicle,
} from "~/lib/server/vehicle";
import { NotFoundError, UserInputError } from "~/lib/utils/error";
import { responseError, responseSuccess } from "~/lib/utils/response";
import { userProfileSchema } from "~/lib/validators/user-profile";
import { addVehicleSchema } from "~/lib/validators/vehicle";

export async function serverGetUserVehicles() {
  try {
    const user = await authorize();

    const userVehicles = await dbGetVehiclesFromUserId(user.id);

    return responseSuccess(userVehicles);
  } catch (error) {
    return responseError(error);
  }
}

export async function serverCreateUserVehicle(
  newVehicle: z.infer<typeof addVehicleSchema>,
) {
  try {
    addVehicleSchema.parse(newVehicle);

    const user = await authorize();

    const vehicle = await dbCreateVehicle(user.id, newVehicle);

    const userProfile = await dbGetUserProfileFromUserId(user.id);

    if (!userProfile) {
      throw new Error("User profile not found");
    }

    if (!userProfile.selectedVehicle) {
      await dbUpdateUserProfileSelectedVehicle(user.id, vehicle.id);
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

export async function serverSelectUserVehicle(vehicleId: string) {
  try {
    const vehicle = await dbGetVehicleFromId(vehicleId);

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

export async function serverGetUserSelectedVehicle() {
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

export async function serverGetSelectedVehicleFromUserId(userId: string) {
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

export async function serverUpdateUserSelectedVehicle(vehicleId: string) {
  try {
    const vehicle = await dbGetVehicleFromId(vehicleId);

    if (!vehicle) throw new NotFoundError("Vehicle not found");

    const user = await authorize((user) => vehicle.ownerId === user.id);

    await dbUpdateUserProfileSelectedVehicle(user.id, vehicleId);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

export async function serverUpdateUserVehicle(
  vehicleId: string,
  newVehicle: z.infer<typeof addVehicleSchema>,
) {
  try {
    addVehicleSchema.parse(newVehicle);

    const vehicle = await dbGetVehicleFromId(vehicleId);

    if (!vehicle) throw new NotFoundError("Vehicle not found");

    await authorize((user) => vehicle.ownerId === user.id);

    const latestEvent = await dbGetLatestHistoryEvent(vehicleId);

    if (
      latestEvent &&
      latestEvent?.atDistanceTraveled > newVehicle.distanceTraveled
    ) {
      throw new UserInputError(
        "Distance traveled is lower than the latest event",
      );
    }

    await dbUpdateVehicle(vehicleId, newVehicle);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

export async function serverGetUserProfileFromUserId(userId: string) {
  try {
    await authorize(async (user) => {
      return user.id === userId;
    });

    const userProfile = await dbGetUserProfileFromUserId(userId);

    return responseSuccess(userProfile);
  } catch (error) {
    return responseError(error);
  }
}

export async function serverUpdateUserProfile(
  userId: string,
  newUserProfile: z.infer<typeof userProfileSchema>,
) {
  try {
    await authorize(async (user) => {
      return user.id === userId;
    });

    userProfileSchema.parse(newUserProfile);

    await dbUpdateUserProfileFromUserId(userId, newUserProfile);

    return responseSuccess();
  } catch (error) {
    return responseError(error);
  }
}

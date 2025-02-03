"use server";

import { eq } from "drizzle-orm";
import { type z, ZodError } from "zod";

import { db } from "~/db";
import { userProfileTable } from "~/db/_schema";

import { AuthorizationError, authorize } from "~/lib/server/authorize";
import {
  getUserProfileFromUserId,
  updateUserProfileSelectedVehicle,
} from "~/lib/server/user-profile";
import {
  createVehicle,
  getVehicleFromId,
  getVehiclesFromUserId,
} from "~/lib/server/vehicle";

import { addVehicleSchema } from "../actions/vehicle-validators";

export async function getUserVehicles() {
  try {
    const user = await authorize();

    const userVehicles = await getVehiclesFromUserId(user.id);

    return {
      ok: true,
      status: 200,
      data: userVehicles,
    };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return {
        ok: false,
        status: 401,
        error: error,
      };
    }

    return {
      ok: false,
      status: 500,
      error: error as Error,
    };
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

    return {
      ok: true,
      status: 200,
    };
  } catch (error) {
    if (error instanceof ZodError)
      return {
        ok: false,
        status: 400,
        error: error,
      };
    else if (error instanceof AuthorizationError)
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

export async function selectUserVehicle(vehicleId: string) {
  try {
    const vehicle = await getVehicleFromId(vehicleId);

    if (!vehicle)
      return {
        ok: false,
        status: 404,
        error: new Error("Vehicle not found"),
      };

    const user = await authorize((user) => {
      return vehicle.ownerId === user.id;
    });

    await db
      .update(userProfileTable)
      .set({
        selectedVehicleId: vehicle.id,
      })
      .where(eq(userProfileTable.userId, user.id));

    return {
      ok: true,
      status: 200,
      data: vehicle,
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

export async function getCurrentSelectedVehicle() {
  try {
    const user = await authorize();

    const userProfile = await db.query.userProfileTable.findFirst({
      where: eq(userProfileTable.userId, user.id),
      with: {
        selectedVehicle: true,
      },
    });

    return {
      ok: true,
      status: 200,
      data: userProfile?.selectedVehicle,
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

export async function getUserSelectedVehicle(userId: string) {
  try {
    await authorize((user) => user.id == userId);

    const userProfile = await db.query.userProfileTable.findFirst({
      where: eq(userProfileTable.userId, userId),
      with: {
        selectedVehicle: true,
      },
    });

    return {
      ok: true,
      status: 200,
      data: userProfile?.selectedVehicle,
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

export async function updateUserSelectedVehicle(vehicleId: string) {
  try {
    const vehicle = await getVehicleFromId(vehicleId);

    if (!vehicle)
      return {
        ok: false,
        status: 404,
        error: new Error("Vehicle not found"),
      };

    const user = await authorize((user) => vehicle.ownerId === user.id);

    await updateUserProfileSelectedVehicle(user.id, vehicleId);

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
    return {
      ok: false,
      status: 500,
      error: error as Error,
    };
  }
}

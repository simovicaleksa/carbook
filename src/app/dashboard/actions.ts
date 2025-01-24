"use server";

import { type z, ZodError } from "zod";

import { AuthorizationError, authorize } from "~/lib/server/authorize";
import { createVehicle, getVehiclesFromUserId } from "~/lib/server/vehicle";

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
  vehicle: z.infer<typeof addVehicleSchema>,
) {
  try {
    addVehicleSchema.parse(vehicle);

    const user = await authorize();

    await createVehicle(user.id, vehicle);

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

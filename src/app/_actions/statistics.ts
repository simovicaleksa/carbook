"use server";

import { authorize } from "~/lib/server/authorize";
import {
  dbGetTotalVehicleSpendingGroupedByCurrency,
  dbGetTotalVehicleSpendingGroupedByType,
} from "~/lib/server/statistics";
import { dbGetVehicleFromId } from "~/lib/server/vehicle";
import { responseError, responseSuccess } from "~/lib/utils/response";

export async function serverGetTotalVehicleSpendingGroupedByCurrency(
  vehicleId: string,
) {
  try {
    await authorize(async (user) => {
      const vehicle = await dbGetVehicleFromId(vehicleId);

      if (!vehicle) return false;

      return vehicle.ownerId === user.id;
    });

    const data = await dbGetTotalVehicleSpendingGroupedByCurrency(vehicleId);

    return responseSuccess(data);
  } catch (error) {
    return responseError(error);
  }
}

export async function serverGetTotalVehicleSpendingGroupedByType(
  vehicleId: string,
  currency: string,
) {
  try {
    await authorize(async (user) => {
      const vehicle = await dbGetVehicleFromId(vehicleId);

      if (!vehicle) return false;

      return vehicle.ownerId === user.id;
    });

    const data = await dbGetTotalVehicleSpendingGroupedByType(
      vehicleId,
      currency,
    );

    return responseSuccess(data);
  } catch (error) {
    return responseError(error);
  }
}

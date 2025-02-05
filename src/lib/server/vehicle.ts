import { eq } from "drizzle-orm";
import { type z } from "zod";

import { type addVehicleSchema } from "~/app/actions/vehicle-validators";

import { db } from "~/db";
import { userProfileTable, vehicleTable } from "~/db/_schema";

export async function getVehicleFromId(vehicleId: string) {
  const [vehicle] = await db
    .select()
    .from(vehicleTable)
    .where(eq(vehicleTable.id, vehicleId));

  return vehicle;
}

export async function getVehiclesFromUserId(userId: string) {
  return await db
    .select()
    .from(vehicleTable)
    .where(eq(vehicleTable.ownerId, userId));
}

export async function createVehicle(
  userId: string,
  {
    make,
    model,
    year,
    distanceTraveled,
    type,
  }: z.infer<typeof addVehicleSchema>,
) {
  const [vehicle] = await db
    .insert(vehicleTable)
    .values({
      make,
      model,
      year,
      distanceTraveled,
      type,
      ownerId: userId,
    })
    .returning();

  if (!vehicle) {
    throw new Error("Failed to create vehicle");
  }

  return vehicle;
}

export async function updateVehicle(
  vehicleId: string,
  newVehicle: Partial<z.infer<typeof addVehicleSchema>>,
) {
  const vehicle = await getVehicleFromId(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  await db
    .update(vehicleTable)
    .set(newVehicle)
    .where(eq(vehicleTable.id, vehicle.id));
}

export async function deleteVehicle(vehicleId: string) {
  await db.delete(vehicleTable).where(eq(vehicleTable.id, vehicleId));
}

export async function getSelectedVehicleFromUserId(userId: string) {
  const userProfile = await db.query.userProfileTable.findFirst({
    where: eq(userProfileTable.userId, userId),
    with: {
      selectedVehicle: true,
    },
  });

  if (!userProfile) {
    throw new Error("User not found");
  }

  return userProfile.selectedVehicle;
}

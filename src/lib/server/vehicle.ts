import { eq } from "drizzle-orm";
import { type z } from "zod";

import { type addVehicleSchema } from "~/app/actions/vehicle-validators";

import { db } from "~/db";
import { userProfileTable, vehicleTable } from "~/db/_schema";

import { type DbOptions } from "./types";

export async function getVehicleFromId(
  vehicleId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const [vehicle] = await client
    .select()
    .from(vehicleTable)
    .where(eq(vehicleTable.id, vehicleId));

  return vehicle;
}

export async function getVehiclesFromUserId(
  userId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  return await client
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
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const [vehicle] = await client
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
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const vehicle = await getVehicleFromId(vehicleId, options);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  await client
    .update(vehicleTable)
    .set(newVehicle)
    .where(eq(vehicleTable.id, vehicle.id));
}

export async function deleteVehicle(
  vehicleId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  await client.delete(vehicleTable).where(eq(vehicleTable.id, vehicleId));
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

import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { eq } from "drizzle-orm";
import { type z } from "zod";

import { db } from "~/db";
import { vehicleTable } from "~/db/_schema";

import { type addVehicleSchema } from "~/lib/validators/vehicle";

export async function dbGetVehicleFromId(vehicleId: string) {
  "use cache";
  cacheTag(`vehicle-${vehicleId}`);

  const [vehicle] = await db
    .select()
    .from(vehicleTable)
    .where(eq(vehicleTable.id, vehicleId));

  return vehicle;
}

export async function dbGetVehiclesFromUserId(userId: string) {
  "use cache";
  cacheTag(`user-${userId}-vehicles`);

  return await db
    .select()
    .from(vehicleTable)
    .where(eq(vehicleTable.ownerId, userId));
}

export async function dbCreateVehicle(
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

  revalidateTag(`user-${userId}-vehicles`);

  return vehicle;
}

export async function dbUpdateVehicle(
  vehicleId: string,
  newVehicle: Partial<z.infer<typeof addVehicleSchema>>,
) {
  const vehicle = await dbGetVehicleFromId(vehicleId);

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  await db
    .update(vehicleTable)
    .set(newVehicle)
    .where(eq(vehicleTable.id, vehicle.id));

  revalidateTag(`vehicle-${vehicleId}`);
}

export async function dbDeleteVehicle(vehicleId: string) {
  await db.delete(vehicleTable).where(eq(vehicleTable.id, vehicleId));
  revalidateTag(`vehicle-${vehicleId}`);
}

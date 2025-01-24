import { eq } from "drizzle-orm";

import { db } from "~/db";
import { vehicleTable } from "~/db/_schema";

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
  }: {
    make: string;
    model: string;
    year: number;
    type: "motorcycle" | "car" | "truck";
    distanceTraveled: number;
  },
) {
  await db.insert(vehicleTable).values({
    make,
    model,
    year,
    distanceTraveled,
    type,
    ownerId: userId,
  });
}

export async function updateVehicle(
  vehicleId: string,
  newVehicle: {
    userId?: string;
    make?: string;
    model?: string;
    year?: number;
    type?: "motorcycle" | "car" | "truck";
    distanceTraveled?: number;
  },
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

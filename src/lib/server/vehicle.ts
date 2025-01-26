import { eq } from "drizzle-orm";

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
  }: {
    make: string;
    model: string;
    year: number;
    type: "motorcycle" | "car" | "truck";
    distanceTraveled: number;
  },
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

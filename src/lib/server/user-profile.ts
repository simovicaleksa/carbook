import { eq, type InferSelectModel } from "drizzle-orm";

import { db } from "~/db";
import { userProfileTable } from "~/db/_schema";

import { type DbOptions } from "./types";

export async function getUserProfileFromUserId(
  userId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const userProfile = await client.query.userProfileTable.findFirst({
    where: eq(userProfileTable.userId, userId),
    with: {
      selectedVehicle: true,
    },
  });

  if (!userProfile) {
    throw new Error("User not found");
  }

  return userProfile;
}

export async function updateUserProfileSelectedVehicle(
  userId: string,
  vehicleId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  await client
    .update(userProfileTable)
    .set({
      selectedVehicleId: vehicleId,
    })
    .where(eq(userProfileTable.userId, userId));
}

export async function updateUserProfileFromUserId(
  userId: string,
  newUserProfile: Partial<InferSelectModel<typeof userProfileTable>>,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;

  await client
    .update(userProfileTable)
    .set(newUserProfile)
    .where(eq(userProfileTable.userId, userId));
}

export async function getUserCurrency(userId: string, options: DbOptions = {}) {
  const userProfile = await getUserProfileFromUserId(userId, options);

  return userProfile.preferredCurrency ?? "USD";
}

export async function getUserUnits(userId: string, options: DbOptions = {}) {
  const userProfile = await getUserProfileFromUserId(userId, options);

  return userProfile.preferredUnits ?? "metric";
}

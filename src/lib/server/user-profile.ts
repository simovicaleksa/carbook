import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { eq, type InferSelectModel } from "drizzle-orm";

import { db } from "~/db";
import { userProfileTable } from "~/db/_schema";

export async function dbGetUserProfileFromUserId(userId: string) {
  "use cache";
  cacheTag(`user-profile-${userId}`);

  const userProfile = await db.query.userProfileTable.findFirst({
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

export async function dbUpdateUserProfileSelectedVehicle(
  userId: string,
  vehicleId: string,
) {
  await db
    .update(userProfileTable)
    .set({
      selectedVehicleId: vehicleId,
    })
    .where(eq(userProfileTable.userId, userId));

  revalidateTag(`user-profile-${userId}`);
}

export async function dbUpdateUserProfileFromUserId(
  userId: string,
  newUserProfile: Partial<InferSelectModel<typeof userProfileTable>>,
) {
  await db
    .update(userProfileTable)
    .set(newUserProfile)
    .where(eq(userProfileTable.userId, userId));

  revalidateTag(`user-profile-${userId}`);
}

export async function dbGetUserCurrency(userId: string) {
  "use cache";
  cacheTag(`user-profile-${userId}`);

  const userProfile = await dbGetUserProfileFromUserId(userId);

  return userProfile.preferredCurrency ?? "USD";
}

export async function dbGetUserUnits(userId: string) {
  "use cache";
  cacheTag(`user-profile-${userId}`);

  const userProfile = await dbGetUserProfileFromUserId(userId);

  return userProfile.preferredUnits ?? "metric";
}

export async function dbGetSelectedVehicleFromUserId(userId: string) {
  "use cache";
  cacheTag(`user-profile-${userId}`);

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

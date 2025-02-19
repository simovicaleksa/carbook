import { revalidateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { eq, type InferSelectModel } from "drizzle-orm";

import { db } from "~/db";
import { userProfileTable } from "~/db/_schema";

export async function getUserProfileFromUserId(userId: string) {
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

export async function updateUserProfileSelectedVehicle(
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

export async function updateUserProfileFromUserId(
  userId: string,
  newUserProfile: Partial<InferSelectModel<typeof userProfileTable>>,
) {
  await db
    .update(userProfileTable)
    .set(newUserProfile)
    .where(eq(userProfileTable.userId, userId));

  revalidateTag(`user-profile-${userId}`);
}

export async function getUserCurrency(userId: string) {
  "use cache";
  cacheTag(`user-profile-${userId}`);

  const userProfile = await getUserProfileFromUserId(userId);

  return userProfile.preferredCurrency ?? "USD";
}

export async function getUserUnits(userId: string) {
  "use cache";
  cacheTag(`user-profile-${userId}`);

  const userProfile = await getUserProfileFromUserId(userId);

  return userProfile.preferredUnits ?? "metric";
}

export async function getSelectedVehicleFromUserId(userId: string) {
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

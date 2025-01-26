import { eq } from "drizzle-orm";

import { db } from "~/db";
import { userProfileTable } from "~/db/_schema";

export async function getUserProfileFromUserId(userId: string) {
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
}

import { eq, or } from "drizzle-orm";
import { type z } from "zod";

import { db } from "~/db";
import { userProfileTable, userTable } from "~/db/_schema";

import { type signupSchema } from "../validators/signup";

import { hashPassword } from "./password";
import { lower } from "./sql";

export async function createUser(user: z.infer<typeof signupSchema>) {
  const isEmailAvailable = await checkEmailAvailability(user.email);
  if (!isEmailAvailable) {
    throw new Error("Email is already in use");
  }

  const isUsernameAvailable = await checkUsernameAvailability(user.username);
  if (!isUsernameAvailable) {
    throw new Error("Username is already in use");
  }

  const hashedPassword = await hashPassword(user.password);

  const [dbUser] = await db
    .insert(userTable)
    .values({
      ...user,
      password: hashedPassword,
    })
    .returning();

  if (!dbUser) {
    throw new Error("Failed to create user");
  }

  await db.insert(userProfileTable).values({ userId: dbUser.id });

  return dbUser;
}

export async function checkEmailAvailability(email: string) {
  const users = await db
    .select({
      id: userTable.id,
    })
    .from(userTable)
    .where(eq(userTable.email, email));

  if (users.length > 0) {
    return false;
  }

  return true;
}

export async function checkUsernameAvailability(username: string) {
  const users = await db
    .select({
      id: userTable.id,
    })
    .from(userTable)
    .where(eq(userTable.username, username));

  if (users.length > 0) {
    return false;
  }

  return true;
}

export async function getUserFromUsernameOrEmail(username: string) {
  const lowerCaseUsername = username.toLowerCase();

  const [user] = await db
    .select()
    .from(userTable)
    .where(
      or(
        eq(lower(userTable.username), lowerCaseUsername),
        eq(lower(userTable.email), lowerCaseUsername),
      ),
    );

  return user;
}

export async function getUserProfileFromUserId(userId: string) {
  const user = await db.query.userProfileTable.findFirst({
    where: eq(userProfileTable.userId, userId),
  });

  return user;
}

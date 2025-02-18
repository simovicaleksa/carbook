import { eq, or } from "drizzle-orm";
import { type z } from "zod";

import { type signupSchema } from "~/app/auth/signup/validators";

import { db } from "~/db";
import { userProfileTable, userTable } from "~/db/_schema";

import { hashPassword } from "./password";
import { lower } from "./sql";
import { type DbOptions } from "./types";

export async function createUser(
  user: z.infer<typeof signupSchema>,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const isEmailAvailable = await checkEmailAvailability(user.email, options);
  if (!isEmailAvailable) {
    throw new Error("Email is already in use");
  }

  const isUsernameAvailable = await checkUsernameAvailability(
    user.username,
    options,
  );
  if (!isUsernameAvailable) {
    throw new Error("Username is already in use");
  }

  const hashedPassword = await hashPassword(user.password);

  const [dbUser] = await client
    .insert(userTable)
    .values({
      ...user,
      password: hashedPassword,
    })
    .returning();

  if (!dbUser) {
    throw new Error("Failed to create user");
  }

  await client.insert(userProfileTable).values({ userId: dbUser.id });

  return dbUser;
}

export async function checkEmailAvailability(
  email: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;

  const users = await client
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

export async function checkUsernameAvailability(
  username: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;

  const users = await client
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

export async function getUserFromUsernameOrEmail(
  username: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;

  const lowerCaseUsername = username.toLowerCase();

  const [user] = await client
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

export async function getUserProfileFromUserId(
  userId: string,
  options: DbOptions = {},
) {
  const client = options.transaction ?? db;
  const user = await client.query.userProfileTable.findFirst({
    where: eq(userProfileTable.userId, userId),
  });

  return user;
}

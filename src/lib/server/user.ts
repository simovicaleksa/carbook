import { eq, or } from "drizzle-orm";
import { type z } from "zod";

import { type signupSchema } from "~/app/auth/signup/validators";

import { db } from "~/db";
import { userTable } from "~/db/_schema";

import { hashPassword } from "./password";

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
  const [user] = await db
    .select()
    .from(userTable)
    .where(or(eq(userTable.username, username), eq(userTable.email, username)));

  return user;
}

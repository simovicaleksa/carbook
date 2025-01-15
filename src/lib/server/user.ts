import { type z } from "zod";

import { type signupSchema } from "~/app/auth/signup/validators";

import { db } from "~/db";
import { userTable } from "~/db/_schema";

import { hashPassword } from "./password";

export async function createUser(user: z.infer<typeof signupSchema>) {
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

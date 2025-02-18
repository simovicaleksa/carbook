"use server";

import { redirect } from "next/navigation";

import { type z } from "zod";

import { db } from "~/db";

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/lib/server/auth";
import { verifyPasswordHash } from "~/lib/server/password";
import { getUserFromUsernameOrEmail } from "~/lib/server/user";
import { UserInputError } from "~/lib/utils/error";
import { responseError } from "~/lib/utils/response";

import { loginSchema } from "./validators";

export async function login({
  username,
  password,
}: z.infer<typeof loginSchema>) {
  try {
    return await db.transaction(async (tx) => {
      loginSchema.parse({ username, password });
      const user = await getUserFromUsernameOrEmail(username, {
        transaction: tx,
      });

      if (!user) {
        throw new UserInputError("Invalid username or password");
      }

      const passwordsMatch = await verifyPasswordHash(user.password, password);

      if (!passwordsMatch) {
        throw new UserInputError("Invalid username or password");
      }

      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, user.id, {
        transaction: tx,
      });
      await setSessionTokenCookie(sessionToken, session.expiresAt);

      return redirect("/welcome/login");
    });
  } catch (error) {
    return responseError(error);
  }
}

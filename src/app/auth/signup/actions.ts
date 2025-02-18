"use server";

import { redirect } from "next/navigation";

import { type z } from "zod";

import { db } from "~/db";

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/lib/server/auth";
import { createUser } from "~/lib/server/user";
import { responseError } from "~/lib/utils/response";

import { signupSchema } from "./validators";

export async function signUp(signupUser: z.infer<typeof signupSchema>) {
  try {
    await db.transaction(async (tx) => {
      const parsedUser = signupSchema.parse(signupUser);
      const user = await createUser(parsedUser, { transaction: tx });
      const sessionToken = generateSessionToken();
      const session = await createSession(sessionToken, user.id, {
        transaction: tx,
      });
      await setSessionTokenCookie(sessionToken, session.expiresAt);
      return redirect("/welcome/signup");
    });
  } catch (error) {
    return responseError(error);
  }
}

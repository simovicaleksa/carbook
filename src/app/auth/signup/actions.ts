"use server";

import { redirect } from "next/navigation";

import { type z } from "zod";

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
    const parsedUser = signupSchema.parse(signupUser);

    const user = await createUser(parsedUser);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return responseError(error);
  }

  redirect("/welcome/signup");
}

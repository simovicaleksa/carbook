"use server";

import { ZodError, type z } from "zod";

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/lib/server/auth";
import { createUser } from "~/lib/server/user";

import { signupSchema } from "./validators";

export async function signUp(signupUser: z.infer<typeof signupSchema>) {
  try {
    const parsedUser = signupSchema.parse(signupUser);

    const user = await createUser(parsedUser);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return {
      ok: true,
      status: 201,
      message: "User created",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        ok: false,
        status: 400,
        error: error,
      };
    }

    return {
      ok: false,
      status: 500,
      error: error as Error,
    };
  }
}

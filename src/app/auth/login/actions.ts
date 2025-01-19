"use server";

import { redirect } from "next/navigation";

import { ZodError, type z } from "zod";

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "~/lib/server/auth";
import { verifyPasswordHash } from "~/lib/server/password";
import { getUserFromUsernameOrEmail } from "~/lib/server/user";

import { loginSchema } from "./validators";

export async function login({
  username,
  password,
}: z.infer<typeof loginSchema>) {
  try {
    const parsedUser = loginSchema.parse({ username, password });

    const user = await getUserFromUsernameOrEmail(parsedUser.username);

    if (!user) {
      return {
        ok: false,
        status: 401,
        error: new Error("Invalid username or password"),
      };
    }

    const passwordsMatch = await verifyPasswordHash(user.password, password);

    if (!passwordsMatch) {
      return {
        ok: false,
        status: 401,
        error: new Error("Invalid username or password"),
      };
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
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

  return redirect("/welcome/login");
}

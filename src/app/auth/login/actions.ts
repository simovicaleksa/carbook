"use server";

import { redirect } from "next/navigation";

import { type z } from "zod";

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
    const parsedUser = loginSchema.parse({ username, password });

    const user = await getUserFromUsernameOrEmail(parsedUser.username);

    if (!user) {
      throw new UserInputError("Invalid username or password");
      // return {
      //   ok: false,
      //   status: 401,
      //   error: new Error("Invalid username or password"),
      // };
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
    return responseError(error);
  }

  return redirect("/welcome/login");
}

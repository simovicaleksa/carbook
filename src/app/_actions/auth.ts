"use server";

import { redirect } from "next/navigation";

import { type z } from "zod";

import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from "~/lib/server/auth";
import { dbCreateUser, dbGetUserFromUsernameOrEmail } from "~/lib/server/user";
import { UserInputError } from "~/lib/utils/error";
import { verifyPasswordHash } from "~/lib/utils/password";
import { responseError } from "~/lib/utils/response";
import { loginSchema } from "~/lib/validators/login";
import { signupSchema } from "~/lib/validators/signup";

export async function login({
  username,
  password,
}: z.infer<typeof loginSchema>) {
  try {
    const parsedUser = loginSchema.parse({ username, password });

    const user = await dbGetUserFromUsernameOrEmail(parsedUser.username);

    if (!user) {
      throw new UserInputError("Invalid username or password");
    }

    const passwordsMatch = await verifyPasswordHash(user.password, password);

    if (!passwordsMatch)
      throw new UserInputError("Invalid username or password");

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return responseError(error);
  }

  return redirect("/welcome/login");
}

export async function signout() {
  try {
    const { session } = await getCurrentSession();

    if (session === null) {
      throw new Error("Not logged in");
    }

    await invalidateSession(session.id);
    await deleteSessionTokenCookie();
  } catch (error) {
    return responseError(error);
  }

  return redirect("/auth/login");
}

export async function signUp(signupUser: z.infer<typeof signupSchema>) {
  try {
    const parsedUser = signupSchema.parse(signupUser);

    const user = await dbCreateUser(parsedUser);

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
  } catch (error) {
    return responseError(error);
  }

  redirect("/welcome/signup");
}

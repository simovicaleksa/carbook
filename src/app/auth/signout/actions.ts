"use server";

import { redirect } from "next/navigation";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "~/lib/server/auth";
import { responseError } from "~/lib/utils/response";

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

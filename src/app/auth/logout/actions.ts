"use server";

import { redirect } from "next/navigation";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "~/lib/server/auth";

export async function logout() {
  try {
    const { session } = await getCurrentSession();

    if (session === null) {
      throw new Error("Not logged in");
    }

    await invalidateSession(session.id);
    await deleteSessionTokenCookie();
  } catch (error) {
    return {
      ok: false,
      status: 401,
      error: error as Error,
    };
  }

  return redirect("/auth/login");
}

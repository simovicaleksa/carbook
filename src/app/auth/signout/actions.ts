"use server";

import { db } from "~/db";

import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from "~/lib/server/auth";
import { responseError, responseSuccess } from "~/lib/utils/response";

export async function signout() {
  try {
    return await db.transaction(async (tx) => {
      const { session } = await getCurrentSession({ transaction: tx });

      if (session === null) {
        throw new Error("Not logged in");
      }

      await invalidateSession(session.id, { transaction: tx });
      await deleteSessionTokenCookie();

      return responseSuccess();
    });
  } catch (error) {
    return responseError(error);
  }
}

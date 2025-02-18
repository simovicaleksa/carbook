import { AuthorizationError } from "../utils/error";

import { getCurrentSession, type User } from "./auth";
import { type DbOptions } from "./types";

export async function authorize(
  check: (user: User) => Promise<boolean> | boolean = () => true,
  options: DbOptions = {},
) {
  const { user } = await getCurrentSession(options);

  if (!user) {
    throw new AuthorizationError("Not authorized");
  }

  if (user.role === "admin") {
    return user;
  }

  const hasPermission = await check(user);

  if (!hasPermission) {
    throw new AuthorizationError("Not authorized");
  }

  return user;
}

import { getCurrentSession, type User } from "./auth";

export async function authorize(
  check: (user: User) => Promise<boolean> | boolean = () => true,
) {
  const { user } = await getCurrentSession();

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

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

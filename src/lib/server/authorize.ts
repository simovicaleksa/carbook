import { getCurrentSession } from "./auth";

export async function authorize(action: string) {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new AuthorizationError(`Not authorized`);
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

import { ZodError } from "zod";

import { AuthorizationError, NotFoundError, UserInputError } from "./error";

export function responseError(error: unknown) {
  if (error instanceof AuthorizationError) {
    return {
      ok: false,
      status: 401,
      error: error,
    };
  }
  if (error instanceof ZodError) {
    return {
      ok: false,
      status: 400,
      error: error,
    };
  }
  if (error instanceof NotFoundError) {
    return {
      ok: false,
      status: 404,
      error: error,
    };
  }
  if (error instanceof UserInputError) {
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

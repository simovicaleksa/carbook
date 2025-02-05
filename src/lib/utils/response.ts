import { ZodError } from "zod";

import { AuthorizationError, NotFoundError, UserInputError } from "./error";

export type ErrorResponseType = {
  ok: false;
  status: 400 | 401 | 404 | 500;
  error: Error | ZodError | NotFoundError | UserInputError | AuthorizationError;
  data?: undefined;
};

export type SuccessResponseType<T> = {
  ok: true;
  status: 200;
  error?: undefined;
  data?: T;
};

export function responseError(error: unknown): ErrorResponseType {
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

export function responseSuccess<T>(data?: T): SuccessResponseType<T> {
  return {
    ok: true as const,
    status: 200,
    data: data,
  };
}

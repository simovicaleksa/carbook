import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(64, { message: "First name cannot exceed 64 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(64, { message: "Last name cannot exceed 64 characters" }),
    email: z
      .string({ message: "Email is required" })
      .email({ message: "Must be a valid email" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(16, { message: "Username cannot exceed 16 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username must only use letters, numbers and underscores",
      }),
    password: z
      .string({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(255, { message: "Password cannot exceed 255 characters" }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(6, { message: "Confirm password must be at least 6 characters" })
      .max(255, { message: "Confirm password cannot exceed 255 characters" }),
  })
  .refine((ctx) => ctx.password === ctx.confirmPassword, {
    message: "Confirm password must match password",
    path: ["confirmPassword"],
  });

import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  password: z
    .string({ message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(255, { message: "Password cannot exceed 255 characters" }),
});

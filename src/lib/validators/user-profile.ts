import { z } from "zod";

export const userProfileSchema = z.object({
  preferredUnits: z.enum(["metric", "imperial"]),
  preferredCurrency: z.string().length(3),
});

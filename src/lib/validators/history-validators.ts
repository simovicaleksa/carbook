import { z } from "zod";

export const addHistoryEventSchema = z.object({
  type: z.enum(
    [
      "refuel",
      "service",
      "repair",
      "replacement",
      "purchase",
      "tune-up",
      "wash",
      "milestone",
      "inspection",
      "upgrade",
      "accident",
      "other",
    ],
    {
      message: "Invalid event type",
    },
  ),
  description: z.string(),
  date: z.coerce.date(),
  atDistanceTraveled: z.coerce
    .number({ message: "Enter a valid distance" })
    .min(0, { message: "Distance is required" }),
  cost: z.coerce
    .number({ message: "Enter a valid cost" })
    .min(0, { message: "Cost is required" }),
});

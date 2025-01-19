import { z } from "zod";

export const addVehicleSchema = z.object({
  type: z.enum(["car", "motorcycle", "truck"], {
    message: "Invalid vehicle type",
  }),
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.coerce.number().min(1900, { message: "Enter a valid year" }),
  distanceTraveled: z.coerce
    .number({ message: "Enter a valid distance traveled" })
    .min(0, { message: "Distance traveled is required" }),
});

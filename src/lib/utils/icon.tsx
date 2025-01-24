import { Car } from "lucide-react";

import { type VehicleType } from "~/context/selected-vehicle-context";

import { makes } from "../data/makes";

export function getBrandIcon(vehicle: VehicleType | null | undefined) {
  return (
    makes.find((make) => make.name === vehicle?.make)?.icon ?? (
      <Car className="size-4" />
    )
  );
}

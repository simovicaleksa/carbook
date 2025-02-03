import { Car, CircleEllipsis } from "lucide-react";

import { type VehicleType } from "~/context/selected-vehicle-context";

import { eventTypes } from "../data/event-types";
import { makes } from "../data/makes";

export function getBrandIcon(vehicle: VehicleType | null | undefined) {
  return (
    makes.find((make) => make.name === vehicle?.make)?.icon ?? (
      <Car className="size-4" />
    )
  );
}

export function getEventTypeIcon(type: string) {
  return (
    eventTypes.find((someEvent) => someEvent.value == type)?.icon ??
    CircleEllipsis
  );
}

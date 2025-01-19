import React from "react";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { Bike, Car, CircleCheck, Truck } from "lucide-react";

import { cn } from "~/lib/utils";

const options = [
  {
    value: "motorcycle",
    label: "Motorcycle",
    icon: <Bike className="mb-2.5 text-muted-foreground" />,
    description: "Two-wheeler",
  },
  {
    value: "car",
    label: "Car",
    icon: <Car className="mb-2.5 text-muted-foreground" />,
    description: "Passenger vehicle",
  },
  {
    value: "truck",
    label: "Truck",
    icon: <Truck className="mb-2.5 text-muted-foreground" />,
    description: "Cargo hauler",
  },
];

export default function VehicleTypeRadio({
  className,
  ...rest
}: RadioGroup.RadioGroupProps) {
  return (
    <RadioGroup.Root
      className={cn("grid w-full max-w-md grid-cols-3 gap-4", className)}
      {...rest}
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "group relative rounded px-3 py-2 text-start ring-[1px] ring-border",
            "data-[state=checked]:ring-2 data-[state=checked]:ring-primary",
          )}
        >
          <CircleCheck className="absolute right-0 top-0 h-6 w-6 -translate-y-1/2 translate-x-1/2 fill-primary stroke-background text-primary group-data-[state=unchecked]:hidden" />

          {option.icon}
          <span className="font-semibold tracking-tight">{option.label}</span>
          <p className="text-xs">{option.description}</p>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

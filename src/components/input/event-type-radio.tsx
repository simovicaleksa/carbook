import React from "react";

import * as RadioGroup from "@radix-ui/react-radio-group";
import {
  CircleCheck,
  CircleEllipsis,
  Coins,
  Drill,
  Droplets,
  Fuel,
  Hammer,
  Milestone,
  RefreshCw,
  Search,
  TriangleAlert,
  Wrench,
  Zap,
} from "lucide-react";

import { cn } from "~/lib/utils";

const options = [
  {
    value: "refuel",
    label: "Refuel",
    icon: <Fuel className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "service",
    label: "Service",
    icon: <Wrench className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "repair",
    label: "Repair",
    icon: <Hammer className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "replacement",
    label: "Replacement",
    icon: <RefreshCw className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "purchase",
    label: "Purchase",
    icon: <Coins className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "inspection",
    label: "Inspection",
    icon: <Search className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "tune-up",
    label: "Tune-up",
    icon: <Zap className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "wash",
    label: "Wash",
    icon: <Droplets className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "milestone",
    label: "Milestone",
    icon: <Milestone className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "upgrade",
    label: "Upgrade",
    icon: <Drill className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "accident",
    label: "Accident",
    icon: (
      <TriangleAlert className="mb-2 size-7 text-muted-foreground sm:size-5" />
    ),
  },
  {
    value: "other",
    label: "Other",
    icon: (
      <CircleEllipsis className="mb-2 size-7 text-muted-foreground sm:size-5" />
    ),
  },
];

export default function EventTypeRadio({
  className,
  ...rest
}: RadioGroup.RadioGroupProps) {
  return (
    <RadioGroup.Root
      className={cn("grid w-full grid-cols-2 gap-4 sm:grid-cols-3", className)}
      {...rest}
    >
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded px-3 py-2 text-start ring-[1px] ring-border transition-colors duration-200 hover:bg-secondary",
            "data-[state=checked]:ring-2 data-[state=checked]:ring-primary",
          )}
        >
          <CircleCheck className="absolute right-0 top-0 h-6 w-6 -translate-y-1/2 translate-x-1/2 fill-primary stroke-background text-primary group-data-[state=unchecked]:hidden" />

          {option.icon}
          <span className="text-sm font-semibold tracking-tight">
            {option.label}
          </span>
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

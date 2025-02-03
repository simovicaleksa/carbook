import React from "react";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { CircleCheck } from "lucide-react";

import { eventTypes } from "~/lib/data/event-types";
import { cn } from "~/lib/utils";

export default function EventTypeRadio({
  className,
  ...rest
}: RadioGroup.RadioGroupProps) {
  return (
    <RadioGroup.Root
      className={cn("grid w-full grid-cols-2 gap-4 sm:grid-cols-3", className)}
      {...rest}
    >
      {eventTypes.map((option) => (
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

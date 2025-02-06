import React, {
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { CircleCheck, type LucideProps } from "lucide-react";

import { eventTypes } from "~/lib/data/event-types";
import { cn } from "~/lib/utils";
import { getEventTypeIcon } from "~/lib/utils/icon";

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
        <EventTypeRadioItem key={option.value} option={option} />
      ))}
    </RadioGroup.Root>
  );
}

function EventTypeRadioItem({
  option,
}: {
  option: {
    value: string;
    label: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  };
}) {
  const Icon = getEventTypeIcon(option.value);

  return (
    <RadioGroup.Item
      key={option.value}
      value={option.value}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded px-3 py-2 text-start ring-[1px] ring-border transition-colors duration-200 hover:bg-secondary",
        "data-[state=checked]:ring-2 data-[state=checked]:ring-primary",
      )}
    >
      <CircleCheck className="absolute right-0 top-0 h-6 w-6 -translate-y-1/2 translate-x-1/2 fill-primary stroke-background text-primary group-data-[state=unchecked]:hidden" />

      <Icon className="mb-2 size-7 text-muted-foreground sm:size-5" />
      <span className="text-sm font-medium tracking-tight">{option.label}</span>
    </RadioGroup.Item>
  );
}

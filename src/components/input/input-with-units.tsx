import { useRef } from "react";
import { type InputProps } from "react-day-picker";

import { Input } from "../ui/input";

type InputWithUnitsProps = InputProps & {
  units?: string;
};

export default function InputWithUnits({
  units,
  ...props
}: InputWithUnitsProps) {
  const unitsRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="relative flex flex-row items-center overflow-hidden rounded-md">
      <Input
        style={{
          paddingRight: unitsRef?.current?.offsetWidth ?? 0,
        }}
        {...props}
      />
      {units && (
        <span
          ref={unitsRef}
          className="absolute right-0 ml-2 flex h-full w-fit items-center justify-center bg-secondary px-3 text-sm text-muted-foreground"
        >
          {units}
        </span>
      )}
    </div>
  );
}

import { type SelectProps } from "@radix-ui/react-select";

import { units } from "~/lib/data/units";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function UnitsSelect(props: SelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select units" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Units</SelectLabel>
          <SelectSeparator />
          {units.map((unit) => (
            <SelectItem key={unit} value={unit} className="capitalize">
              {unit}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

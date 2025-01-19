import { type SelectProps } from "@radix-ui/react-select";

import { makes } from "~/lib/data/makes";

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

export default function MakeSelect(props: SelectProps) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select make" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Make</SelectLabel>
          <SelectSeparator />
          {makes.map((make) => (
            <SelectItem key={make.name} value={make.name}>
              {make.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

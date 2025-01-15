import { type SelectProps } from "@radix-ui/react-select";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function RoleSelect(props: SelectProps) {
  return (
    <Select name="role" {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select role</SelectLabel>
          <SelectItem value="user">user</SelectItem>
          <SelectItem value="mechanic">mechanic</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

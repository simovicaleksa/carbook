"use client";

import { useChart } from "~/context/chart-context";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const options = ["week", "month", "1yr", "5yr", "10yr", "all"] as const;

export function ChartTimelineSelect() {
  const { timeframe, setTimeframe } = useChart();

  return (
    <div>
      <div className="hidden w-fit flex-row items-center gap-2 lg:flex">
        {options.map((option) => (
          <Button
            key={option}
            onClick={() => setTimeframe(option)}
            variant={timeframe === option ? "default" : "outline"}
            size={"sm"}
          >
            {option}
          </Button>
        ))}
      </div>
      <Select
        value={timeframe}
        onValueChange={(v) =>
          setTimeframe(v as "week" | "month" | "1yr" | "5yr" | "10yr" | "all")
        }
      >
        <SelectTrigger className="w-fit lg:hidden">
          <SelectValue placeholder="Timeline" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

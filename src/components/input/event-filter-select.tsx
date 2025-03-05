"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { type HistoryEntryType } from "~/types/history";

const tags = [
  "refuel",
  "service",
  "repair",
  "replacement",
  "purchase",
  "tune-up",
  "wash",
  "milestone",
  "inspection",
  "upgrade",
  "accident",
  "other",
];

export default function EventFilterSelect(props: {
  filters: HistoryEntryType[];
  setFilters: Dispatch<SetStateAction<HistoryEntryType[]>>;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      const updateWidth = () => {
        if (triggerRef.current) {
          setWidth(triggerRef.current.offsetWidth);
        }
      };

      updateWidth();

      // Handle window resize
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  const { filters, setFilters } = props;

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setFilters((prev) => [...prev, tag as HistoryEntryType]);
    } else {
      setFilters(filters.filter((t) => t !== tag));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="justify-start font-normal"
          ref={triggerRef}
        >
          Select event types{" "}
          <span className="text-sm text-muted-foreground">
            ( {filters.length === 0 ? "all" : filters.length} )
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          width: `${width}px`,
        }}
      >
        <DropdownMenuLabel>Event types</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tags.map((tag) => (
          <DropdownMenuCheckboxItem
            className="capitalize"
            checked={filters.includes(tag as HistoryEntryType)}
            key={tag}
            onCheckedChange={(checked) => handleTagChange(tag, checked)}
            // Prevent the dropdown menu from closing when the checkbox is clicked
            onSelect={(e) => e.preventDefault()}
          >
            {tag}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

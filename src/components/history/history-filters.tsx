"use client";

import { useState } from "react";

import { useEvents } from "~/context/events-context";
import { useHistoryEventFilters } from "~/context/history-event-filters-context";

import { useUrl } from "~/hooks/use-url";

import EventFilterSelect from "../input/event-filter-select";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function HistoryFilters() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    sortBy,
    filters,
    search,
    setFilters,
    setSortBy,
    setSearch,
    resetFilters,
  } = useHistoryEventFilters();
  const { total } = useEvents();
  const { setParams } = useUrl();

  function handleResetFilters() {
    setParams(
      {
        search: "",
        sortBy: "newest",
        page: "1",
        filters: "",
      },
      "push",
    );

    resetFilters();
  }

  function handleApplyFilters() {
    setParams(
      {
        search,
        sortBy,
        page: "1",
        filters: filters.toString(),
      },
      "push",
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mx-auto mb-10 max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Filters</CardTitle>
            <CardDescription>{total} events found</CardDescription>
          </div>
          <CollapsibleTrigger asChild>
            <Button size={"sm"} variant={"link"}>
              {isOpen ? "Hide filters" : "Show filters"}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="grid place-items-end gap-5 *:w-full md:grid-cols-2">
            <div className="flex flex-col gap-2 md:col-span-full">
              <Label>Search</Label>
              <Input
                value={search}
                onChange={(s) => setSearch(s.target.value)}
                placeholder="Search events..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Sort by</Label>
              <Select
                value={sortBy}
                onValueChange={(s) => setSortBy(s as "newest" | "oldest")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest on top</SelectItem>
                  <SelectItem value="oldest">Oldest on top</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Event types</Label>
              <EventFilterSelect filters={filters} setFilters={setFilters} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-end gap-2 *:w-full md:*:w-auto">
            <Button onClick={handleResetFilters} variant={"outline"}>
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>Apply filters</Button>
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

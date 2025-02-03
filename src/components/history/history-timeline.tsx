"use client";

import { Calendar, Milestone } from "lucide-react";

import { cn } from "~/lib/utils";
import { convertToLocalDateString } from "~/lib/utils/date";
import { getEventTypeIcon } from "~/lib/utils/icon";
import { formatNumber } from "~/lib/utils/number";

import { type EventType, useEvents } from "~/context/events-context";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function HistoryTimeline() {
  const { events } = useEvents();

  return (
    <div className="relative size-full">
      <span className="absolute left-0 right-0 mx-auto h-full w-0.5 bg-border" />
      <div className="mx-auto flex max-w-4xl flex-col justify-between gap-10">
        {events.map((event, idx) => (
          <HistoryTimelineItem
            key={event.id}
            event={event}
            isLeft={idx % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
}

export function HistoryTimelineItem({
  event,
  isLeft,
}: {
  event: EventType;
  isLeft?: boolean;
}) {
  const Icon = getEventTypeIcon(event.type);

  if (!Icon) return null;

  return (
    <div
      className={cn("flex flex-row gap-8", {
        "flex-row-reverse": isLeft,
      })}
    >
      <div className="hidden w-full md:block"></div>
      <div className="z-10 flex aspect-square size-fit items-center justify-center rounded-full bg-primary p-3 text-primary-foreground shadow-xl">
        <Icon className="size-5" />
      </div>
      <Card className="w-full">
        <CardContent className="px-0">
          <CardHeader>
            <CardTitle className="capitalize">{event.type}</CardTitle>
            <CardDescription className="flex flex-row gap-5">
              <span className="flex flex-row items-center gap-1">
                <Calendar className="size-4" />
                {convertToLocalDateString(event.date, true)}
              </span>
              <span className="flex flex-row items-center gap-1">
                <Milestone className="size-4" />
                {formatNumber(event.atDistanceTraveled)} km
              </span>
            </CardDescription>
          </CardHeader>
          <CardFooter className="pb-0">
            {event.description?.length ? (
              <p className="line-clamp-3 font-mono text-muted-foreground">
                {event.description}
              </p>
            ) : (
              <p className="line-clamp-3 font-mono italic text-muted-foreground">
                No description.
              </p>
            )}
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

export function HistoryTimelineLoadMore() {
  return <Button>Load more</Button>;
}

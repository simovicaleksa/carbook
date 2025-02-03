"use client";

import { Calendar, Edit, Milestone } from "lucide-react";

import { cn } from "~/lib/utils";
import { convertToLocalDateString } from "~/lib/utils/date";
import { getEventTypeIcon } from "~/lib/utils/icon";
import { formatNumber } from "~/lib/utils/number";

import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
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
      <div className="mx-auto flex w-full max-w-4xl flex-col justify-between gap-10">
        {events.map((event, idx) => (
          <HistoryTimelineItem
            key={event.id}
            event={event}
            isLeft={idx % 2 === 0}
          />
        ))}
      </div>
      <HistoryTimelineLoadMore />
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
  const { toggleOpen } = useEditHistoryDialog();
  const Icon = getEventTypeIcon(event.type);

  const handleEdit = () => {
    toggleOpen(event);
  };

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
      <div className="group relative w-full duration-200 ease-out hover:scale-105">
        <Card
          className="cursor-pointer shadow-xl"
          role="button"
          tabIndex={0}
          aria-label="View event details"
        >
          <CardContent className="px-0">
            <CardHeader>
              <CardTitle className="mb-2 capitalize">{event.type}</CardTitle>
              <CardDescription className="flex flex-row gap-5 font-medium">
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
        <div className="absolute -right-5 bottom-0 top-0 z-10 my-auto flex h-fit flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant={"outline"}
            className="rounded-full shadow-md"
            size={"icon"}
            onClick={handleEdit}
          >
            <span className="sr-only">Edit event</span>
            <Edit />
          </Button>
          {/* <Button
            variant={"destructive"}
            className="rounded-full shadow-md"
            size={"icon"}
          >
            <span className="sr-only">Edit event</span>
            <Trash2 />
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export function HistoryTimelineLoadMore() {
  return (
    <div className="mt-10 flex w-full items-center justify-center">
      <Button className="z-10 mx-auto w-fit">Load more</Button>
    </div>
  );
}

"use client";

import { Calendar, Edit, Milestone } from "lucide-react";

import { cn } from "~/lib/utils";
import { convertToLocalDateString } from "~/lib/utils/date";
import { getEventTypeIcon } from "~/lib/utils/icon";
import { formatPrice } from "~/lib/utils/money";

import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
import { type EventType, useEvents } from "~/context/events-context";
import { useInspectEventDialog } from "~/context/inspect-event-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";

import { useUnits } from "~/hooks/use-units";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function Timeline() {
  const { events } = useEvents();

  return (
    <div className="relative size-full">
      <span className="absolute left-5 mx-auto h-full w-0.5 bg-border lg:left-0 lg:right-0" />
      <div className="mx-auto flex w-full max-w-4xl flex-col justify-between gap-10">
        {events.map((event, idx) => (
          <TimelineItem key={event.id} event={event} isLeft={idx % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

export function TimelineItem({
  event,
  isLeft,
}: {
  event: EventType;
  isLeft?: boolean;
}) {
  const { toggleOpen: toggleEditDialog } = useEditHistoryDialog();
  const { toggleOpen: toggleInspectDialog } = useInspectEventDialog();
  const { setEvent } = useSelectedEvent();
  const Icon = getEventTypeIcon(event.type);
  const { formatDistanceString } = useUnits();

  const handleEdit = () => {
    setEvent(event);
    toggleEditDialog();
  };

  const handleInspect = () => {
    setEvent(event);
    toggleInspectDialog(event);
  };

  if (!Icon) return null;

  return (
    <div
      className={cn("flex flex-row gap-8", {
        "lg:flex-row-reverse": isLeft,
      })}
    >
      <div className="hidden w-full lg:block"></div>
      <div className="z-10 flex aspect-square size-fit items-center justify-center rounded-full bg-primary p-3 text-primary-foreground shadow-xl">
        <Icon className="size-5" />
      </div>
      <div className="group relative mr-5 w-full duration-200 ease-out lg:mr-0">
        <button className="w-full text-start" onClick={handleInspect}>
          <Card className="cursor-pointer shadow-xl duration-200 hover:bg-secondary/50">
            <CardContent className="px-0">
              <CardHeader>
                <CardTitle className="mb-2 flex w-full flex-row items-center justify-between capitalize">
                  <span>{event.type}</span>
                  {event?.cost?.amount ? (
                    <Badge className="rounded-md text-base">
                      {formatPrice(event.cost.amount, event.cost.currency)}
                    </Badge>
                  ) : null}
                </CardTitle>
                <CardDescription className="flex flex-row gap-5 text-xs font-medium sm:text-sm">
                  <span className="flex flex-row items-center gap-1">
                    <Calendar className="size-4" />
                    {convertToLocalDateString(event.date, true)}
                  </span>
                  <span className="flex flex-row items-center gap-1">
                    <Milestone className="size-4" />
                    {formatDistanceString(event.atDistanceTraveled)}
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
        </button>

        <div className="absolute -right-5 bottom-0 top-0 z-10 my-auto flex h-fit flex-col gap-2 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
          <Button
            variant={"outline"}
            className="scale-105 rounded-full shadow-md"
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

export function TimelineLoadMore() {
  return (
    <div className="mt-10 flex w-full items-center lg:justify-center">
      <Button className="z-10 w-fit">Load more</Button>
    </div>
  );
}

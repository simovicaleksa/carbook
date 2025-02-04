"use client";

import { Calendar, Edit, Milestone, Trash2 } from "lucide-react";

import { convertToLocalDateString } from "~/lib/utils/date";
import { getEventTypeIcon } from "~/lib/utils/icon";
import { formatNumber } from "~/lib/utils/number";

import { useDeleteEventDialog } from "~/context/delete-event-dialog-context";
import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
import { useInspectEventDialog } from "~/context/inspect-event-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export default function InspectEventDialog() {
  const { isOpen, setIsOpen } = useInspectEventDialog();
  const { event } = useSelectedEvent();
  const { toggleOpen: toggleEditDialog } = useEditHistoryDialog();
  const { toggleOpen: toggleDeleteDialog } = useDeleteEventDialog();

  if (!event?.id) return null;
  const Icon = getEventTypeIcon(event.type);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-3xl p-0">
        <ScrollArea className="max-h-screen">
          <DialogHeader className="mb-3 px-5 pt-10">
            <DialogTitle className="flex flex-row items-center gap-2 text-3xl capitalize">
              <Icon className="size-7" />
              {event.type}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-10 px-5">
            <div className="flex flex-row justify-between gap-1 font-mono text-lg tracking-tighter text-muted-foreground">
              <span className="flex flex-row items-center gap-2">
                <Calendar className="size-5" />
                {convertToLocalDateString(event.date, true)}
              </span>
              <span className="flex flex-row items-center gap-2">
                <Milestone className="size-5" />
                {formatNumber(event.atDistanceTraveled)} km
              </span>
            </div>

            <div className="rounded-md bg-secondary p-5 text-sm">
              <pre className="whitespace-pre-wrap leading-5">
                {event.description?.length ? (
                  event.description
                ) : (
                  <span className="italic">No description.</span>
                )}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-2 p-5 sm:space-x-0">
            <Button
              variant={"outline"}
              type="button"
              onClick={toggleEditDialog}
            >
              <Edit />
              Edit
            </Button>
            <Button
              variant={"destructive"}
              type="button"
              onClick={toggleDeleteDialog}
            >
              <Trash2 />
              Delete event
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

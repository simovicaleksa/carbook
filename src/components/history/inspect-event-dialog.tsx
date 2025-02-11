"use client";

import { Calendar, Edit, Milestone, Trash2 } from "lucide-react";

import { convertToLocalDateString } from "~/lib/utils/date";
import { getEventTypeIcon } from "~/lib/utils/icon";
import { formatPrice } from "~/lib/utils/money";

import { useDeleteEventDialog } from "~/context/delete-event-dialog-context";
import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
import { useInspectEventDialog } from "~/context/inspect-event-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";
import { useUserProfile } from "~/context/user-profile-context";

import { useUnits } from "~/hooks/use-units";

import { Badge } from "../ui/badge";
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
  const userProfile = useUserProfile();
  const { formatDistanceString } = useUnits();

  if (!event?.id) return null;
  const Icon = getEventTypeIcon(event.type);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-3xl p-0">
        <ScrollArea className="max-h-screen">
          <DialogHeader className="mb-3 px-5 pt-10">
            <DialogTitle className="flex flex-row items-center justify-between text-3xl capitalize">
              <span className="flex flex-row items-center gap-2">
                <Icon className="size-7" />
                {event.type}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-10 p-5">
            <div className="flex flex-row items-start justify-between gap-1 font-mono text-lg tracking-tighter text-muted-foreground">
              <div className="flex flex-col gap-2">
                <span className="flex flex-row items-center gap-2">
                  <Calendar className="size-5" />
                  {convertToLocalDateString(event.date, true)}
                </span>
                <span className="flex flex-row items-center gap-2">
                  <Milestone className="size-5" />
                  {formatDistanceString(event.atDistanceTraveled)}
                </span>
              </div>
              <span className="p-5 text-xl font-medium">
                {formatPrice(
                  event?.cost?.amount ?? 0,
                  event?.cost?.currency ?? userProfile.preferredCurrency,
                )}
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

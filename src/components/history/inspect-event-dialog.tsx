"use client";

import { Calendar, Milestone } from "lucide-react";

import { convertToLocalDateString } from "~/lib/utils/date";
import { getEventTypeIcon } from "~/lib/utils/icon";
import { formatPrice } from "~/lib/utils/money";

import { useInspectEventDialog } from "~/context/inspect-event-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";
import { useUserProfile } from "~/context/user-profile-context";

import { useIsMobile } from "~/hooks/use-mobile";
import { useUnits } from "~/hooks/use-units";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export default function InspectEventDialog() {
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen } = useInspectEventDialog();
  const { event } = useSelectedEvent();
  const userProfile = useUserProfile();
  const { formatDistanceString } = useUnits();

  if (!event?.id) return null;
  const Icon = getEventTypeIcon(event.type);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-3xl p-0">
        <ScrollArea className="max-h-screen">
          <DialogHeader className="mb-3 flex flex-col items-center gap-5 px-5 pt-10">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <span className="flex size-fit flex-row items-center gap-2 rounded-lg bg-primary p-3 text-primary-foreground">
                <Icon className="size-6 sm:size-8" />
              </span>
              <DialogTitle className="text-2xl capitalize sm:text-4xl">
                {event.type}
              </DialogTitle>
            </div>

            <DialogDescription className="flex w-full flex-row items-center justify-between text-center *:text-sm sm:gap-3 *:sm:text-xl">
              <span className="flex w-full flex-row items-center justify-end gap-2 whitespace-nowrap text-center font-mono text-muted-foreground">
                <Calendar className="size-3 sm:size-5" strokeWidth={2} />
                {convertToLocalDateString(event.date, true)}
              </span>
              <span className="mx-5 flex w-full max-w-[100px] flex-row items-center justify-center rounded-lg text-center font-mono text-muted-foreground">
                {formatPrice(
                  event?.cost?.amount ?? 0,
                  event?.cost?.currency ?? userProfile.preferredCurrency,
                )}
              </span>
              <span className="flex w-full flex-row items-center justify-start gap-2 whitespace-nowrap text-center font-mono text-muted-foreground">
                <Milestone className="size-3 sm:size-5" strokeWidth={2} />
                {formatDistanceString(event.atDistanceTraveled)}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-10 p-5 sm:p-10">
            <ScrollArea>
              <div className="size-full rounded-md bg-secondary/70 p-5 text-sm">
                <pre className="size-full whitespace-pre-wrap text-base leading-5 tracking-tight sm:text-lg">
                  {event.description?.length ? (
                    event.description
                  ) : (
                    <span className="italic">No description.</span>
                  )}
                </pre>
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="p-5 pt-0">
            <DialogClose asChild>
              <Button
                className="w-full sm:w-fit"
                variant={"outline"}
                size={isMobile ? "default" : "lg"}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

import EditHistoryEventForm from "./edit-history-event-form";

export default function EditHistoryDialog() {
  const { setIsOpen, isOpen } = useEditHistoryDialog();
  const { event } = useSelectedEvent();

  if (!event?.id) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-3xl">
        <ScrollArea className="max-h-screen">
          <DialogHeader>
            <DialogTitle>Edit History Event</DialogTitle>
          </DialogHeader>
          <EditHistoryEventForm />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

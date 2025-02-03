"use client";

import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import EditHistoryEventForm from "./edit-history-event-form";

export default function EditHistoryDialog() {
  const { event, setIsOpen, isOpen } = useEditHistoryDialog();

  if (!event?.id) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit History Event</DialogTitle>
        </DialogHeader>
        <EditHistoryEventForm />
      </DialogContent>
    </Dialog>
  );
}

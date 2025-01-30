"use client";

import { useAddHistoryEventDialog } from "~/context/add-history-event-dialog-context";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";

import AddHistoryEventForm from "./add-history-event-form";

export default function AddHistoryEventDialog() {
  const { isOpen, setIsOpen } = useAddHistoryEventDialog();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-full max-w-3xl">
        <ScrollArea className="max-h-screen">
          <AlertDialogHeader>
            <AlertDialogTitle>Add event</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new event to your car history
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AddHistoryEventForm />
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}

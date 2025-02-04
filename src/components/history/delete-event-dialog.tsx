"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import { toast } from "sonner";

import { deleteVehicleHistoryEvent } from "~/app/dashboard/history/actions";

import { useDeleteEventDialog } from "~/context/delete-event-dialog-context";
import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
import { useInspectEventDialog } from "~/context/inspect-event-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";

import { useLoading } from "~/hooks/use-loading";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import LoadingButton from "../ui/loading-button";

export default function DeleteEventDialog() {
  const { setIsOpen: setInspectDialogIsOpen } = useInspectEventDialog();
  const { setIsOpen: setEditDialogIsOpen } = useEditHistoryDialog();
  const { isOpen, setIsOpen } = useDeleteEventDialog();
  const { event } = useSelectedEvent();
  const loading = useLoading();
  const router = useRouter();

  const [isConfirmed, setIsConfirmed] = useState(false);

  function onConfirmChange() {
    setIsConfirmed((prev) => !prev);
  }

  function onEventDestroy() {
    setEditDialogIsOpen(false);
    setInspectDialogIsOpen(false);
    setIsOpen(false);
    setIsOpen(false);
    router.refresh();
  }

  async function onSubmit() {
    if (!event?.id) return;

    loading.start();

    const res = await deleteVehicleHistoryEvent(event.id);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error?.message,
      });
    } else {
      toast.success("Success", {
        description: "Event successfully deleted",
      });
      onEventDestroy();
    }

    loading.end();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this event?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            checked={isConfirmed}
            onCheckedChange={onConfirmChange}
            id="confirmation"
          />
          <Label htmlFor="confirmation">This action cannot be undone.</Label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <LoadingButton
            isLoading={loading.isLoading}
            variant={"destructive"}
            disabled={!isConfirmed}
            onClick={onSubmit}
          >
            Delete event
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

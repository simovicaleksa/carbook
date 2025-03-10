"use client";

import { useAddVehicleDialog } from "~/context/add-vehicle-dialog-context";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ScrollArea } from "../ui/scroll-area";

import AddVehicleDialogForm from "./add-vehicle-dialog-form";

export default function AddVehicleDialog() {
  const { isOpen, setIsOpen } = useAddVehicleDialog();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl p-0">
        <ScrollArea className="max-h-[92vh]">
          <AlertDialogHeader className="p-5">
            <AlertDialogTitle>Add vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new vehicle to your account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-5">
            <AddVehicleDialogForm />
          </div>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}

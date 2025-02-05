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

import AddVehicleForm from "./add-vehicle-form";

export default function AddVehicleDialog() {
  const { isOpen, setIsOpen } = useAddVehicleDialog();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-2xl p-0">
        <ScrollArea className="max-h-screen">
          <AlertDialogHeader className="p-5">
            <AlertDialogTitle>Add vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new vehicle to your account
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-5">
            <AddVehicleForm />
          </div>
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useAddVehicleDialog } from "~/context/add-vehicle-dialog-context";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import AddVehicleForm from "./add-vehicle-form";

export default function AddVehicleDialog() {
  const { isOpen, setIsOpen } = useAddVehicleDialog();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add vehicle</AlertDialogTitle>
          <AlertDialogDescription>
            Add a new vehicle to your account
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AddVehicleForm />
      </AlertDialogContent>
    </AlertDialog>
  );
}

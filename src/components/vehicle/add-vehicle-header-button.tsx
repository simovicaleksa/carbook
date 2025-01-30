"use client";

import { Plus } from "lucide-react";

import { useAddVehicleDialog } from "~/context/add-vehicle-dialog-context";

import { Button } from "../ui/button";

export default function AddVehicleHeaderButton() {
  const { toggleOpen } = useAddVehicleDialog();

  return (
    <Button size={"sm"} onClick={toggleOpen}>
      <Plus />
      Add vehicle
    </Button>
  );
}

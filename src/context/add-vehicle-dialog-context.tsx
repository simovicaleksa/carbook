"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import AddVehicleDialog from "~/components/vehicle/add-vehicle-dialog";

type AddVehicleDialogType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
};

const AddVehicleDialogContext = createContext<AddVehicleDialogType | null>(
  null,
);

export function AddVehicleDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <AddVehicleDialogContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      <AddVehicleDialog />
      {children}
    </AddVehicleDialogContext.Provider>
  );
}

export function useAddVehicleDialog() {
  const context = use(AddVehicleDialogContext);

  if (!context) {
    throw new Error(
      "useAddVehicleDialog must be used within a AddVehicleDialogProvider",
    );
  }

  return context;
}

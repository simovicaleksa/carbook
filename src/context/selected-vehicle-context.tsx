"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useEffect,
  useState,
} from "react";

import { type InferSelectModel } from "drizzle-orm";

import { updateUserSelectedVehicle } from "~/app/dashboard/actions";

import { type vehicleTable } from "~/db/_schema";

export type VehicleType = InferSelectModel<typeof vehicleTable>;

type SidebarSelectedVehicleType = {
  selectedVehicle: VehicleType | null;
  setSelectedVehicle: Dispatch<SetStateAction<VehicleType | null>>;
  changeSelectedVehicle: (vehicle: VehicleType) => Promise<void>;
};

const SelectedVehicleContext = createContext<SidebarSelectedVehicleType | null>(
  null,
);

export function SelectedVehicleProvider({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: InferSelectModel<typeof vehicleTable> | null;
}) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(
    null,
  );

  useEffect(() => {
    setSelectedVehicle(defaultValue);
  }, [defaultValue]);

  async function changeSelectedVehicle(newSelectedVehicle: VehicleType) {
    const res = await updateUserSelectedVehicle(newSelectedVehicle.id);
    if (res.ok) {
      setSelectedVehicle(newSelectedVehicle);
    }
  }

  return (
    <SelectedVehicleContext.Provider
      value={{ selectedVehicle, changeSelectedVehicle, setSelectedVehicle }}
    >
      {children}
    </SelectedVehicleContext.Provider>
  );
}

export function useSelectedVehicle() {
  const context = use(SelectedVehicleContext);

  if (!context) {
    throw new Error(
      "useSelectedVehicle must be used within a SelectedVehicleProvider",
    );
  }

  return context;
}

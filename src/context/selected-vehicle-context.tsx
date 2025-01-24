"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import { type InferSelectModel } from "drizzle-orm";

import { type vehicleTable } from "~/db/_schema";

export type VehicleType = InferSelectModel<typeof vehicleTable>;

type SidebarSelectedVehicleType = {
  selectedVehicle: VehicleType | null;
  setSelectedVehicle: Dispatch<SetStateAction<VehicleType | null>>;
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
    defaultValue ?? null,
  );

  return (
    <SelectedVehicleContext.Provider
      value={{ selectedVehicle, setSelectedVehicle }}
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

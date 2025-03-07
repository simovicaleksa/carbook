"use client";

import { useRouter } from "next/navigation";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useEffect,
  useState,
} from "react";

import { type InferSelectModel } from "drizzle-orm";

import { updateUserSelectedVehicle } from "~/app/(dashboard)/dashboard/actions";

import { type vehicleTable } from "~/db/_schema";

import { useLoading } from "~/hooks/use-loading";

export type VehicleType = InferSelectModel<typeof vehicleTable>;

type SidebarSelectedVehicleType = {
  selectedVehicle: VehicleType | null;
  setSelectedVehicle: Dispatch<SetStateAction<VehicleType | null>>;
  changeSelectedVehicle: (vehicle: VehicleType) => Promise<void>;
  isLoading: boolean;
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
  const loading = useLoading();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(
    null,
  );

  const router = useRouter();

  useEffect(() => {
    setSelectedVehicle(defaultValue);
  }, [defaultValue, loading]);

  async function changeSelectedVehicle(newSelectedVehicle: VehicleType) {
    loading.start();
    const res = await updateUserSelectedVehicle(newSelectedVehicle.id);
    if (res.ok) {
      setSelectedVehicle(newSelectedVehicle);
      router.refresh();
    }
    loading.end();
  }

  return (
    <SelectedVehicleContext.Provider
      value={{
        selectedVehicle,
        changeSelectedVehicle,
        setSelectedVehicle,
        isLoading: loading.isLoading,
      }}
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

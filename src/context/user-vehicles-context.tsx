"use client";

import { createContext, use } from "react";

import { type InferSelectModel } from "drizzle-orm";

import { type vehicleTable } from "~/db/_schema";

type UserVehiclesContextType = {
  vehicles: InferSelectModel<typeof vehicleTable>[];
};

const UserVehiclesContext = createContext<UserVehiclesContextType | null>(null);

export function UserVehiclesProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: UserVehiclesContextType;
}) {
  return (
    <UserVehiclesContext.Provider value={value}>
      {children}
    </UserVehiclesContext.Provider>
  );
}

export function useUserVehicles() {
  const context = use(UserVehiclesContext);

  if (!context) {
    throw new Error(
      "useUserVehicles must be used within a UserVehiclesProvider",
    );
  }

  return context;
}

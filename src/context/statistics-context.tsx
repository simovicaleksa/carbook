"use client";

import { createContext, use } from "react";

import { type InferSelectModel } from "drizzle-orm";

import { type historyTable } from "~/db/_schema";

import {
  type VehicleSpendingGroupedByCurrency,
  type VehicleSpendingGroupedByType,
} from "~/types/money";

type StatisticsContextType = {
  vehicleSpendingGroupedByCurrency:
    | VehicleSpendingGroupedByCurrency[]
    | undefined;
  vehicleSpendingGroupedByType: VehicleSpendingGroupedByType[] | undefined;
  vehicleAccidents: InferSelectModel<typeof historyTable>[] | undefined;
};

const StatisticsContext = createContext<StatisticsContextType | null>(null);

export function StatisticsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: StatisticsContextType;
}) {
  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = use(StatisticsContext);

  if (!context) {
    throw new Error("useStatistics must be used within a StatisticsProvider");
  }

  return context;
}

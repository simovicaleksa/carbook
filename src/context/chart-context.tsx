"use client";

import { createContext, use, useState } from "react";

import { type TimeframeType } from "~/types/statistics";

type ChartSettings = {
  timeframe: TimeframeType;
  setTimeframe: (timeframe: ChartSettings["timeframe"]) => void;
};

const ChartContext = createContext<ChartSettings | null>(null);

export function ChartProvider({ children }: { children: React.ReactNode }) {
  const [timeframe, setTimeframe] = useState<ChartSettings["timeframe"]>("all");

  return (
    <ChartContext.Provider
      value={{
        timeframe,
        setTimeframe,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  const context = use(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a ChartProvider");
  }

  return context;
}

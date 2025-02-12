"use client";

import { createContext, use } from "react";

import { type moneyTable, type historyTable } from "~/db/_schema";

export type EventType = typeof historyTable.$inferSelect & {
  cost?: typeof moneyTable.$inferSelect | null;
};

type EventContextType = {
  events: EventType[];
  total: number;
};

const EventsContext = createContext<EventContextType | null>(null);

export function EventsProvider({
  children,
  events,
  total,
}: {
  children: React.ReactNode;
  events: EventType[];
  total: number;
}) {
  return (
    <EventsContext.Provider value={{ events, total }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = use(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used within a EventsProvider");
  }

  return context;
}

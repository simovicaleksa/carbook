"use client";

import { createContext, use, useEffect, useState } from "react";

import { type moneyTable, type historyTable } from "~/db/_schema";

export type EventType = typeof historyTable.$inferSelect & {
  cost?: typeof moneyTable.$inferSelect | null;
};

type EventContextType = {
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
};

const EventsContext = createContext<EventContextType | null>(null);

export function EventsProvider({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: EventType[];
}) {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    setEvents(defaultValue);
  }, [defaultValue]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
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

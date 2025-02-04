"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import { type EventType } from "./events-context";

type SelectedEventContextType = {
  event: EventType | null;
  setEvent: Dispatch<SetStateAction<EventType | null>>;
};

const SelectedEventContext = createContext<SelectedEventContextType | null>(
  null,
);

export function SelectedEventProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [event, setEvent] = useState<EventType | null>(null);

  return (
    <SelectedEventContext.Provider
      value={{
        event,
        setEvent,
      }}
    >
      {children}
    </SelectedEventContext.Provider>
  );
}

export function useSelectedEvent() {
  const context = use(SelectedEventContext);

  if (!context) {
    throw new Error(
      "useSelectedEvent must be used within a SelectedEventProvider",
    );
  }

  return context;
}

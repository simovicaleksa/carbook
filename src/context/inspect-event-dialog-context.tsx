"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import InspectEventDialog from "~/components/history/inspect-event-dialog";

import { type EventType } from "./events-context";
import { useSelectedEvent } from "./selected-event-context";

type InspectEventDialogContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: (event: EventType) => void;
};

const InspectEventDialogContext =
  createContext<InspectEventDialogContextType | null>(null);

export function InspectEventDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { setEvent } = useSelectedEvent();

  const toggleOpen = (someEvent: EventType) => {
    setEvent(someEvent);
    setIsOpen((prev) => !prev);
  };

  return (
    <InspectEventDialogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleOpen,
      }}
    >
      <InspectEventDialog />
      {children}
    </InspectEventDialogContext.Provider>
  );
}

export function useInspectEventDialog() {
  const context = use(InspectEventDialogContext);

  if (!context) {
    throw new Error(
      "useInspectEventDialog must be used within a InspectEventDialogProvider",
    );
  }

  return context;
}

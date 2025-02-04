"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import { type EventType } from "./events-context";

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

  const toggleOpen = () => {
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

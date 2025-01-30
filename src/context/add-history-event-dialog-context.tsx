"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import AddHistoryEventDialog from "~/components/history/add-history-event-dialog";

type AddHistoryEventDialogType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
};

const AddHistoryEventDialogContext =
  createContext<AddHistoryEventDialogType | null>(null);

export function AddHistoryEventDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <AddHistoryEventDialogContext.Provider
      value={{ isOpen, setIsOpen, toggleOpen }}
    >
      <AddHistoryEventDialog />
      {children}
    </AddHistoryEventDialogContext.Provider>
  );
}

export function useAddHistoryEventDialog() {
  const context = use(AddHistoryEventDialogContext);

  if (!context) {
    throw new Error(
      "useAddHistoryEventDialog must be used within a AddHistoryEventDialogProvider",
    );
  }

  return context;
}

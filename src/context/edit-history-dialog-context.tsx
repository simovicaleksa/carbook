"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import EditHistoryDialog from "~/components/history/edit-event-dialog";

import { type EventType } from "./events-context";
import { useSelectedEvent } from "./selected-event-context";

type EditHistoryDialogType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: (event: EventType) => void;
};

const EditHistoryDialogContext = createContext<EditHistoryDialogType | null>(
  null,
);

export function EditHistoryDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setEvent } = useSelectedEvent();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (someEvent: EventType) => {
    setEvent(someEvent);
    setIsOpen((prev) => !prev);
  };

  return (
    <EditHistoryDialogContext.Provider
      value={{ isOpen, setIsOpen, toggleOpen }}
    >
      <EditHistoryDialog />
      {children}
    </EditHistoryDialogContext.Provider>
  );
}

export function useEditHistoryDialog() {
  const context = use(EditHistoryDialogContext);

  if (!context) {
    throw new Error(
      "useEditHistoryDialog must be used within a EditHistoryDialogProvider",
    );
  }

  return context;
}

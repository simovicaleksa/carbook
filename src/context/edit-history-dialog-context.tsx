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

type EditHistoryDialogType = {
  event: EventType | null;
  setEvent: Dispatch<SetStateAction<EventType | null>>;
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
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<EventType | null>(null);

  const toggleOpen = (someEvent: EventType) => {
    setEvent(someEvent);
    setIsOpen((prev) => !prev);
  };

  return (
    <EditHistoryDialogContext.Provider
      value={{ isOpen, event, setIsOpen, toggleOpen, setEvent }}
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

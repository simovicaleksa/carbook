"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

type DeleteEventDialogContextType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
};

const DeleteEventDialogContext =
  createContext<DeleteEventDialogContextType | null>(null);

export function DeleteEventDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <DeleteEventDialogContext.Provider
      value={{ isOpen, setIsOpen, toggleOpen }}
    >
      {children}
    </DeleteEventDialogContext.Provider>
  );
}

export function useDeleteEventDialog() {
  const context = use(DeleteEventDialogContext);

  if (!context) {
    throw new Error(
      "useDeleteEventDialog must be used within a DeleteEventDialogProvider",
    );
  }

  return context;
}

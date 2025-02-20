"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

type EditHistoryDialogType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
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

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <EditHistoryDialogContext.Provider
      value={{ isOpen, setIsOpen, toggleOpen }}
    >
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

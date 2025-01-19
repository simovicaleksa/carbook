"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import SignOutDialog from "~/components/auth/signout-dialog";

type SignoutDialogType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  toggleOpen: () => void;
};

const SignoutDialogContext = createContext<SignoutDialogType | null>(null);

export function SignoutDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <SignoutDialogContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      <SignOutDialog />
      {children}
    </SignoutDialogContext.Provider>
  );
}

export function useSignoutDialog() {
  const context = use(SignoutDialogContext);

  if (!context) {
    throw new Error(
      "useSignoutDialog must be used within a SignoutDialogProvider",
    );
  }

  return context;
}

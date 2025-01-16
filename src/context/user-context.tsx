"use client";

import { createContext, use } from "react";

import { type User } from "~/lib/server/auth";

const UserContext = createContext<User | null>(null);

export function UserProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: User;
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = use(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

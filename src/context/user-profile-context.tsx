"use client";

import { createContext, use } from "react";

type UserProfileType = {
  preferredCurrency: string;
  preferredUnits: "metric" | "imperial";
  selectedVehicleId: string | null;
};

const UserProfileContext = createContext<UserProfileType | null>(null);

export function UserProfileProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: UserProfileType;
}) {
  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = use(UserProfileContext);

  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }

  return context;
}

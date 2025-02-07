"use client";

import { formatNumber } from "~/lib/utils/number";

import { useUserProfile } from "~/context/user-profile-context";

export function useUnits() {
  const userProfile = useUserProfile();
  const units = userProfile.preferredUnits;

  function formatDistance(amount: number) {
    if (units === "metric") return amount;

    return Math.round(amount * 0.621371);
  }

  function formatDistanceString(amount: number) {
    const units = userProfile.preferredUnits ?? "metric";
    if (units === "metric") return `${formatNumber(amount)} km`;

    return `${formatNumber(Math.round(amount * 0.621371))} mi`;
  }

  return {
    formatDistance,
    formatDistanceString,
  };
}

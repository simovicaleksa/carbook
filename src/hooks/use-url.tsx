"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCallback } from "react";

type RoutingBehavior = "push" | "replace";

export function useUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Helper function to safely encode values
  const safeEncode = useCallback((value: string | null): string | null => {
    if (value === null) return null;

    // Check if the value is already encoded to prevent double-encoding
    try {
      // If decodeURIComponent succeeds without throwing, it's likely already encoded
      decodeURIComponent(value);
      return encodeURIComponent(value);
    } catch {
      // If decodeURIComponent throws, the value is already encoded
      return value;
    }
  }, []);

  const setParams = useCallback(
    (
      updates: Record<string, string | null>,
      behavior: RoutingBehavior = "replace",
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      // Apply all updates to the params with automatic encoding
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          // Use safeEncode to automatically handle URI encoding
          params.set(key, safeEncode(value) ?? "");
        }
      });

      // Construct the new URL
      const newUrl = `${pathname}?${params.toString()}`;

      // Use the specified routing behavior
      if (behavior === "push") {
        router.push(newUrl);
      } else {
        router.replace(newUrl);
      }
    },
    [pathname, searchParams, router, safeEncode],
  );

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) {
        params.delete(name);
      } else {
        // Automatically encode the value
        params.set(name, safeEncode(value) ?? "");
      }
      return params.toString();
    },
    [searchParams, safeEncode],
  );

  return {
    pathname,
    getParam,
    createQueryString,
    setParams,
  };
}

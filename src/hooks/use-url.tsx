"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCallback } from "react";

type RoutingBehavior = "push" | "replace";
type ParamValue = string | number | boolean | string[] | null;

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

  // Helper to process any param value
  const processParamValue = useCallback((value: ParamValue): string | null => {
    if (value === null) return null;
    if (Array.isArray(value)) {
      // Join array values with comma
      return value.join(",");
    }
    // Convert other types to string
    return String(value);
  }, []);

  const setParams = useCallback(
    (
      updates: Record<string, ParamValue>,
      behavior: RoutingBehavior = "replace",
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      // Apply all updates to the params with automatic encoding
      Object.entries(updates).forEach(([key, value]) => {
        const processedValue = processParamValue(value);
        if (processedValue === null) {
          params.delete(key);
        } else {
          // Use safeEncode to automatically handle URI encoding
          params.set(key, safeEncode(processedValue) ?? "");
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
    [pathname, searchParams, router, safeEncode, processParamValue],
  );

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  // Enhanced createQueryString with option to preserve current URL params
  const createQueryString = useCallback(
    (params: Record<string, ParamValue>, preserveCurrentParams = false) => {
      // Start with either current params (if preserving) or a fresh URLSearchParams
      const urlParams = preserveCurrentParams
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

      // Apply all new params, overwriting existing ones if there's a conflict
      Object.entries(params).forEach(([key, value]) => {
        const processedValue = processParamValue(value);
        if (processedValue === null) {
          urlParams.delete(key);
        } else {
          // Use safeEncode to automatically handle URI encoding
          urlParams.set(key, safeEncode(processedValue) ?? "");
        }
      });

      return urlParams.toString();
    },
    [searchParams, safeEncode, processParamValue],
  );

  return {
    pathname,
    getParam,
    createQueryString,
    setParams,
  };
}

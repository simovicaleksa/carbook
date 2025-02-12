"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useCallback } from "react";

export function useUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string, type: "push" | "replace" = "replace") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);

      if (type === "push") {
        router.push(`${pathname}?${params.toString()}`);
      } else {
        router.replace(`${pathname}?${params.toString()}`);
      }
    },
    [pathname, searchParams, router],
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  return {
    pathname,
    getParam,
    createQueryString,
    setParam,
  };
}

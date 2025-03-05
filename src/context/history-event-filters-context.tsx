"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
  use,
  useState,
} from "react";

import { type HistoryEntryType } from "~/types/history";

type HistoryEventFiltersContextType = {
  sortBy: "newest" | "oldest";
  setSortBy: Dispatch<SetStateAction<"newest" | "oldest">>;
  filters: HistoryEntryType[];
  setFilters: Dispatch<SetStateAction<HistoryEntryType[]>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  resetFilters: () => void;
};

const HistoryEventFiltersContext =
  createContext<HistoryEventFiltersContextType | null>(null);

export function HistoryEventFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [filters, setFilters] = useState<HistoryEntryType[]>([]);
  const [search, setSearch] = useState("");

  function resetFilters() {
    setSortBy("newest");
    setFilters([]);
    setSearch("");
  }

  return (
    <HistoryEventFiltersContext.Provider
      value={{
        sortBy,
        filters,
        search,
        setSortBy,
        setFilters,
        setSearch,
        resetFilters,
      }}
    >
      {children}
    </HistoryEventFiltersContext.Provider>
  );
}

export function useHistoryEventFilters() {
  const context = use(HistoryEventFiltersContext);

  if (!context) {
    throw new Error(
      "useHistoryEventFilters must be used within a HistoryEventFiltersProvider",
    );
  }

  return context;
}

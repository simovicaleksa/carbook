import { type HistoryEntryType } from "./history";

export type VehicleSpendingGroupedByCurrency = {
  currency: string;
  total: number;
};

export type VehicleSpendingGroupedByType = {
  type: HistoryEntryType;
  total: number;
};

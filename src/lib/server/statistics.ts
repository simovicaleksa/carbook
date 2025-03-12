import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { and, eq } from "drizzle-orm";

import { db } from "~/db";
import { historyTable } from "~/db/_schema";

import {
  type VehicleSpendingGroupedByType,
  type VehicleSpendingGroupedByCurrency,
} from "~/types/money";

import { dbGetVehicleTransactions } from "./money";

export async function dbGetTotalVehicleSpendingGroupedByCurrency(
  vehicleId: string,
) {
  "use cache";
  cacheTag(`vehicle-${vehicleId}-events`);

  const vehicleTransactions = await dbGetVehicleTransactions(vehicleId);

  const groupedByCurrency: VehicleSpendingGroupedByCurrency[] = [];

  vehicleTransactions.forEach(({ cost: transaction }) => {
    if (!transaction?.amount) return;

    const currencyGroupIndex = groupedByCurrency.findIndex(
      (someGroup) => someGroup.currency === transaction.currency,
    );

    if (currencyGroupIndex === -1) {
      groupedByCurrency.push({
        currency: transaction.currency,
        total: transaction.amount,
      });
    } else {
      if (groupedByCurrency[currencyGroupIndex])
        groupedByCurrency[currencyGroupIndex].total += transaction.amount;
    }
  });

  return groupedByCurrency;
}

export async function dbGetTotalVehicleSpendingGroupedByType(
  vehicleId: string,
  currency: string,
) {
  "use cache";
  cacheTag(`vehicle-${vehicleId}-events`);

  const vehicleTransactions = (
    await dbGetVehicleTransactions(vehicleId)
  ).filter(
    ({ cost: transaction }) => transaction?.currency === currency.toUpperCase(),
  );

  const groupedByType: VehicleSpendingGroupedByType[] = [];

  vehicleTransactions.forEach(({ cost: transaction, type }) => {
    if (!transaction?.amount) return;

    const typeGroupIndex = groupedByType.findIndex(
      (someGroup) => someGroup.type === type,
    );

    if (typeGroupIndex === -1) {
      groupedByType.push({
        type,
        total: transaction.amount,
      });
    } else {
      if (groupedByType[typeGroupIndex])
        groupedByType[typeGroupIndex].total += transaction.amount;
    }
  });

  return groupedByType;
}

export async function dbGetVehicleAccidents(vehicleId: string) {
  "use cache";
  cacheTag(`vehicle-${vehicleId}-events`);

  const vehicleAccidents = await db.query.historyTable.findMany({
    where: and(
      eq(historyTable.vehicleId, vehicleId),
      eq(historyTable.type, "accident"),
    ),
  });

  return vehicleAccidents;
}

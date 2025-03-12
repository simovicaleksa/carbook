import { type VehicleSpendingGroupedByCurrency } from "~/types/money";

export function formatPrice(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount);
}

export function getUsedCurrenciesFromGroupedByCurrencyArray(
  groupedByCurrency: VehicleSpendingGroupedByCurrency[] | undefined,
) {
  const currencies: string[] = [];

  if (!groupedByCurrency) return [];

  groupedByCurrency.forEach((group) => currencies.push(group.currency));

  return currencies;
}

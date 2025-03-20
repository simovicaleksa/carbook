import { redirect } from "next/navigation";

import {
  serverGetTotalVehicleSpendingGroupedByCurrency,
  serverGetTotalVehicleSpendingGroupedByType,
  serverGetVehicleAccidents,
} from "~/app/_actions/statistics";
import { serverGetUserSelectedVehicle } from "~/app/_actions/user";

import { getUsedCurrenciesFromGroupedByCurrencyArray } from "~/lib/utils/money";

import { StatisticsProvider } from "~/context/statistics-context";

import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import CurrencySelectAction from "~/components/input/currency-select-action";
import AccidentsChart from "~/components/statistics/accidents-chart";
import VehicleStatistics from "~/components/statistics/vehicle-statistics";

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    currency: string;
  }>;
}) {
  const { currency } = await searchParams;

  const { data: selectedVehicle } = await serverGetUserSelectedVehicle();

  if (!selectedVehicle) return redirect("/dashboard");

  const { data: vehicleSpendingGroupedByCurrency } =
    await serverGetTotalVehicleSpendingGroupedByCurrency(selectedVehicle.id);

  const { data: vehicleSpendingGroupedByType } =
    await serverGetTotalVehicleSpendingGroupedByType(
      selectedVehicle.id,
      currency,
    );

  const { data: vehicleAccidents } = await serverGetVehicleAccidents(
    selectedVehicle.id,
  );

  const currencies = getUsedCurrenciesFromGroupedByCurrencyArray(
    vehicleSpendingGroupedByCurrency,
  );

  return (
    <StatisticsProvider
      value={{
        vehicleSpendingGroupedByCurrency,
        vehicleSpendingGroupedByType,
        vehicleAccidents,
      }}
    >
      <AppLayout>
        <AppLayoutHeader
          title="Statistics"
          action={<CurrencySelectAction currencies={currencies} />}
        />
        <AppLayoutContent className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <VehicleStatistics />
          <AccidentsChart />
        </AppLayoutContent>
      </AppLayout>
    </StatisticsProvider>
  );
}

import { redirect } from "next/navigation";

import { EventsProvider } from "~/context/events-context";
import { HistoryEventFiltersProvider } from "~/context/history-event-filters-context";

import {
  AppLayout,
  AppLayoutContent,
  AppLayoutFooter,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import AppPagination from "~/components/dashboard/layout/app-pagination";
import AddHistoryEventHeaderButton from "~/components/history/add-history-event-header-button";
import HistoryFilters from "~/components/history/history-filters";
import Timeline from "~/components/history/timeline";

import { getCurrentSelectedVehicle } from "../actions";

import { getVehicleHistoryEvents } from "./actions";

const PER_PAGE = 10;

export default async function History(props: {
  searchParams: Promise<{
    page?: number;
    sortBy?: "newest" | "oldest";
    filters?: string;
    search?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const { data: selectedVehicle } = await getCurrentSelectedVehicle();

  if (!selectedVehicle) return redirect("/dashboard/add-vehicle");

  const { data: historyEvents } = await getVehicleHistoryEvents(
    selectedVehicle.id,
    searchParams?.page ?? 1,
    PER_PAGE,
    searchParams.sortBy,
    searchParams.filters,
    searchParams.search,
  );

  return (
    <HistoryEventFiltersProvider>
      <EventsProvider
        events={historyEvents?.events ?? []}
        total={historyEvents?.total ?? 0}
      >
        <AppLayout>
          <AppLayoutHeader
            title="History"
            action={<AddHistoryEventHeaderButton />}
          />
          <AppLayoutContent>
            <HistoryFilters />
            <Timeline />
          </AppLayoutContent>
          <AppLayoutFooter>
            <AppPagination perPage={PER_PAGE} />
          </AppLayoutFooter>
        </AppLayout>
      </EventsProvider>
    </HistoryEventFiltersProvider>
  );
}

import { notFound } from "next/navigation";

import { EventsProvider } from "~/context/events-context";

import {
  AppLayout,
  AppLayoutContent,
  AppLayoutFooter,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import AppPagination from "~/components/dashboard/layout/app-pagination";
import AddHistoryEventHeaderButton from "~/components/history/add-history-event-header-button";
import Timeline from "~/components/history/timeline";

import { getCurrentSelectedVehicle } from "../actions";

import { getVehicleHistoryEvents } from "./actions";

const PER_PAGE = 20;

export default async function History(props: {
  searchParams: Promise<{
    page?: number;
  }>;
}) {
  const searchParams = await props.searchParams;

  const { data: selectedVehicle } = await getCurrentSelectedVehicle();

  if (!selectedVehicle) return notFound();

  const { data: historyEvents } = await getVehicleHistoryEvents(
    selectedVehicle.id,
    searchParams?.page ?? 1,
    PER_PAGE,
  );

  return (
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
          <Timeline />
        </AppLayoutContent>
        <AppLayoutFooter>
          <AppPagination perPage={PER_PAGE} />
        </AppLayoutFooter>
      </AppLayout>
    </EventsProvider>
  );
}

import { notFound } from "next/navigation";

import { EditHistoryDialogProvider } from "~/context/edit-history-dialog-context";
import { EventsProvider } from "~/context/events-context";

import { getCurrentSelectedVehicle } from "../actions";

import { getVehicleHistoryEvents } from "./actions";

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: selectedVehicle } = await getCurrentSelectedVehicle();

  if (!selectedVehicle) return notFound();

  const { data: events } = await getVehicleHistoryEvents(selectedVehicle.id);

  return (
    <EventsProvider defaultValue={events ?? []}>
      <EditHistoryDialogProvider>{children}</EditHistoryDialogProvider>
    </EventsProvider>
  );
}

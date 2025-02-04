import { notFound } from "next/navigation";

import { DeleteEventDialogProvider } from "~/context/delete-event-dialog-context";
import { EditHistoryDialogProvider } from "~/context/edit-history-dialog-context";
import { EventsProvider } from "~/context/events-context";
import { InspectEventDialogProvider } from "~/context/inspect-event-dialog-context";
import { SelectedEventProvider } from "~/context/selected-event-context";

import DeleteEventDialog from "~/components/history/delete-event-dialog";
import EditHistoryDialog from "~/components/history/edit-event-dialog";
import InspectEventDialog from "~/components/history/inspect-event-dialog";

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
      <SelectedEventProvider>
        <EditHistoryDialogProvider>
          <DeleteEventDialogProvider>
            <InspectEventDialogProvider>
              <InspectEventDialog />
              <EditHistoryDialog />
              <DeleteEventDialog />
              {children}
            </InspectEventDialogProvider>
          </DeleteEventDialogProvider>
        </EditHistoryDialogProvider>
      </SelectedEventProvider>
    </EventsProvider>
  );
}

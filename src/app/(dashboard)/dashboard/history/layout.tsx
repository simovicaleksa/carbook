import { DeleteEventDialogProvider } from "~/context/delete-event-dialog-context";
import { EditHistoryDialogProvider } from "~/context/edit-history-dialog-context";
import { InspectEventDialogProvider } from "~/context/inspect-event-dialog-context";
import { SelectedEventProvider } from "~/context/selected-event-context";

import DeleteEventDialog from "~/components/history/delete-event-dialog";
import EditHistoryDialog from "~/components/history/edit-event-dialog";
import InspectEventDialog from "~/components/history/inspect-event-dialog";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}

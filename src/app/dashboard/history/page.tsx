import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import AddHistoryEventHeaderButton from "~/components/history/add-history-event-header-button";
import HistoryTimeline from "~/components/history/history-timeline";

export default function History() {
  return (
    <AppLayout>
      <AppLayoutHeader
        title="History"
        action={<AddHistoryEventHeaderButton />}
      />
      <AppLayoutContent>
        <HistoryTimeline />
      </AppLayoutContent>
    </AppLayout>
  );
}

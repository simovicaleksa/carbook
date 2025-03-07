import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import AddHistoryEventHeaderButton from "~/components/history/add-history-event-header-button";
import HistoryFiltersSkeleton from "~/components/skeleton/history-filters-skeleton";
import TimelineSkeleton from "~/components/skeleton/timeline-skeleton";

export default async function History() {
  return (
    <AppLayout>
      <AppLayoutHeader
        title="History"
        action={<AddHistoryEventHeaderButton disabled />}
      />
      <AppLayoutContent>
        <HistoryFiltersSkeleton />
        <TimelineSkeleton />
      </AppLayoutContent>
    </AppLayout>
  );
}

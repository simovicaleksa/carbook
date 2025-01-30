import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import AddHistoryEventHeaderButton from "~/components/history/add-history-event-header-button";

export default function History() {
  return (
    <AppLayout>
      <AppLayoutHeader
        title="History"
        action={<AddHistoryEventHeaderButton />}
      />
      <AppLayoutContent></AppLayoutContent>
    </AppLayout>
  );
}

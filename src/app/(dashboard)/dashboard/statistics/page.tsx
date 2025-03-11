import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import VehicleStatistics from "~/components/statistics/vehicle-statistics";

export default function StatisticsPage() {
  return (
    <AppLayout>
      <AppLayoutHeader title="Statistics" />
      <AppLayoutContent>
        <VehicleStatistics />
      </AppLayoutContent>
    </AppLayout>
  );
}

import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import AddVehicleHeaderButton from "~/components/vehicle/add-vehicle-header-button";

export default function DashboardHomePage() {
  return (
    <AppLayout>
      <AppLayoutHeader title="Home" action={<AddVehicleHeaderButton />} />
      <AppLayoutContent></AppLayoutContent>
    </AppLayout>
  );
}

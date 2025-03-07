import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import AddVehicleForm from "~/components/vehicle/add-vehicle-form";

export default function AddVehiclePage() {
  return (
    <AppLayout>
      <AppLayoutHeader title="Add vehicle"></AppLayoutHeader>
      <AppLayoutContent>
        <AddVehicleForm />
      </AppLayoutContent>
    </AppLayout>
  );
}

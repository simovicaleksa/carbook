import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import CarInformationForm from "~/components/settings/car-information-form";

export default function SettingsPage() {
  return (
    <AppLayout>
      <AppLayoutHeader title="Settings" />
      <AppLayoutContent>
        <CarInformationForm />
      </AppLayoutContent>
    </AppLayout>
  );
}

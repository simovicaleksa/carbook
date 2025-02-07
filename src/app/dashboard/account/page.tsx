import UserProfileForm from "~/components/account/user-profile-form";
import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";

export default function AccountPage() {
  return (
    <AppLayout>
      <AppLayoutHeader title="Account" />
      <AppLayoutContent>
        <UserProfileForm />
      </AppLayoutContent>
    </AppLayout>
  );
}

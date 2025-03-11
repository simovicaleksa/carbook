import { redirect } from "next/navigation";

import { getCurrentSession } from "~/lib/server/auth";

import { AddHistoryEventDialogProvider } from "~/context/add-history-event-dialog-context";
import { AddVehicleDialogProvider } from "~/context/add-vehicle-dialog-context";
import { SelectedVehicleProvider } from "~/context/selected-vehicle-context";
import { SignoutDialogProvider } from "~/context/signout-dialog-context";
import { UserProvider } from "~/context/user-context";
import { UserProfileProvider } from "~/context/user-profile-context";
import { UserVehiclesProvider } from "~/context/user-vehicles-context";

import AppSidebar from "~/components/dashboard/sidebar/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Toaster } from "~/components/ui/sonner";

import {
  serverGetUserProfileFromUserId,
  serverGetSelectedVehicleFromUserId,
  serverGetUserVehicles,
} from "../../_actions/user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: vehicles } = await serverGetUserVehicles();
  const { data: selectedVehicle } = await serverGetSelectedVehicleFromUserId(
    user.id,
  );
  const { data: userProfile } = await serverGetUserProfileFromUserId(user.id);

  if (!userProfile) {
    return redirect("/auth/login");
  }

  return (
    <UserProvider value={user}>
      <UserProfileProvider value={userProfile}>
        <UserVehiclesProvider value={{ vehicles: vehicles ?? [] }}>
          <SelectedVehicleProvider defaultValue={selectedVehicle ?? null}>
            <SignoutDialogProvider>
              <AddVehicleDialogProvider>
                <AddHistoryEventDialogProvider>
                  <SidebarProvider>
                    <AppSidebar />
                    {children}
                  </SidebarProvider>
                </AddHistoryEventDialogProvider>
              </AddVehicleDialogProvider>
            </SignoutDialogProvider>
          </SelectedVehicleProvider>
        </UserVehiclesProvider>
      </UserProfileProvider>
    </UserProvider>
  );
}

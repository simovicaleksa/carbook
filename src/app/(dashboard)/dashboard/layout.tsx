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
  getUserProfile,
  getUserSelectedVehicle,
  getUserVehicles,
} from "./actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: vehicles } = await getUserVehicles();
  const { data: selectedVehicle } = await getUserSelectedVehicle(user.id);
  const { data: userProfile } = await getUserProfile(user.id);

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

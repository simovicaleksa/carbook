import { redirect } from "next/navigation";

import { getCurrentSession } from "~/lib/server/auth";

import { AddVehicleDialogProvider } from "~/context/add-vehicle-dialog-context";
import { SelectedVehicleProvider } from "~/context/selected-vehicle-context";
import { SignoutDialogProvider } from "~/context/signout-dialog-context";
import { UserProvider } from "~/context/user-context";
import { UserVehiclesProvider } from "~/context/user-vehicles-context";

import SignOutDialog from "~/components/auth/signout-dialog";
import AppSidebar from "~/components/dashboard/sidebar/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

import { getUserVehicles } from "./actions";

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

  return (
    <UserProvider value={user}>
      <UserVehiclesProvider value={{ vehicles: vehicles ?? [] }}>
        <SelectedVehicleProvider defaultValue={vehicles?.[0] ?? null}>
          <SignoutDialogProvider>
            <AddVehicleDialogProvider>
              <SignOutDialog />
              <SidebarProvider>
                <AppSidebar />
                <main className="w-full p-5">{children}</main>
              </SidebarProvider>
            </AddVehicleDialogProvider>
          </SignoutDialogProvider>
        </SelectedVehicleProvider>
      </UserVehiclesProvider>
    </UserProvider>
  );
}

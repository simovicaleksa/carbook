import { redirect } from "next/navigation";

import { getCurrentSession } from "~/lib/server/auth";

import { AddVehicleDialogProvider } from "~/context/add-vehicle-dialog-context";
import { SignoutDialogProvider } from "~/context/signout-dialog-context";
import { UserProvider } from "~/context/user-context";

import SignOutDialog from "~/components/auth/signout-dialog";
import AppSidebar from "~/components/dashboard/sidebar/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <UserProvider value={user}>
      <SignoutDialogProvider>
        <AddVehicleDialogProvider>
          <SignOutDialog />
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full p-5">{children}</main>
          </SidebarProvider>
        </AddVehicleDialogProvider>
      </SignoutDialogProvider>
    </UserProvider>
  );
}

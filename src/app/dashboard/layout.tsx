import { redirect } from "next/navigation";

import { getCurrentSession } from "~/lib/server/auth";

import { UserProvider } from "~/context/user-context";

import DashboardSidebar from "~/components/dashboard/dashboard-sidebar";
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
      <SidebarProvider>
        <DashboardSidebar />
        <main className="w-full p-5">{children}</main>
      </SidebarProvider>
    </UserProvider>
  );
}

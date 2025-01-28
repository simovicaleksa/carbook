import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../../ui/sidebar";

import SidebarCoreNav from "./sidebar-core-nav";
import SidebarHelpNav from "./sidebar-help-nav";
import UserDropdown from "./user-dropdown";
import VehicleSwitcher from "./vehicle-switcher";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <VehicleSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarCoreNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarHelpNav />
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}

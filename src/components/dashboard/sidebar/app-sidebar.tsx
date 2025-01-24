import {
  ChartLine,
  ChartNoAxesGantt,
  Flag,
  Home,
  LifeBuoy,
  Send,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";

import UserDropdown from "./user-dropdown";
import VehicleSwitcher from "./vehicle-switcher";

const coreItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: <Home />,
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: <ChartNoAxesGantt />,
  },
  {
    title: "Statistics",
    url: "/dashboard/statistics",
    icon: <ChartLine />,
  },
];

const helpItems = [
  {
    title: "Support",
    url: "/support",
    icon: <LifeBuoy />,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: <Send />,
  },
  {
    title: "Report issue",
    url: "/report-issue",
    icon: <Flag />,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <VehicleSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { usePathname } from "next/navigation";

import {
  Bell,
  ChartLine,
  ChartNoAxesGantt,
  Home,
  Mail,
  Settings,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "~/components/ui/sidebar";

import SidebarLinkButton from "./sidebar-link-button";

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
    comingSoon: true,
  },
  {
    title: "Upcoming",
    url: "/dashboard/upcoming",
    icon: <Bell />,
    comingSoon: true,
  },
  {
    title: "Invites",
    url: "/dashboard/invites",
    icon: <Mail />,
    comingSoon: true,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings />,
  },
];

export default function SidebarCoreNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {coreItems.map((item) => (
            <SidebarLinkButton
              key={item.title}
              icon={item.icon}
              href={item.url}
              active={pathname === item.url}
              commingSoon={item.comingSoon}
            >
              {item.title}
            </SidebarLinkButton>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

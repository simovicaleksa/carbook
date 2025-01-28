"use client";

import { usePathname } from "next/navigation";

import { ChartLine, ChartNoAxesGantt, Home } from "lucide-react";

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
            >
              {item.title}
            </SidebarLinkButton>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

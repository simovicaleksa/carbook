"use client";

import { usePathname } from "next/navigation";

import { Flag, HandHeart, LifeBuoy, Send } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "~/components/ui/sidebar";

import SidebarLinkButton from "./sidebar-link-button";

const helpItems = [
  {
    title: "Donate",
    url: "/donate",
    icon: <HandHeart />,
  },
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

export default function SidebarHelpNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Help</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {helpItems.map((item) => (
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

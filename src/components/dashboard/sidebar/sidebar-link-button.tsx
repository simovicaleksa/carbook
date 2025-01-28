import Link from "next/link";

import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";

export default function SidebarLinkButton({
  href,
  children,
  icon,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild variant={active ? "outline" : "default"}>
        <Link href={href}>
          {icon}
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

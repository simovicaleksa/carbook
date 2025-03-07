import Link from "next/link";

import { cn } from "~/lib/utils";

import { SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";

export default function SidebarLinkButton({
  href,
  children,
  icon,
  active = false,
  commingSoon = false,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
  commingSoon?: boolean;
}) {
  return (
    <SidebarMenuItem
      className={cn("relative", {
        "pointer-events-none opacity-50": commingSoon,
      })}
    >
      <SidebarMenuButton asChild variant={active ? "outline" : "default"}>
        <Link href={href}>
          {icon}
          <span className="flex w-full items-center justify-between">
            {children}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

import Link from "next/link";

import { cn } from "~/lib/utils";

import { Badge } from "~/components/ui/badge";
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
            {commingSoon && (
              <Badge className="rounded text-xs" variant={"outline"}>
                Coming Soon
              </Badge>
            )}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

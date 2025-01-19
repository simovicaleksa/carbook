"use client";

import Link from "next/link";

import { ChevronsUpDown, User2 } from "lucide-react";

import { useSignoutDialog } from "~/context/signout-dialog-context";
import { useUser } from "~/context/user-context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

export default function UserDropdown() {
  const user = useUser();
  const { toggleOpen } = useSignoutDialog();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size={"lg"}>
              <div className="flex flex-row items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-[var(--radius)] bg-sidebar-primary text-sidebar-primary-foreground">
                  <User2 className="size-4" />
                </span>
                <div className="grid flex-1">
                  <span className="truncate font-medium">
                    {`${user.firstName} ${user.lastName}`}
                  </span>
                  <span className="truncate text-xs">{user.username}</span>
                </div>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <Link href={"/account"}>
              <DropdownMenuItem>
                <span>Account</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={toggleOpen}>
              <span className="text-destructive">Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

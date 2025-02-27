"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type NavigationMenuProps } from "@radix-ui/react-navigation-menu";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export default function NavMenu(props: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
        {navItems.map((item) => (
          <NavigationMenuItem
            className="relative overflow-visible"
            key={item.href}
          >
            <NavigationMenuLink asChild>
              <Link href={item.href}>{item.title}</Link>
            </NavigationMenuLink>

            {/* Indicate current active tab */}
            {pathname === item.href && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

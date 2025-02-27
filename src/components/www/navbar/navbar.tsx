import Link from "next/link";

import { Button } from "~/components/ui/button";

import Logo from "./logo";
import NavMenu from "./nav-menu";
import NavigationSheet from "./navigation-sheet";

export default function Navbar() {
  return (
    <nav className="fixed inset-x-4 top-6 mx-auto h-16 max-w-screen-xl rounded-full border bg-background dark:border-slate-700/70">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Logo />
        {/* Desktop Menu */}

        <NavMenu className="hidden md:block" />
        <div className="flex items-center gap-3">
          <Link href={"/auth/login"}>
            <Button
              variant="outline"
              className="hidden rounded-full sm:inline-flex"
            >
              Sign In
            </Button>
          </Link>

          <Link href={"/auth/signup"}>
            <Button className="rounded-full">Get Started</Button>
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
}

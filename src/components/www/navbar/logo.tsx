import Link from "next/link";

import { cn } from "~/lib/utils";

import { buttonVariants } from "~/components/ui/button";

export default function Logo(props: { className?: string }) {
  return (
    <Link
      href={"/"}
      className={cn(buttonVariants({ variant: "ghost" }), props.className)}
    >
      <span className="font-koulen text-3xl text-primary">CARBOOK</span>
    </Link>
  );
}

"use client";

import { ArrowUp } from "lucide-react";

import { cn } from "~/lib/utils";

import { useScroll } from "~/hooks/use-scroll";

import { Button } from "~/components/ui/button";

export default function BackToTop() {
  const { scrollY } = useScroll();

  if (typeof window === "undefined") return null;

  return (
    <Button
      size={"icon"}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "pointer-events-none fixed bottom-5 right-5 aspect-square size-fit rounded-full p-3 opacity-0 shadow transition-opacity duration-200",
        {
          "pointer-events-auto opacity-100": scrollY > 200,
        },
      )}
    >
      <ArrowUp className="!size-5" />
    </Button>
  );
}

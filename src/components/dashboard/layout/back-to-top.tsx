"use client";

import { ArrowUp } from "lucide-react";

import { cn } from "~/lib/utils";

import { useScroll } from "~/hooks/use-scroll";

import { Button } from "~/components/ui/button";

export default function BackToTop() {
  const { scrollY } = useScroll();

  return (
    <Button
      size={"icon"}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "pointer-events-none fixed bottom-0 right-0 z-50 aspect-square size-fit scale-125 rounded-full p-3 opacity-0 shadow transition-all duration-200",
        {
          "pointer-events-auto bottom-7 right-7 opacity-100": scrollY > 200,
        },
      )}
    >
      <ArrowUp className="!size-5" />
    </Button>
  );
}

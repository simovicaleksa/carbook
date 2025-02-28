"use client";

import { ArrowUpRight, CirclePlay } from "lucide-react";

import { useIsMobile } from "~/hooks/use-mobile";

import { Button } from "~/components/ui/button";

export default function HeroCTA() {
  const isMobile = useIsMobile();
  const size = isMobile ? "default" : "lg";

  return (
    <div className="mt-12 flex items-center gap-4">
      <Button size={size} className="rounded-full text-base">
        Get Started <ArrowUpRight className="!h-5 !w-5" />
      </Button>
      <Button
        variant="outline"
        size={size}
        className="rounded-full text-base shadow-none"
      >
        <CirclePlay className="!h-5 !w-5" /> Watch Demo
      </Button>
    </div>
  );
}

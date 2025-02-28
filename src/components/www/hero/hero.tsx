import Image from "next/image";

import React from "react";

import { cn } from "~/lib/utils";

import { Badge } from "~/components/ui/badge";

import HeroCTA from "./hero-cta";

export default function Hero() {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-screen-xl gap-12 px-6 py-12 lg:grid-cols-2 lg:py-0">
        <div className="my-auto">
          <Badge className="rounded-full border-none bg-gradient-to-br from-primary via-muted/30 via-70% to-primary py-1">
            FROM BOOK TO CARBOOK
          </Badge>
          <h1 className="mt-16 max-w-[17ch] text-4xl font-bold !leading-[1.2] tracking-tight sm:mt-6 md:text-5xl lg:text-[2.75rem] xl:text-5xl">
            Track Your{" "}
            <span className="font-black text-primary">Car History</span> With
            Ease
          </h1>
          <p className="mt-6 max-w-[60ch] sm:text-lg">
            Record your car&apos;s service and maintenance history in digital
            form. Track spendings on your car, and notice common problems.
          </p>
          <HeroCTA />
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-accent lg:aspect-auto lg:h-[calc(100vh-4rem)] lg:w-[1000px]">
          <Image
            src={
              "https://raw.githubusercontent.com/simovicaleksa/assets/refs/heads/main/carbook/bmw-car.jpg"
            }
            fill
            sizes="(max-width): 768px 100vw, (max-width: 1024px) 50vw"
            alt="Blue bmw sedan near green lawn grass"
            className="size-full object-cover lg:object-left"
          />
          <div
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-10 size-full",
              "from-black/30 to-black/10 lg:bg-gradient-to-b",
            )}
          />
        </div>
      </div>
    </div>
  );
}

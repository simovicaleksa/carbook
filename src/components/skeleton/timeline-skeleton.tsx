import { cn } from "~/lib/utils";

import { Skeleton } from "../ui/skeleton";

export default function TimelineSkeleton() {
  const events = Array.from(Array(10));

  return (
    <div className="relative size-full">
      <Skeleton className="absolute left-5 mx-auto h-full w-0.5 bg-border lg:left-0 lg:right-0" />
      <div className="mx-auto flex w-full max-w-4xl flex-col justify-between gap-10">
        {events.map((_, idx) => (
          <TimelineItem key={idx} isLeft={idx % 2 === 0} />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ isLeft }: { isLeft?: boolean }) {
  return (
    <div
      className={cn("flex flex-row gap-8", {
        "lg:flex-row-reverse": isLeft,
      })}
    >
      <div className="hidden w-full lg:block"></div>
      <Skeleton className="aspect-square size-10 rounded-full" />
      <Skeleton
        className="w-full lg:mr-0"
        style={{
          height: `${Math.floor(Math.random() * (250 - 150 + 1)) + 150}px`,
        }}
      />
    </div>
  );
}

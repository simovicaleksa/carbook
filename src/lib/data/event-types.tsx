import {
  CircleEllipsis,
  Coins,
  Drill,
  Droplets,
  Fuel,
  Hammer,
  Milestone,
  RefreshCw,
  Search,
  TriangleAlert,
  Wrench,
  Zap,
} from "lucide-react";

export const eventTypes = [
  {
    value: "refuel",
    label: "Refuel",
    icon: <Fuel className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "service",
    label: "Service",
    icon: <Wrench className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "repair",
    label: "Repair",
    icon: <Hammer className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "replacement",
    label: "Replacement",
    icon: <RefreshCw className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "purchase",
    label: "Purchase",
    icon: <Coins className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "inspection",
    label: "Inspection",
    icon: <Search className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "tune-up",
    label: "Tune-up",
    icon: <Zap className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "wash",
    label: "Wash",
    icon: <Droplets className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "milestone",
    label: "Milestone",
    icon: <Milestone className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "upgrade",
    label: "Upgrade",
    icon: <Drill className="mb-2 size-7 text-muted-foreground sm:size-5" />,
  },
  {
    value: "accident",
    label: "Accident",
    icon: (
      <TriangleAlert className="mb-2 size-7 text-muted-foreground sm:size-5" />
    ),
  },
  {
    value: "other",
    label: "Other",
    icon: (
      <CircleEllipsis className="mb-2 size-7 text-muted-foreground sm:size-5" />
    ),
  },
];

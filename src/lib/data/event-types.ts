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
    icon: Fuel,
  },
  {
    value: "service",
    label: "Service",
    icon: Wrench,
  },
  {
    value: "repair",
    label: "Repair",
    icon: Hammer,
  },
  {
    value: "replacement",
    label: "Replacement",
    icon: RefreshCw,
  },
  {
    value: "purchase",
    label: "Purchase",
    icon: Coins,
  },
  {
    value: "inspection",
    label: "Inspection",
    icon: Search,
  },
  {
    value: "tune-up",
    label: "Tune-up",
    icon: Zap,
  },
  {
    value: "wash",
    label: "Wash",
    icon: Droplets,
  },
  {
    value: "milestone",
    label: "Milestone",
    icon: Milestone,
  },
  {
    value: "upgrade",
    label: "Upgrade",
    icon: Drill,
  },
  {
    value: "accident",
    label: "Accident",
    icon: TriangleAlert,
  },
  {
    value: "other",
    label: "Other",
    icon: CircleEllipsis,
  },
] as const;

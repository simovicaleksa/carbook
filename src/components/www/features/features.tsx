import Link from "next/link";

import {
  BarChart,
  Bell,
  Cloud,
  FileText,
  FileUp,
  Goal,
  PieChart,
  Share,
  Share2,
  Users,
  Wrench,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const features = [
  {
    icon: FileText,
    title: "Digital Car History",
    description:
      "Store and organize all your car's history, from refuels to major repairs, in one place.",
  },
  {
    icon: PieChart,
    title: "Spending & Stats",
    description:
      "Track expenses, analyze costs, and identify the most common issues with your vehicle.",
  },
  {
    icon: Bell,
    title: "Maintenance Reminders",
    description:
      "Never miss a service again with automatic reminders for oil changes, tire rotations, and more.",
  },
  {
    icon: Share2,
    title: "History Sharing",
    description:
      "Easily share your car’s full service history when selling, increasing trust and value.",
  },
  {
    icon: FileUp,
    title: "Export to PDF",
    description:
      "Generate a professional car history report as a PDF for records or resale purposes.",
  },
  {
    icon: Goal,
    title: "Milestone Tracking",
    description:
      "Celebrate key milestones like 100K km, engine rebuilds, or major upgrades.",
  },
  {
    icon: Wrench,
    title: "Service Logs",
    description:
      "Keep detailed records of all maintenance and repairs, ensuring a complete service history.",
  },
  {
    icon: Users,
    title: "Multi-User Access",
    description:
      "Allow family members, mechanics, or fleet managers to contribute and view car records.",
  },
  {
    icon: Cloud,
    title: "Cloud Backup",
    description:
      "Securely store your car's history in the cloud, so you never lose important records.",
  },
];

export default function Features() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-screen-xl px-6 py-10">
        <h2 className="max-w-xl text-4xl font-bold tracking-tight md:mx-auto md:text-center md:text-5xl md:leading-[3.5rem]">
          Car Experience With{" "}
          <span className="font-black text-primary">Easy Record Tracking</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="-mx-2 flex max-w-lg items-center gap-6 rounded-lg p-2 sm:mx-0"
            >
              <div className="flex aspect-square h-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="size-6" />
              </div>
              <div className="">
                <span className="text-lg font-semibold tracking-tight">
                  {feature.title}
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

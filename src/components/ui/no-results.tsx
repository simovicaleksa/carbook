import { type IconType } from "@icons-pack/react-simple-icons";

import { cn } from "~/lib/utils";

export function NoResults({
  title,
  description,
  icon,
  className,
}: {
  title: string;
  description: string;
  icon: IconType;
  className?: string;
}) {
  const Icon = icon;

  return (
    <div
      className={cn(
        "m-auto flex size-fit flex-col items-center justify-center text-center",
        className,
      )}
    >
      <Icon className="mb-5 size-10" />
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

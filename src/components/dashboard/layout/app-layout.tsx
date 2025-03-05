import { cn } from "~/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex size-full flex-col">{children}</main>;
}

export function AppLayoutHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-row items-center justify-between border-b bg-sidebar px-5 py-5 shadow-sm">
      <h1 className="font-mono text-xl font-medium">{title}</h1>
      {action}
    </header>
  );
}

export function AppLayoutContent({ children }: { children?: React.ReactNode }) {
  return <div className="min-h-[78vh] p-5 xl:p-10">{children}</div>;
}

export function AppLayoutFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <footer className={cn("p-5 xl:p-10", className)}>{children}</footer>;
}

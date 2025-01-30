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
    <div className="flex w-full flex-row items-center justify-between border-b bg-sidebar px-5 py-5">
      <h1 className="font-mono text-xl font-medium">{title}</h1>
      {action}
    </div>
  );
}

export function AppLayoutContent({ children }: { children?: React.ReactNode }) {
  return <div className="p-5">{children}</div>;
}

import { Toaster } from "~/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster
        position="bottom-right"
        theme="light"
        duration={5000}
        visibleToasts={6}
        expand
      />
      {children}
    </>
  );
}

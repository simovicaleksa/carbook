import {
  AppLayout,
  AppLayoutContent,
  AppLayoutHeader,
} from "~/components/dashboard/layout/app-layout";
import { Skeleton } from "~/components/ui/skeleton";

export default function StatisticsLoading() {
  return (
    <AppLayout>
      <AppLayoutHeader title="Statistics" />
      <AppLayoutContent className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Skeleton className="col-span-1 h-[350px]" />
        <Skeleton className="col-span-1 h-[350px] lg:col-span-2" />
        <Skeleton className="col-span-full h-[400px]" />
        <div className="col-span-full grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="col-span-1 h-[300px]" />
          <Skeleton className="col-span-1 h-[300px]" />
        </div>
      </AppLayoutContent>
    </AppLayout>
  );
}

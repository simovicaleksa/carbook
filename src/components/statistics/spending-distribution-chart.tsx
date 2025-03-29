"use client";

import { useRouter } from "next/navigation";

import { useMemo } from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  Label,
} from "recharts";

import { formatPrice } from "~/lib/utils/money";
import { capitalize } from "~/lib/utils/string";

import { useStatistics } from "~/context/statistics-context";

import { useIsMobile } from "~/hooks/use-mobile";
import { useUrl } from "~/hooks/use-url";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const COLORS = [
  "#1E40AF", // Blue-800
  "#1D4ED8", // Blue-700
  "#2563EB", // Blue-600
  "#3B82F6", // Blue-500
  "#0284C7", // Cyan-600
  "#0EA5E9", // Cyan-500
  "#0369A1", // Sky-700
  "#075985", // Sky-800
];

export default function SpendingDistributionChart() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const { createQueryString } = useUrl();

  const { getParam } = useUrl();
  const currency = getParam("currency");

  const { vehicleSpendingGroupedByType } = useStatistics();
  const data = useMemo(() => {
    const data = vehicleSpendingGroupedByType?.filter(
      (item) => item.type !== "purchase",
    );
    return data?.sort((a, b) => b.total - a.total);
  }, [vehicleSpendingGroupedByType]);

  const totalSpent = useMemo(() => {
    if (!data) return 0;
    return data.reduce((total, current) => total + current.total, 0);
  }, [data]);

  if (!data) return null;

  function handleClickType(type: string) {
    const urlParams = createQueryString({
      page: 1,
      sortBy: "newest",
      filters: [type],
    });

    router.push(`/dashboard/history?${urlParams}`);
  }

  return (
    <Card className="col-span-full h-fit">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <CardTitle>Total spending</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart width={250} height={250}>
            <Pie
              labelLine={false}
              data={data}
              dataKey="total"
              nameKey="type"
              innerRadius={70} // Creates the hollow center
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              offset={200}
              label={({ type, total }) =>
                isMobile
                  ? null
                  : `${capitalize(type)} (${formatPrice(Number(total), currency)})`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                  className="cursor-pointer"
                  onClick={() => handleClickType(entry.type)}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {formatPrice(totalSpent, currency)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Spent
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>

            <Tooltip
              wrapperClassName="rounded-[var(--radius)] text-sm"
              formatter={(value, name) => [
                formatPrice(Number(value), currency),
                `${String(name).charAt(0).toUpperCase()}${String(name).slice(1)}`,
              ]}
            />

            <Legend iconSize={20} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

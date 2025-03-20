"use client";

import { useMemo } from "react";

import { FlagOff } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  YAxis,
  XAxis,
  Bar,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getDateFromYear } from "~/lib/utils/date";
import { fillAccidentsData, filterByTimeframe } from "~/lib/utils/statistics";

import { ChartProvider, useChart } from "~/context/chart-context";
import { useSelectedVehicle } from "~/context/selected-vehicle-context";
import { useStatistics } from "~/context/statistics-context";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { NoResults } from "../ui/no-results";

import { ChartTimelineSelect } from "./chart-timeline-select";

function AccidentsChartInner() {
  const { timeframe } = useChart();

  const { vehicleAccidents } = useStatistics();
  const { selectedVehicle } = useSelectedVehicle();

  const data = useMemo(() => {
    if (!selectedVehicle?.year || !vehicleAccidents) return [];

    const filteredData = filterByTimeframe(vehicleAccidents, timeframe);
    const filledData = fillAccidentsData(
      filteredData,
      timeframe,
      getDateFromYear(selectedVehicle.year),
    );
    console.log(filledData);

    return filledData;
  }, [selectedVehicle?.year, vehicleAccidents, timeframe]);

  if (!selectedVehicle?.year) return null;

  return (
    <Card className="col-span-full h-fit">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-2">
          <CardTitle>Accident history</CardTitle>
          <CardDescription>
            {vehicleAccidents?.length
              ? `${vehicleAccidents.length} accidents`
              : "No accidents"}
          </CardDescription>
        </div>
        <ChartTimelineSelect disabled={vehicleAccidents?.length === 0} />
      </CardHeader>
      <CardContent>
        {data.length ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart width={300} height={400} data={data} className="!p-0">
              <CartesianGrid strokeDasharray={"3 3"} />
              <Tooltip
                wrapperClassName="rounded-[var(--radius)]"
                labelClassName="text-lg font-semibold"
                offset={30}
                cursor={{
                  className: "fill-neutral-500/5 rounded-[var(--radius)]",
                }}
              />
              <XAxis
                dataKey={"x"}
                height={15}
                interval="equidistantPreserveStart"
                padding={{
                  left: 5,
                  right: 5,
                }}
              />
              <YAxis
                dataKey={"y"}
                allowDecimals={false}
                width={20}
                domain={[0, (dataMax: number) => dataMax + 1]}
              />
              <Bar
                dataKey={"y"}
                className="fill-red-500"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <NoResults
            className="mt-10"
            icon={FlagOff}
            title="No accidents"
            description="No accidents for selected timeframe"
          />
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

export default function AccidentsChart() {
  return (
    <ChartProvider>
      <AccidentsChartInner />
    </ChartProvider>
  );
}

import {
  subYears,
  subMonths,
  subWeeks,
  startOfYear,
  format,
  eachYearOfInterval,
  endOfYear,
} from "date-fns";
import { type InferSelectModel } from "drizzle-orm";

import { type historyTable } from "~/db/_schema";

import { type TimeframeType } from "~/types/statistics";

function getTimeframeStartDate(timeframe: TimeframeType) {
  const currentDate = new Date();

  switch (timeframe) {
    case "week":
      return subWeeks(currentDate, 1);
    case "month":
      return subMonths(currentDate, 1);
    case "1yr":
      return subYears(currentDate, 1);
    case "5yr":
      return subYears(currentDate, 5);
    case "10yr":
      return subYears(currentDate, 10);
  }

  return new Date(0);
}

export function filterByTimeframe<T>(data: T[], timeframe: TimeframeType): T[] {
  const startDate = getTimeframeStartDate(timeframe);
  const currentDate = new Date();

  const filteredData = data.filter((item) => {
    const date = (item as { date: Date }).date;

    // Invalid date, filter it out
    if (!(date instanceof Date) || isNaN(date.getTime())) return false;

    if (date < startDate) return false;
    if (date > currentDate) return false;
    return true;
  });

  return filteredData;
}

export function fillAccidentsData(
  data: InferSelectModel<typeof historyTable>[],
  timeframe: TimeframeType,
  startDate: Date,
): { x: string; y: number }[] {
  const now = new Date();
  const countMap = new Map<string, number>();

  data.forEach((item) => {
    let key: string;
    if (["week", "month"].includes(timeframe)) {
      key = format(item.date, "MMM d");
    } else if (["1yr", "5yr", "10yr", "all"].includes(timeframe)) {
      key = format(startOfYear(item.date), "yyyy");
    } else {
      return;
    }
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  });

  if (timeframe !== "all") {
    return Array.from(countMap.entries()).map(([x, y]) => ({ x, y }));
  }

  const allYears = eachYearOfInterval({
    start: startOfYear(startDate),
    end: endOfYear(now),
  });

  return allYears.map((year) => {
    const yearStr = format(year, "yyyy");
    return {
      x: yearStr,
      y: countMap.get(yearStr) ?? 0,
    };
  });
}

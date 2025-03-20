import {
  subYears,
  subMonths,
  subWeeks,
  startOfYear,
  format,
  eachYearOfInterval,
  endOfYear,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subDays,
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
  startDate?: Date, // Optional, only used for "all"
): { x: string; y: number }[] {
  const now = new Date(); // Current date (e.g., 2025-03-20)
  const countMap = new Map<string, number>();

  // Count accidents based on timeframe
  data.forEach((item) => {
    let key: string;
    switch (timeframe) {
      case "week":
      case "month":
        key = format(item.date, "MMM d"); // e.g., "Mar 20"
        break;
      case "1yr":
        key = format(item.date, "MMM yyyy"); // e.g., "Mar 2025"
        break;
      case "5yr":
      case "10yr":
      case "all":
        key = format(startOfYear(item.date), "yyyy"); // e.g., "2025"
        break;
      default:
        return;
    }
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  });

  // Define the start date based on timeframe
  let intervalStart: Date;
  let intervalEnd = now; // End is today
  let dateArray: Date[];

  switch (timeframe) {
    case "week":
      intervalStart = subDays(now, 6); // 7 days total, including today
      dateArray = eachDayOfInterval({ start: intervalStart, end: intervalEnd });
      return dateArray.map((date) => {
        const key = format(date, "MMM d");
        return { x: key, y: countMap.get(key) ?? 0 };
      });

    case "month":
      intervalStart = subMonths(now, 1); // 1 month ago from today
      dateArray = eachDayOfInterval({ start: intervalStart, end: intervalEnd });
      return dateArray.map((date) => {
        const key = format(date, "MMM d");
        return { x: key, y: countMap.get(key) ?? 0 };
      });

    case "1yr":
      intervalStart = startOfMonth(subYears(now, 1)); // 1 year ago
      intervalEnd = endOfMonth(now);
      dateArray = eachMonthOfInterval({
        start: intervalStart,
        end: intervalEnd,
      });
      return dateArray.map((date) => {
        const key = format(date, "MMM yyyy");
        return { x: key, y: countMap.get(key) ?? 0 };
      });

    case "5yr":
      intervalStart = startOfYear(subYears(now, 5)); // 5 years ago
      intervalEnd = endOfYear(now);
      dateArray = eachYearOfInterval({
        start: intervalStart,
        end: intervalEnd,
      });
      return dateArray.map((date) => {
        const key = format(date, "yyyy");
        return { x: key, y: countMap.get(key) ?? 0 };
      });

    case "10yr":
      intervalStart = startOfYear(subYears(now, 10)); // 10 years ago
      intervalEnd = endOfYear(now);
      dateArray = eachYearOfInterval({
        start: intervalStart,
        end: intervalEnd,
      });
      return dateArray.map((date) => {
        const key = format(date, "yyyy");
        return { x: key, y: countMap.get(key) ?? 0 };
      });

    case "all":
      if (!startDate)
        throw new Error('startDate is required for "all" timeframe');
      intervalStart = startOfYear(startDate);
      intervalEnd = endOfYear(now);
      dateArray = eachYearOfInterval({
        start: intervalStart,
        end: intervalEnd,
      });
      return dateArray.map((date) => {
        const key = format(date, "yyyy");
        return { x: key, y: countMap.get(key) ?? 0 };
      });

    default:
      return [];
  }
}

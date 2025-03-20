"use client";

import { useStatistics } from "~/context/statistics-context";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

export default function VehicleStatistics() {
  const {
    vehicleSpendingGroupedByCurrency,
    vehicleSpendingGroupedByType,
    vehicleAccidents,
  } = useStatistics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle statistics</CardTitle>
        <CardDescription>Learn more about your vehicle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-3">
          <h4>Spending by currency:</h4>
          {vehicleSpendingGroupedByCurrency?.map((item, idx) => (
            <p key={idx}>{`${item.total} ${item.currency}`}</p>
          ))}
        </div>

        <div className="py-3">
          <h4>Spending by type:</h4>
          {vehicleSpendingGroupedByType?.map((item, idx) => (
            <p key={idx}>{`${item.type} ${item.total}`}</p>
          ))}
        </div>

        <div className="py-3">
          <h4>Accidents:</h4>
          {vehicleAccidents?.map((item, idx) => (
            <p key={idx}>{`${item.date.toDateString()} ${item.description}`}</p>
          ))}
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

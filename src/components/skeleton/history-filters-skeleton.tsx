"use client";

import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";

export default function HistoryFiltersSkeleton() {
  return (
    <Collapsible>
      <Card className="pointer-events-none relative mx-auto mb-10 max-w-4xl opacity-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle>Filters</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </div>
          <CollapsibleTrigger asChild>
            <Button size={"sm"} variant={"link"}>
              Show filters
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
      </Card>
    </Collapsible>
  );
}

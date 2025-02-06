"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { addVehicleSchema } from "~/app/actions/vehicle-validators";
import { updateUserVehicle } from "~/app/dashboard/actions";

import { cn } from "~/lib/utils";

import { useSelectedVehicle } from "~/context/selected-vehicle-context";

import { useLoading } from "~/hooks/use-loading";

import MakeSelect from "../input/make-select";
import VehicleTypeRadio from "../input/vehicle-type-radio";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import LoadingButton from "../ui/loading-button";

export default function CarInformationForm() {
  const { selectedVehicle } = useSelectedVehicle();
  const loading = useLoading();
  const router = useRouter();

  const isDisabled = loading.isLoading || !selectedVehicle;

  const form = useForm<z.infer<typeof addVehicleSchema>>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      type: selectedVehicle?.type ?? "car",
      make: selectedVehicle?.make ?? "",
      model: selectedVehicle?.model ?? "",
      year: selectedVehicle?.year ?? 0,
      distanceTraveled: selectedVehicle?.distanceTraveled ?? 0,
    },
  });

  useEffect(() => {
    if (!selectedVehicle) return;

    form.reset({
      type: selectedVehicle.type,
      make: selectedVehicle.make,
      model: selectedVehicle.model,
      year: selectedVehicle.year,
      distanceTraveled: selectedVehicle.distanceTraveled,
    });
  }, [selectedVehicle, form]);

  form.watch("make");

  async function onSubmit(values: z.infer<typeof addVehicleSchema>) {
    if (!selectedVehicle) return;
    loading.start();

    const res = await updateUserVehicle(selectedVehicle.id, values);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error.message,
      });
    } else {
      toast.success("Success", {
        description: "Vehicle has been updated",
      });
      router.refresh();
    }
    loading.end();
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Car information</CardTitle>
        <CardDescription>Update car information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("grid grid-cols-1 gap-2 space-y-5")}
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <VehicleTypeRadio
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <MakeSelect
                      onValueChange={(value) => value && field.onChange(value)}
                      value={field.value}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Vehicle model..."
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Vehicle year..."
                      type="number"
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distanceTraveled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance traveled</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Distance traveled..."
                      type="number"
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              isLoading={loading.isLoading}
              type="submit"
              loadingText="Updating vehicle"
            >
              Update vehicle
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

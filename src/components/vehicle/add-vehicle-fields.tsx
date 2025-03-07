"use client";

import { type UseFormReturn } from "react-hook-form";

import { type addVehicleSchema } from "~/lib/validators/vehicle";

import MakeSelect from "../input/make-select";
import VehicleTypeRadio from "../input/vehicle-type-radio";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function AddVehicleFields({
  form,
}: {
  form: UseFormReturn<Zod.infer<typeof addVehicleSchema>>;
}) {
  return (
    <>
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
              <MakeSelect onValueChange={field.onChange} value={field.value} />
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
              <Input {...field} placeholder="Vehicle model..." />
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
              <Input {...field} placeholder="Vehicle year..." type="number" />
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";

import { addVehicleSchema } from "~/app/actions/vehicle-validators";

import { cn } from "~/lib/utils";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";

import MakeSelect from "../input/make-select";
import VehicleTypeRadio from "../input/vehicle-type-radio";
import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
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

export default function AddVehicleForm() {
  const loading = useLoading();
  const isMobile = useIsMobile();

  async function onSubmit(values: z.infer<typeof addVehicleSchema>) {
    loading.start();

    console.log(values);

    loading.end();
  }

  const form = useForm<z.infer<typeof addVehicleSchema>>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      type: "car",
      make: "",
      model: "",
      year: 0,
      distanceTraveled: 0,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid grid-cols-2 gap-2 space-y-5", {
            "grid-cols-1": isMobile,
          })}
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
                  <Input
                    {...field}
                    placeholder="Vehicle year..."
                    type="number"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter className="col-span-full">
            <AlertDialogCancel asChild>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </AlertDialogCancel>
            <LoadingButton isLoading={loading.isLoading} type="submit">
              Add vehicle
            </LoadingButton>
          </AlertDialogFooter>
        </form>
      </Form>
    </div>
  );
}

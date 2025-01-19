import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";

import { getCarManufacturers } from "~/app/actions/vehicle";
import { addVehicleSchema } from "~/app/actions/vehicle-validators";

import { useLoading } from "~/hooks/use-loading";

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
import LoadingButton from "../ui/loading-button";

export default function AddVehicleForm() {
  const loading = useLoading();

  async function onSubmit(values: z.infer<typeof addVehicleSchema>) {
    loading.start();

    const res = await getCarManufacturers();

    console.log(res);

    loading.end();
  }

  const form = useForm<z.infer<typeof addVehicleSchema>>({
    resolver: zodResolver(addVehicleSchema),
    defaultValues: {
      type: "car",
      make: "hello",
      model: "hello",
      year: 2022,
      distanceTraveled: 123,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
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
          <AlertDialogFooter>
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

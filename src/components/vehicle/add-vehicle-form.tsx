"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { serverCreateUserVehicle } from "~/app/_actions/user";

import { cn } from "~/lib/utils";
import { addVehicleSchema } from "~/lib/validators/vehicle";

import { useAddVehicleDialog } from "~/context/add-vehicle-dialog-context";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Form } from "../ui/form";
import LoadingButton from "../ui/loading-button";

import AddVehicleFields from "./add-vehicle-fields";

export default function AddVehicleForm() {
  const loading = useLoading();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setIsOpen } = useAddVehicleDialog();

  async function onSubmit(values: z.infer<typeof addVehicleSchema>) {
    loading.start();

    const res = await serverCreateUserVehicle(values);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error,
      });
    } else {
      toast.success("Success", {
        description: "Vehicle has been added to your account",
      });
      setIsOpen(false);
      router.refresh();
    }

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
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Add Vehicle</CardTitle>
        <CardDescription>Add a new vehicle to your account</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent
            className={cn("grid grid-cols-2 gap-2 space-y-5", {
              "grid-cols-1": isMobile,
            })}
          >
            <AddVehicleFields form={form} />

            <div className="col-span-full flex flex-row justify-end">
              <LoadingButton
                isLoading={loading.isLoading}
                type="submit"
                loadingText="Adding vehicle"
                className="w-fit"
              >
                Add vehicle
              </LoadingButton>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}

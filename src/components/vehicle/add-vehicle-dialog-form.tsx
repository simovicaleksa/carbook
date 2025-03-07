"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { createUserVehicle } from "~/app/(dashboard)/dashboard/actions";

import { cn } from "~/lib/utils";
import { addVehicleSchema } from "~/lib/validators/vehicle";

import { useAddVehicleDialog } from "~/context/add-vehicle-dialog-context";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";

import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import LoadingButton from "../ui/loading-button";

import AddVehicleFields from "./add-vehicle-fields";

export default function AddVehicleDialogForm() {
  const loading = useLoading();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setIsOpen } = useAddVehicleDialog();

  async function onSubmit(values: z.infer<typeof addVehicleSchema>) {
    loading.start();

    const res = await createUserVehicle(values);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error.message,
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid grid-cols-2 gap-2 space-y-5", {
          "grid-cols-1": isMobile,
        })}
      >
        <AddVehicleFields form={form} />
        <AlertDialogFooter className="col-span-full">
          <AlertDialogCancel asChild>
            <Button variant={"outline"} type="button">
              Cancel
            </Button>
          </AlertDialogCancel>
          <LoadingButton
            isLoading={loading.isLoading}
            type="submit"
            loadingText="Adding vehicle"
          >
            Add vehicle
          </LoadingButton>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { createUserHistoryEvent } from "~/app/(dashboard)/dashboard/history/actions";

import { cn } from "~/lib/utils";
import { addHistoryEventSchema } from "~/lib/validators/history";

import { useAddHistoryEventDialog } from "~/context/add-history-event-dialog-context";
import { useSelectedVehicle } from "~/context/selected-vehicle-context";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";
import { useUnits } from "~/hooks/use-units";

import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import LoadingButton from "../ui/loading-button";

import { UpsertHistoryFormFields } from "./upsert-history-form-fields";

export default function AddHistoryEventForm() {
  const loading = useLoading();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setIsOpen } = useAddHistoryEventDialog();
  const { selectedVehicle } = useSelectedVehicle();
  const { formatDistance } = useUnits();

  async function onSubmit(values: z.infer<typeof addHistoryEventSchema>) {
    if (!selectedVehicle) return;

    loading.start();

    const res = await createUserHistoryEvent(selectedVehicle.id, values);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error,
      });
    } else {
      toast.success("Success", {
        description: "Event successfully added to vehicle history",
      });
      setIsOpen(false);
      router.refresh();
    }

    loading.end();
  }

  const form = useForm<z.infer<typeof addHistoryEventSchema>>({
    resolver: zodResolver(addHistoryEventSchema),
    defaultValues: {
      type: "refuel",
      description: "",
      cost: 0,
      atDistanceTraveled: formatDistance(
        selectedVehicle?.distanceTraveled ?? 0,
      ),
      date: new Date(),
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid grid-cols-3 items-end gap-2 space-y-5 p-5", {
            "grid-cols-1": isMobile,
          })}
        >
          <UpsertHistoryFormFields form={form} />

          <AlertDialogFooter className="col-span-full gap-2 sm:gap-2 sm:space-x-0">
            <AlertDialogCancel asChild>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </AlertDialogCancel>
            <LoadingButton
              isLoading={loading.isLoading}
              type="submit"
              loadingText="Adding event"
            >
              Add event
            </LoadingButton>
          </AlertDialogFooter>
        </form>
      </Form>
    </div>
  );
}

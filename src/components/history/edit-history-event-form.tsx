import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { updateVehicleHistoryEvent } from "~/app/(dashboard)/dashboard/history/actions";

import { cn } from "~/lib/utils";
import { addHistoryEventSchema } from "~/lib/validators/history";

import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
import { type EventType } from "~/context/events-context";
import { useInspectEventDialog } from "~/context/inspect-event-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";
import { useUnits } from "~/hooks/use-units";

import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Form } from "../ui/form";
import LoadingButton from "../ui/loading-button";

import { UpsertHistoryFormFields } from "./upsert-history-form-fields";

export default function EditHistoryEventForm() {
  const loading = useLoading();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setIsOpen } = useEditHistoryDialog();
  const { setIsOpen: setInspectDialogIsOpen } = useInspectEventDialog();
  const { event, setEvent } = useSelectedEvent();
  const { formatDistance } = useUnits();

  const handleCancel = () => setIsOpen(false);

  function onEventUpdate(updatedEvent: EventType) {
    router.refresh();

    setIsOpen(false);

    if (!updatedEvent) setInspectDialogIsOpen(false);
    else setEvent(updatedEvent);
  }

  async function onSubmit(values: z.infer<typeof addHistoryEventSchema>) {
    if (!event?.id) return;

    loading.start();

    const res = await updateVehicleHistoryEvent(event.id, values);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error,
      });
    } else {
      toast.success("Success", {
        description: "Event successfully added to vehicle history",
      });
      if (res.data) onEventUpdate(res.data);
    }

    loading.end();
  }

  const form = useForm<z.infer<typeof addHistoryEventSchema>>({
    resolver: zodResolver(addHistoryEventSchema),
    defaultValues: {
      type: event?.type ?? "refuel",
      description: event?.description ?? "",
      cost: event?.cost?.amount ?? 0,
      atDistanceTraveled: formatDistance(event?.atDistanceTraveled ?? 0),
      date: event?.date ? new Date(event.date) : new Date(),
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

          <DialogFooter className="col-span-full gap-2 sm:gap-2 sm:space-x-0">
            <Button variant={"outline"} type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <LoadingButton
              isLoading={loading.isLoading}
              type="submit"
              loadingText="Updating event"
            >
              Update event
            </LoadingButton>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { addHistoryEventSchema } from "~/app/actions/history-validators";
import { updateVehicleHistoryEvent } from "~/app/dashboard/history/actions";

import { cn } from "~/lib/utils";

import { useEditHistoryDialog } from "~/context/edit-history-dialog-context";
import { useSelectedEvent } from "~/context/selected-event-context";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";

import EventTypeRadio from "../input/event-type-radio";
import InputWithUnits from "../input/input-with-units";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
// import { DatePicker } from "../ui/date-picker";
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
import { Textarea } from "../ui/textarea";

export default function EditHistoryEventForm() {
  const loading = useLoading();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setIsOpen } = useEditHistoryDialog();
  const { event } = useSelectedEvent();

  const handleCancel = () => setIsOpen(false);

  async function onSubmit(values: z.infer<typeof addHistoryEventSchema>) {
    if (!event?.id) return;

    loading.start();

    const res = await updateVehicleHistoryEvent(event.id, values);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error?.message,
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
      type: event?.type ?? "refuel",
      description: event?.description ?? "",
      cost: 0,
      atDistanceTraveled: event?.atDistanceTraveled ?? 0,
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
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <EventTypeRadio
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
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <InputWithUnits {...field} units="USD" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="atDistanceTraveled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>At distance traveled</FormLabel>
                <FormControl>
                  <InputWithUnits {...field} units="km" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  {/* <DatePicker
                    value={field.value}
                    onValueChange={field.onChange}
                    modal
                  /> */}
                  <Input
                    type="date"
                    value={
                      field.value ? field.value.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Changed oil filters..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="col-span-full">
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

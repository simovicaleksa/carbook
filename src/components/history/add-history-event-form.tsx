import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { addHistoryEventSchema } from "~/app/actions/history-validators";
import { createUserHistoryEvent } from "~/app/dashboard/actions";

import { cn } from "~/lib/utils";

import { useAddHistoryEventDialog } from "~/context/add-history-event-dialog-context";
import { useSelectedVehicle } from "~/context/selected-vehicle-context";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";

import EventTypeRadio from "../input/event-type-radio";
import InputWithUnits from "../input/input-with-units";
import { AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import LoadingButton from "../ui/loading-button";
import { Textarea } from "../ui/textarea";

export default function AddHistoryEventForm() {
  const loading = useLoading();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { setIsOpen } = useAddHistoryEventDialog();
  const { selectedVehicle } = useSelectedVehicle();

  async function onSubmit(values: z.infer<typeof addHistoryEventSchema>) {
    if (!selectedVehicle) return;

    loading.start();

    const res = await createUserHistoryEvent(selectedVehicle.id, values);

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
      type: "refuel",
      description: "",
      cost: 0,
      atDistanceTraveled: selectedVehicle?.distanceTraveled ?? 0,
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
                  <DatePicker
                    value={field.value}
                    onValueChange={field.onChange}
                    modal
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

"use client";

import { type UseFormReturn } from "react-hook-form";

import { type z } from "zod";

import { type addHistoryEventSchema } from "~/lib/validators/history-validators";

import { useUserProfile } from "~/context/user-profile-context";

import EventTypeRadio from "../input/event-type-radio";
import InputWithUnits from "../input/input-with-units";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function UpsertHistoryFormFields({
  form,
}: {
  form: UseFormReturn<z.infer<typeof addHistoryEventSchema>>;
}) {
  const userProfile = useUserProfile();

  return (
    <>
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
              <InputWithUnits
                {...field}
                units={userProfile.preferredCurrency}
              />
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
              <InputWithUnits {...field} units={userProfile.preferredUnits} />
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
              <Input
                type="date"
                value={
                  field.value ? field.value.toISOString().split("T")[0] : ""
                }
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (!isNaN(newDate.getTime())) {
                    field.onChange(newDate);
                  } else {
                    field.onChange(null);
                  }
                }}
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
              <Textarea
                {...field}
                placeholder="Changed oil filters..."
                className="min-h-[180px] font-mono !text-lg leading-5 tracking-tight"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

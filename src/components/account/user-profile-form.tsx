"use client";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { serverUpdateUserProfile } from "~/app/_actions/user";

import { cn } from "~/lib/utils";
import { userProfileSchema } from "~/lib/validators/user-profile";

import { useUser } from "~/context/user-context";
import { useUserProfile } from "~/context/user-profile-context";

import { useLoading } from "~/hooks/use-loading";

import CurrencySelect from "../input/currency-select";
import UnitsSelect from "../input/units-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import LoadingButton from "../ui/loading-button";

export default function UserProfileForm() {
  const loading = useLoading();
  const router = useRouter();
  const userProfile = useUserProfile();
  const isDisabled = !userProfile || loading.isLoading;
  const user = useUser();

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      preferredCurrency: userProfile?.preferredCurrency,
      preferredUnits: userProfile?.preferredUnits,
    },
  });

  async function onSubmit(values: z.infer<typeof userProfileSchema>) {
    loading.start();

    const res = await serverUpdateUserProfile(user.id, values);

    if (!res.ok) {
      toast.error("Error", {
        description: res.error,
      });
    } else {
      toast.success("Success", {
        description: "Vehicle has been updated",
      });
      router.refresh();
    }
    loading.end();
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>User prefrences</CardTitle>
        <CardDescription>Update user preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-5")}
          >
            <FormField
              control={form.control}
              name="preferredUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Units</FormLabel>
                  <FormControl>
                    <UnitsSelect
                      onValueChange={(value) => value && field.onChange(value)}
                      value={field.value}
                      disabled={isDisabled}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferredCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <CurrencySelect
                      onValueChange={(value) => value && field.onChange(value)}
                      value={field.value}
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              isLoading={loading.isLoading}
              type="submit"
              loadingText="Updating preferences"
              disabled={isDisabled}
            >
              Update preferences
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { signUp } from "~/app/auth/signup/actions";
import { signupSchema } from "~/app/auth/signup/validators";

import { cn } from "~/lib/utils";

import { useLoading } from "~/hooks/use-loading";
import { useIsMobile } from "~/hooks/use-mobile";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import LoadingButton from "../ui/loading-button";

export default function SignupForm() {
  const isMobile = useIsMobile();
  const loading = useLoading();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    loading.start();

    const res = await signUp(values);

    if (res.error) {
      toast.error(`Error - ${res.status}`, {
        description: res.error.message,
      });
    }

    loading.end();
  }

  return (
    <Form {...form}>
      <form
        className={cn("grid grid-cols-2 gap-4", {
          "grid-cols-1": isMobile,
        })}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="First name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Last name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="col-span-full">
          <FormDescription>
            Already have an account?{" "}
            <Link
              className="text-blue-500 underline-offset-2 hover:underline"
              href={"/auth/login"}
            >
              Login
            </Link>
            .
          </FormDescription>
        </FormItem>
        <FormItem className="col-span-full">
          <LoadingButton
            isLoading={loading.isLoading}
            loadingText="Signing up"
            type="submit"
            className="w-full"
          >
            Sign up
          </LoadingButton>
        </FormItem>
        <FormItem className="col-span-full">
          <FormDescription className="text-xs">
            By clicking &quot;Sign up&quot; button you agree to our{" "}
            <Link
              className="text-blue-500 underline-offset-2 hover:underline"
              target="_blank"
              href={"/legal/terms"}
            >
              Terms of Service
            </Link>
            .
          </FormDescription>
        </FormItem>
      </form>
    </Form>
  );
}

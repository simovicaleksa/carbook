"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type z } from "zod";

import { login } from "~/app/auth/login/actions";
import { loginSchema } from "~/app/auth/login/validators";

import { useLoading } from "~/hooks/use-loading";

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

export default function LoginForm() {
  const loading = useLoading();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    loading.start();

    const res = await login(values);

    if (res.error) {
      toast.error(`Error - ${res.status}`, {
        description: res.error.message,
      });
    }

    loading.end();
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
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
        <FormItem className="col-span-full">
          <LoadingButton
            isLoading={loading.isLoading}
            loadingText="Logging in"
            type="submit"
          >
            Login
          </LoadingButton>
        </FormItem>
      </form>
    </Form>
  );
}

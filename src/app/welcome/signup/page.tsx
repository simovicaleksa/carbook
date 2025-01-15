import Link from "next/link";
import { redirect } from "next/navigation";

import { CircleCheck } from "lucide-react";

import { getCurrentSession } from "~/lib/server/auth";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function WelcomePage() {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Welcome, {`${user.firstName} ${user.lastName}`}!
          </CardTitle>
          <CardDescription>You&apos;ve successfully signed up</CardDescription>
        </CardHeader>
        <CardContent>
          <span className="flex flex-row items-center gap-2 text-sm">
            <CircleCheck className="size-6 text-green-500" /> Account created
          </span>
          <ul className="mt-5">
            <li className="text-sm">
              <span className="font-semibold">Username: </span>
              {user.username}
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button size={"sm"} asChild>
            <Link href={"/dashboard"}>Go to dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

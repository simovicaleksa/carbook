import { redirect } from "next/navigation";

import { getCurrentSession } from "~/lib/server/auth";

import LogoutDialog from "~/components/auth/signout-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function LogoutPage() {
  const { user } = await getCurrentSession();

  if (!user) return redirect("/auth/login");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign out</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            <li className="text-sm">
              <span className="font-semibold">Full name: </span>
              {` ${user.firstName} ${user.lastName}`}
            </li>
            <li className="text-sm">
              <span className="font-semibold">Username: </span>
              {user.username}
            </li>
            <li className="text-sm">
              <span className="font-semibold">Email: </span>
              {user.email}
            </li>
          </ul>
        </CardContent>
        <CardFooter className="justify-end">
          <LogoutDialog />
        </CardFooter>
      </Card>
    </main>
  );
}

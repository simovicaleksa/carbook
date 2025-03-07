import { redirect } from "next/navigation";

import { getCurrentSession } from "~/lib/server/auth";

import LoginCard from "~/components/auth/login-card";

export default async function LoginPage() {
  const { user } = await getCurrentSession();

  if (user) {
    return redirect("/welcome/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoginCard />
    </main>
  );
}

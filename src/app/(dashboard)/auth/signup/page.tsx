import { redirect } from "next/navigation";

import { getCurrentSession } from "~/lib/server/auth";

import SignupCard from "~/components/auth/signup-card";

export default async function SignupPage() {
  const { user } = await getCurrentSession();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignupCard />
    </main>
  );
}

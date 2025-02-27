"use cache";

import Features from "~/components/www/features/features";
import Hero from "~/components/www/hero/hero";

export default async function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
}

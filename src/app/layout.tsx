import { type Metadata } from "next";

import { Suspense } from "react";

import { GeistSans } from "geist/font/sans";

import "~/styles/globals.css";

import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Car Book",
  description: "Powered by Next.js",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Suspense>
          {children}
          <Toaster
            position="bottom-right"
            theme="light"
            duration={5000}
            visibleToasts={6}
            expand
          />
        </Suspense>
      </body>
    </html>
  );
}

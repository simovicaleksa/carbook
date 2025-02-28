import { type Metadata } from "next";
import { Inter, Koulen } from "next/font/google";

import { Suspense } from "react";

import "~/styles/globals.css";

import BackToTop from "~/components/dashboard/layout/back-to-top";

export const metadata: Metadata = {
  title: "Car Book",
  description: "Powered by Next.js",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const inter = Inter({
  weight: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const koulen = Koulen({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-koulen",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${koulen.variable} font-inter`}
    >
      <body>
        <Suspense>
          <BackToTop />
          {children}
        </Suspense>
      </body>
    </html>
  );
}

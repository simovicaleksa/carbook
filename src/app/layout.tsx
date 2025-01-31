import { type Metadata } from "next";

import { GeistSans } from "geist/font/sans";

import "~/styles/globals.css";

import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Car Book",
  description: "Powered by Next.js",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="light"
          duration={5000}
          visibleToasts={6}
          expand
        />
      </body>
    </html>
  );
}

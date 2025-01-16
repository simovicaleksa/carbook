import { type Metadata } from "next";

import { GeistSans } from "geist/font/sans";

import "~/styles/globals.css";

import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Car Book",
  description: "Powered by Next.js",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
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
          richColors
          theme="light"
          duration={3000}
          visibleToasts={6}
          closeButton
          expand
        />
      </body>
    </html>
  );
}

import { type Metadata } from "next";

import { GeistSans } from "geist/font/sans";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "CarBook",
  description: "Powered by Next.js",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

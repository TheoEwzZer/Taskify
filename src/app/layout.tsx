import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { NextFont } from "next/dist/compiled/@next/font";
import { Inter } from "next/font/google";
import { ReactElement } from "react";
import "./globals.css";

import { QueryProvider } from "@/components/query-provider";
import { cn } from "@/lib/utils";

const inter: NextFont = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taskify",
  description:
    "Simple tool for organizing and tracking tasks to enhance productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen antialiased")}>
        <link
          rel="icon"
          href="/icon.svg"
        />
        <Toaster />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

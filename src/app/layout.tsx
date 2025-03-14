import type { Metadata } from "next";
import "./globals.css";
import { Mulish, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Car Dealer System",
  description:
    "A car dealer system built with Next.js, Tailwind CSS, and Prisma.",
};

const mulish = Mulish({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased overscroll-none bg-background",
          mulish.variable,
          roboto.variable
        )}
      >
        {/* Type-safe search params state manager */}
        <NuqsAdapter>{children}</NuqsAdapter>
        {/* Shows a progress bar at the top of the page when navigating between pages */}
        <NextTopLoader showSpinner={false} />
        <Toaster />
      </body>
    </html>
  );
}

import { Inter as FontSans } from "next/font/google";
import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Flight Performance Study",
  description: "Flight Performance Study",
};

export default function GlobalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-full max-w-7xl flex flex-col bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Header />
        <main className="flex-1 flex flex-col items-center justify-between">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

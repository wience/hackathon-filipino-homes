import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Filipino Homes",
  description:
    "Find your dream home in the Philippines. Browse properties, condos, houses, and lots.",
  keywords:
    "real estate, property, homes, condos, Philippines, houses, lots, apartments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} ${inter.variable} flex flex-col min-h-screen antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50`}
      >
        <ThemeProvider defaultTheme="system" storageKey="filipino-homes-theme">
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muzium Negara · Kancil",
  description:
    "A modern chat guide to Muzium Negara, the National Museum in Kuala Lumpur. Ask Kancil, the clever mouse-deer, about the four permanent galleries and what's inside.",
  applicationName: "Muzium Negara Guide",
  appleWebApp: {
    capable: true,
    title: "Muzium Negara",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#a32638",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="bg-background text-foreground">
        {/* museum-red identity accent */}
        <div
          className="bg-primary fixed inset-x-0 top-0 z-50 h-1"
          aria-hidden
        />
        <div className="bg-background relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden shadow-sm">
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

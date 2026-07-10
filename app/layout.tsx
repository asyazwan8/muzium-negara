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
  title: "Muzium Negara Guide · Ara",
  description:
    "A modern chat guide to Muzium Negara, the National Museum in Kuala Lumpur. Ask Ara about the four permanent galleries and what's inside.",
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
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {/* museum-red identity accent */}
        <div className="bg-primary h-1 w-full shrink-0" aria-hidden />
        <div className="bg-background mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col shadow-sm">
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

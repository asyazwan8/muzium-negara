import type { Metadata, Viewport } from "next";
import { Inter, Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Nunito stands in for the library's Avenir: a rounded, friendly geometric sans
// for the Ara wordmark and headings.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Muzium Negara Guide · Ara",
  description:
    "Ara is a warm, grounded chat guide to Muzium Negara, the National Museum in Kuala Lumpur. Ask about the four galleries and what's inside.",
  applicationName: "Muzium Negara Guide",
  appleWebApp: {
    capable: true,
    title: "Muzium Negara",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F5",
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
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <div className="bg-background mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col">
          {children}
        </div>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

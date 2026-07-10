import type { Metadata, Viewport } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Storybook pairing: Nunito for warm, rounded body text and Baloo 2 for the
// friendly, chunky display and pantun headings.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
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
  themeColor: "#c8a54d",
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
      className={`${nunito.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground">
        {/* gold-and-silver identity accent */}
        <div
          className="fixed inset-x-0 top-0 z-50 h-1"
          style={{
            background:
              "linear-gradient(90deg, var(--gold), var(--silver), var(--gold))",
          }}
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

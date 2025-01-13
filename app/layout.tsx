

import type { Metadata } from "next";
import { Rozha_One, Laila, Arya } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/utils/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

// Extract font configurations
const rozhaOne = Rozha_One({
  weight: "400",
  subsets: ["latin","devanagari"],
  variable: "--font-rozha-one",
  display: "swap", // Add display swap for better performance
});

const laila = Laila({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin","devanagari"],
  variable: "--font-laila",
});

const arya = Arya({
  weight: ["400","700"],
  subsets: ["latin","devanagari"],
  variable: "--font-arya",
});


export const metadata: Metadata = {
  title: "Parikhsa Mitra",
  description: "A platform for marathi medium students",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rozhaOne.variable} ${laila.variable} ${arya.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

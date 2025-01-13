import type { Metadata } from "next";
import { Rozha_One, Laila, Arya } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/utils/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const rozhaOne = Rozha_One({
  weight: "400",
  subsets: ["latin","devanagari"],
  variable: "--font-rozha-one",
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
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

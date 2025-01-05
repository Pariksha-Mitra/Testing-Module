import type { Metadata } from "next";
import { Rozha_One, Laila } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/utils/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const rozhaOne = Rozha_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rozha-one",
});

const laila = Laila({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-laila",
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
        className={`${rozhaOne.variable} ${laila.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

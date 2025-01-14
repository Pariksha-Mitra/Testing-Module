import AuthProvider from '@/utils/AuthProvider';
import { Laila, Rozha_One } from 'next/font/google';
import { ToastProvider } from '@/components/ui/ToastProvider';
import './globals.css';
import type { Metadata } from "next";

// Extract font configurations
const rozhaOne = Rozha_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-rozha-one",
  display: "swap", // Add display swap for better performance
});

const laila = Laila({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-laila",
  display: "swap",
});

// Add more detailed metadata
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
        className={`${rozhaOne.variable} ${laila.variable} antialiased min-h-screen`}
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

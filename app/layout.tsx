import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/Provider";
import { Toaster } from "sonner";
import AuthGuard from "@/components/guard/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lubna Fashion",
  description: "fashion wanita kekinian",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
         <AuthGuard> 
        {children}
        <Toaster richColors position="top-center" className="h-8 w-8" />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}

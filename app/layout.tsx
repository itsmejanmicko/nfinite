import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/authcontext";
import { GlobalFetchProvider } from "@/context/globalfetch";
import ClientWrapper from "./client-wrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nfinite Device",
  description: "A comprehensive device management solution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <GlobalFetchProvider>
            <Toaster position="top-center" richColors />
            <ClientWrapper>{children}</ClientWrapper>
          </GlobalFetchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

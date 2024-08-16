import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from "@clerk/nextjs";
import Header from "@/components/Header";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI editor",
  description: "Image and Video editor with Artificial Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}><Header/>{children}<Toaster/></body>
    </html>
    </ClerkProvider>
  );
}

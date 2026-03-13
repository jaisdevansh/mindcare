import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "MindCare | Talk. Track. Heal.",
  description: "AI-powered emotional wellness platform. Track your mood, chat with AI, and connect with anonymous human helpers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} bg-[#0B0F2A] text-[#E6EDF3] antialiased`}>
        <Toaster position="top-center" />
        <SmoothScroll>
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}

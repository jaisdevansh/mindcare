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
  icons: {
    icon: [
      { url: '/logo.svg?v=3', type: 'image/svg+xml', sizes: 'any' },
      { url: '/logo.svg?v=3', sizes: '32x32' },
      { url: '/logo.svg?v=3', sizes: '16x16' }
    ],
    shortcut: '/logo.svg?v=3',
    apple: '/logo.svg?v=3',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg?v=3" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg?v=3" />
        <link rel="apple-touch-icon" href="/logo.svg?v=3" />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} bg-[#0B0F2A] text-[#E6EDF3] antialiased`}>
        <Toaster position="top-center" />
        <SmoothScroll>
          <MainLayoutWrapper>{children}</MainLayoutWrapper>
        </SmoothScroll>
      </body>
    </html>
  );
}

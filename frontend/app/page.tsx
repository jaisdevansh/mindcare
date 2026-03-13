"use client";

import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { Features } from "@/components/landing/Features";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Features />
    </div>
  );
}

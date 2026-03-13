'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const HeroSection = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen">
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">

                {/* Subtle Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#6A8DFF] text-[13px] font-medium tracking-wide mb-8 shadow-inner backdrop-blur-md"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF] animate-pulse" />
                    Your safe space for mental support
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                >
                    Talk. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] via-[#5B6CFF] to-[#6A8DFF]">Track.</span> Heal.
                </motion.h1>

                {/* Description */}
                <motion.p
                    className="text-lg md:text-xl text-[#9DA7B3] mb-12 max-w-2xl mx-auto leading-relaxed font-light"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    MindCare Connect is an AI-powered mental wellness platform. Get insights, track your mood, and talk anonymously with verified human helpers.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <Link href="/register" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto h-14 px-8 text-[15px] font-semibold bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl shadow-[0_0_20px_rgba(124,92,255,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,92,255,0.6)] hover:scale-[1.03] active:scale-[0.98]">
                            Start Assessment
                        </button>
                    </Link>
                    <Link href="/ai-chat" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto h-14 px-8 text-[15px] font-medium bg-white/5 border border-white/10 text-white rounded-xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:scale-[1.03] active:scale-[0.98]">
                            Talk to AI
                        </button>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
};

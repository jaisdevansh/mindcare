"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { Sparkles, Bot, ArrowRight } from "lucide-react";
import { NeuralBrain } from "./landing/NeuralBrain";

export const HeroSection = () => {
    const [isHovered, setIsHovered] = useState(false);

    // Mouse Parallax Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const dx = useSpring(mouseX, springConfig);
    const dy = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 40;
            const y = (clientY / window.innerHeight - 0.5) * 40;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const rotateX = useTransform(dy, [-20, 20], [5, -5]);
    const rotateY = useTransform(dx, [-20, 20], [-5, 5]);

    const headline = "The Future of Mental Support";
    const words = headline.split(" ");

    return (
        <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden bg-transparent">
            {/* ── Vivid animated brain fills entire background ── */}
            <NeuralBrain />

            {/* ── Synced ambient pulse rings (match brain 14s float cycle) ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
                {[1, 2, 3, 4, 5].map((ring) => (
                    <div
                        key={ring}
                        className="absolute rounded-full border border-[#7C5CFF]/10"
                        style={{
                            width: `${30 + ring * 15}vw`,
                            height: `${30 + ring * 15}vw`,
                            animation: `pulse ${4 + ring * 1.5}s ease-in-out infinite`,
                            animationDelay: `${ring * 0.6}s`,
                            opacity: 0.4 - ring * 0.05,
                        }}
                    />
                ))}
            </div>

            {/* ── Main center glow disk ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[#7C5CFF]/[0.05] rounded-full blur-[160px] pointer-events-none z-[1]" />
            {/* Left lobe accent glow */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#5B6CFF]/[0.03] rounded-full blur-[120px] pointer-events-none z-[1]" />
            {/* Right lobe accent glow */}
            <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#8B5CF6]/[0.03] rounded-full blur-[120px] pointer-events-none z-[1]" />

            <motion.div
                style={{
                    perspective: 1000,
                    rotateX,
                    rotateY,
                }}
                className="max-w-7xl mx-auto px-6 text-center relative z-20 flex flex-col items-center will-change-transform"
            >
                {/* Micro Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl mb-6 shadow-[0_0_40px_rgba(124,92,255,0.08)] group cursor-default"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF] shadow-[0_0_12px_#7C5CFF]" />
                    <span className="text-[9px] font-black text-white/50 tracking-[0.3em] uppercase">
                        Neural Intelligence Hub
                    </span>
                    <Sparkles className="w-3 h-3 text-[#7C5CFF] group-hover:rotate-12 transition-transform" />
                </motion.div>

                {/* Headline - Word Stagger */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-[950] text-white mb-6 leading-[1] tracking-[-0.04em] flex flex-wrap justify-center items-center gap-x-[0.1em] gap-y-[0.1em] max-w-5xl mx-auto">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                                duration: 1.2,
                                delay: 0.08 * i,
                                ease: [0.2, 0.8, 0.2, 1]
                            }}
                            className="inline-block will-change-[transform,opacity,filter]"
                        >
                            {word === "Mental" || word === "Support" ? (
                                <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#7C5CFF] to-[#5B6CFF] drop-shadow-[0_0_20px_rgba(124,92,255,0.2)]">
                                    {word}
                                </span>
                            ) : (
                                <span className="text-white drop-shadow-2xl">{word}</span>
                            )}
                        </motion.span>
                    ))}
                </h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                    className="text-base md:text-lg lg:text-xl text-[#9DA7B3] mb-10 max-w-xl mx-auto leading-relaxed font-light will-change-[transform,opacity]"
                >
                    MindCare merges <span className="text-white font-medium italic">neural-precision</span> with deep human empathy to build a sanctuary for your mind.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full will-change-[transform,opacity]"
                >
                    <Link href="/signup" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto h-14 px-12 text-[15px] font-bold bg-white text-black rounded-full flex items-center justify-center gap-2 transition-all relative overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <span className="relative z-10">Start Your Journey</span>
                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                    <Link href="/login" className="w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2, backgroundColor: "rgba(255,255,255,0.12)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto h-14 px-12 text-[15px] font-bold bg-white/5 border border-white/10 text-white rounded-full backdrop-blur-xl flex items-center justify-center gap-2 transition-all group"
                        >
                            <Bot className="w-5 h-5 text-[#7C5CFF] group-hover:scale-110 transition-transform" />
                            <span className="transition-colors">Talk to AI</span>
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-16 flex flex-col items-center gap-4"
                >
                    <div className="w-[1px] h-10 bg-gradient-to-b from-[#7C5CFF]/60 to-transparent relative">
                        <motion.div
                            animate={{ y: [0, 36, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-0 left-[-1.5px] w-[4px] h-[4px] bg-[#7C5CFF] rounded-full shadow-[0_0_10px_#7C5CFF]"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

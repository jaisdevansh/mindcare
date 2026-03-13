"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Target, Users, Network, Heart } from "lucide-react";

export default function AboutPage() {
    const values = [
        { title: "Empathetic Technology", desc: "Our AI is built on psychological frameworks to provide truly sensitive listening.", icon: Brain },
        { title: "Universal Accessibility", desc: "Breaking down financial barriers to high-quality mental wellness tools.", icon: Network },
        { title: "Absolute User Privacy", desc: "End-to-end encryption and total anonymity at the human connection level.", icon: Heart }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-44 flex flex-col items-center">
            <div className="text-center max-w-3xl mb-24">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
                >
                    A Mission for the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">Modern Mind</span>
                </motion.h1>
                <p className="text-lg md:text-xl text-[#9DA7B3] leading-relaxed font-light">
                    Founded in a world of increasing noise and digital isolation, MindCare exists to provide a bridge back to safe, empathetic connection and internal clarity.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-40">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFF]/10 blur-[80px] rounded-full" />
                    <Target className="w-10 h-10 text-[#7C5CFF] mb-6 stroke-[1.5]" />
                    <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
                    <p className="text-[#9DA7B3] leading-relaxed font-light mb-8 italic">
                        {"\"To ensure that no one ever has to face their mental internal struggles entirely alone, regardless of their financial or social standing.\""}
                    </p>
                    <p className="text-[#9DA7B3] leading-relaxed font-light">
                        We believe in a future where high-quality mental wellness is a standard human right, not a luxury. By merging the scale of AI with the warmth of human empathy, we can reach millions.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {values.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-6 items-start"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                                <v.icon className="w-6 h-6 text-[#7C5CFF]" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white mb-2">{v.title}</h4>
                                <p className="text-[#9DA7B3] text-sm font-light leading-relaxed">{v.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="w-full grid lg:grid-cols-2 gap-20 items-center">
                <div className="order-2 lg:order-1 flex flex-col items-center">
                    <div className="relative w-full max-w-sm h-80 flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#141B3A] to-[#0B0F2A] rounded-[3rem] border border-white/10 animate-float" />
                        <Sparkles className="w-32 h-32 text-white/10 group-hover:text-white/20 transition-colors duration-500 scale-150 rotate-12" />
                        <Users className="w-20 h-20 text-[#7C5CFF] absolute top-10 right-10 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                        <Brain className="w-24 h-24 text-[#5B6CFF] absolute bottom-12 left-12 opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <h3 className="text-3xl font-bold text-white mb-8 tracking-tight">AI & Humans, Together</h3>
                    <p className="text-[#9DA7B3] leading-relaxed mb-6 font-light">
                        The MindCare architecture is dual-layered. AI provides instant, scalable, non-judgmental support for immediate emotional processing and data-driven insights.
                    </p>
                    <p className="text-[#9DA7B3] leading-relaxed font-light">
                        Meanwhile, our verified human helpers provide that critical, soul-to-soul connection that only a fellow human can offer. Together, they form a complete safety net for your digital and physical mental well-being.
                    </p>
                </div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Shield, Zap, Heart } from "lucide-react";

const features = [
    {
        title: "Neural Insights",
        description: "Our AI understands the nuances of your emotional state, providing deep reflections.",
        icon: Brain,
        color: "#7C5CFF"
    },
    {
        title: "Total Privacy",
        description: "Your data is encrypted and anonymous. A safe haven for your true thoughts.",
        icon: Shield,
        color: "#5B6CFF"
    },
    {
        title: "Instant Support",
        description: "AI that responds in milliseconds, ensuring you're never left waiting in silence.",
        icon: Zap,
        color: "#6A8DFF"
    },
    {
        title: "Human Empathy",
        description: "Connect with verified human helpers who listen without judgment.",
        icon: Heart,
        color: "#FF5C8D"
    }
];

export const Features = () => {
    return (
        <section className="py-24 px-6 relative z-10 bg-[#02040A]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-black text-white mb-6"
                    >
                        Designed for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">Peace of Mind</span>
                    </motion.h2>
                    <p className="text-[#9DA7B3] text-lg max-w-2xl mx-auto">
                        We've built a multi-layered ecosystem to support you through every high and low.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md hover:bg-white/[0.04] transition-all group"
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: `${feature.color}20`, border: `1px solid ${feature.color}40` }}
                            >
                                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-[#9DA7B3] leading-relaxed italic text-sm">
                                "{feature.description}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

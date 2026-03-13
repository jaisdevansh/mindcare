'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, LineChart, HeartHandshake, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const features = [
    {
        id: 1,
        title: 'AI Emotional Listener',
        description: 'A non-judgmental, always-available AI assistant trained in therapeutic listening to help you process your thoughts.',
        icon: Bot,
        color: 'text-[#7C5CFF]',
        bg: 'bg-[#7C5CFF]/10',
        border: 'border-[#7C5CFF]/20'
    },
    {
        id: 2,
        title: 'Mood Analytics Dashboard',
        description: 'Track your daily mood, receive weekly insights, and understand your personal wellness trends over time.',
        icon: LineChart,
        color: 'text-[#6A8DFF]',
        bg: 'bg-[#6A8DFF]/10',
        border: 'border-[#6A8DFF]/20'
    },
    {
        id: 3,
        title: 'Verified Human Helpers',
        description: 'Connect with trained peers for anonymous 1-on-1 support sessions when you need someone to talk to.',
        icon: HeartHandshake,
        color: 'text-[#5B6CFF]',
        bg: 'bg-[#5B6CFF]/10',
        border: 'border-[#5B6CFF]/20'
    },
    {
        id: 4,
        title: 'Anonymous Community Support',
        description: 'Share your struggles and triumphs completely anonymously in a safe, moderated community forum.',
        icon: ShieldAlert,
        color: 'text-[#7C5CFF]',
        bg: 'bg-[#7C5CFF]/10',
        border: 'border-[#7C5CFF]/20'
    }
];

export const FeaturesSection = () => {
    return (
        <section className="py-24 relative z-10 w-full" id="features">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6"
                    >
                        Comprehensive Support
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[#9DA7B3] font-light"
                    >
                        Everything you need to manage your mental well-being securely in one place, powered by advanced empathetic AI.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="h-full"
                        >
                            <div className="h-full bg-white/[0.02] border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-all duration-300 group hover:bg-white/[0.04] relative overflow-hidden backdrop-blur-sm">

                                {/* Subtle Hover Gradient Base */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                <div className={`w-12 h-12 rounded-xl border ${feature.bg} ${feature.border} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-inner`}>
                                    <feature.icon className={`w-6 h-6 stroke-[1.5] ${feature.color}`} />
                                </div>

                                <h3 className="text-[17px] font-semibold text-white mb-3 tracking-wide">{feature.title}</h3>

                                <p className="text-[14px] text-[#9DA7B3] font-light leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

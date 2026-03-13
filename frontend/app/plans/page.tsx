"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Info, Sparkles, MessageCircle, HeartHandshake } from "lucide-react";

export default function PricingPage() {
    const plans = [
        {
            name: "Basic Session",
            price: "Free",
            description: "Essential wellness tools for everyone, always.",
            icon: Sparkles,
            features: [
                "Daily Mood Tracking",
                "AI Emotional Support",
                "Public Discussion Feed",
                "Basic Wellness Insights",
                "Mobile App Access"
            ],
            cta: "Join Now",
            highlight: false
        },
        {
            name: "Premium Support",
            price: "₹199",
            description: "Deep emotional analytics and priority human help.",
            icon: MessageCircle,
            features: [
                "Everything in Basic",
                "Priority Helper Queue",
                "Advanced AI Analysis",
                "Weekly Growth Reports",
                "Expert Consultation"
            ],
            cta: "Go Premium",
            highlight: true
        },
        {
            name: "Human Helper",
            price: "Apply",
            description: "Empower others and earn within the community.",
            icon: HeartHandshake,
            features: [
                "Verified Helper Badge",
                "Help Users & Earn Credits",
                "Advanced Training Deck",
                "Private Helper Forum",
                "Helper Dashboard Tools"
            ],
            cta: "Apply to Help",
            highlight: false
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-44 flex flex-col items-center">
            <div className="text-center max-w-3xl mb-24">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
                >
                    Wellness Plans <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">for Every Mind</span>
                </motion.h1>
                <p className="text-lg md:text-xl text-[#9DA7B3] leading-relaxed font-light">
                    Mental health support shouldn't be a luxury. We offer transparent plans designed to provide high-quality care at every level.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-32 relative z-10">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`relative rounded-3xl p-10 border transition-all duration-300 flex flex-col h-full ${plan.highlight
                            ? "bg-[#141B3A]/60 border-[#7C5CFF]/30 ring-2 ring-[#7C5CFF]/10 shadow-[0_0_50px_rgba(124,92,255,0.1)]"
                            : "bg-white/5 border-white/5 hover:border-white/10"
                            } backdrop-blur-2xl`}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7C5CFF] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 flex items-center justify-center mb-6">
                                <plan.icon className="w-8 h-8 text-[#7C5CFF]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-[#9DA7B3] text-sm text-center font-light leading-relaxed">{plan.description}</p>
                        </div>

                        <div className="mb-10 text-center items-baseline gap-1 flex justify-center">
                            <span className="text-5xl font-black text-white">{plan.price}</span>
                            {plan.price.includes('₹') && <span className="text-[#9DA7B3] font-light text-sm ml-1">/mo</span>}
                        </div>

                        <ul className="space-y-5 mb-12 flex-1">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-3 text-sm text-[#9DA7B3] font-light">
                                    <Check className="w-5 h-5 text-[#7C5CFF] stroke-[3]" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <Link href="/login" className="w-full">
                            <button
                                className={`w-full h-14 rounded-2xl text-[14px] font-bold transition-all uppercase tracking-widest ${plan.highlight
                                    ? "bg-[#7C5CFF] text-white hover:scale-[1.03] shadow-[0_0_25px_rgba(124,92,255,0.3)]"
                                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="w-full max-w-4xl bg-white/[0.02] border border-white/10 rounded-3xl p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6A8DFF]/5 blur-[100px] rounded-full" />
                <div className="flex items-center gap-3 mb-8">
                    <Info className="w-5 h-5 text-[#7C5CFF]" />
                    <h3 className="text-xl font-bold text-white tracking-wide">Feature Comparison</h3>
                </div>
                <div className="space-y-4 text-left">
                    {[
                        { f: "Total Privacy Protection", b: true, p: true, h: true },
                        { f: "AI Conversation Storage", b: "3 Days", p: "Unlimited", h: "N/A" },
                        { f: "Human Support Hours", b: "Limited", p: "Priority", h: "Full Access" }
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                            <span className="text-sm font-light text-[#9DA7B3]">{row.f}</span>
                            <div className="flex gap-10 md:gap-16 text-xs font-bold text-white/50">
                                <span className={typeof row.b === 'boolean' ? "text-[#7C5CFF]" : ""}>{typeof row.b === 'boolean' ? "✓" : row.b}</span>
                                <span className={typeof row.p === 'boolean' ? "text-[#7C5CFF]" : ""}>{typeof row.p === 'boolean' ? "✓" : row.p}</span>
                                <span className={typeof row.h === 'boolean' ? "text-[#7C5CFF]" : ""}>{typeof row.h === 'boolean' ? "✓" : row.h}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

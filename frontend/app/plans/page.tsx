"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, MessageCircle, HeartHandshake, Phone, IndianRupee, Zap, Shield } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "0",
        billing: "Always free",
        description: "Essential wellness tools for everyone.",
        icon: Sparkles,
        color: "from-[#7C5CFF]/20 to-transparent",
        border: "border-white/[0.08]",
        badge: null,
        features: [
            "Daily Mood Tracking",
            "AI Emotional Support (unlimited)",
            "Public Community Feed",
            "Mental Score Reports",
            "Wellness History",
        ],
        cta: "Get Started",
        ctaHref: "/signup",
        ctaStyle: "bg-white/[0.06] border border-white/[0.12] text-white hover:bg-white/[0.1]",
    },
    {
        name: "Chat Session",
        price: "10",
        billing: "per session",
        description: "One-on-one text chat with a verified helper.",
        icon: MessageCircle,
        color: "from-[#7C5CFF]/30 to-[#5B6CFF]/10",
        border: "border-[#7C5CFF]/40",
        badge: "Most Popular",
        features: [
            "Everything in Free",
            "Unlimited messages per session",
            "Verified human helper",
            "100% anonymous identity",
            "Instant connection",
        ],
        cta: "Start Chat — ₹10",
        ctaHref: "/helpers",
        ctaStyle: "bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white shadow-xl shadow-[#7C5CFF]/25 hover:opacity-90",
    },
    {
        name: "Voice Call",
        price: "30",
        billing: "per 30 min",
        description: "Private voice session with a trained peer helper.",
        icon: Phone,
        color: "from-emerald-500/20 to-transparent",
        border: "border-emerald-500/30",
        badge: null,
        features: [
            "Everything in Free",
            "30-minute voice session",
            "Verified & trained helper",
            "End-to-end encrypted",
            "Post-call summary notes",
        ],
        cta: "Book a Call — ₹30",
        ctaHref: "/helpers",
        ctaStyle: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:opacity-90",
    },
    {
        name: "Become a Helper",
        price: "Free",
        billing: "to apply",
        description: "Empower others and earn within the community.",
        icon: HeartHandshake,
        color: "from-rose-500/10 to-transparent",
        border: "border-white/[0.08]",
        badge: null,
        features: [
            "Verified Helper Badge",
            "Earn from sessions",
            "Helper dashboard",
            "Training resources",
            "Community recognition",
        ],
        cta: "Apply to Help",
        ctaHref: "/helpers",
        ctaStyle: "bg-white/[0.06] border border-white/[0.12] text-white hover:bg-white/[0.1]",
    },
];

const compare = [
    { feature: "Mood Tracking", free: true, chat: true, call: true },
    { feature: "AI Support", free: true, chat: true, call: true },
    { feature: "Human Helper Access", free: false, chat: true, call: true },
    { feature: "Session Type", free: "—", chat: "Text Chat", call: "Voice Call" },
    { feature: "Session Duration", free: "—", chat: "Unlimited", call: "30 min" },
    { feature: "Price", free: "₹0", chat: "₹10", call: "₹30" },
    { feature: "Anonymous Identity", free: true, chat: true, call: true },
    { feature: "Secure Payment", free: "—", chat: "Razorpay", call: "Razorpay" },
];

export default function PricingPage() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center">
            {/* Header */}
            <div className="text-center max-w-3xl mb-20">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-full text-[#A78BFA] text-[11px] font-black uppercase tracking-widest mb-6"
                >
                    <Zap className="w-3 h-3" /> Simple & Transparent Pricing
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-5xl md:text-6xl font-black text-white mb-5 tracking-tight"
                >
                    Pay Only for<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">What You Use</span>
                </motion.h1>
                <p className="text-lg text-[#9DA7B3] leading-relaxed">
                    No subscriptions. No hidden fees. AI support is always free —
                    pay only when you connect with a real human helper.
                </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full mb-20">
                {plans.map((plan, i) => {
                    const Icon = plan.icon;
                    return (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className={`relative rounded-3xl p-7 border bg-gradient-to-br ${plan.color} ${plan.border} flex flex-col h-full backdrop-blur-xl hover:scale-[1.02] transition-all duration-300`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#7C5CFF] text-white text-[9px] font-black uppercase tracking-[0.18em] px-4 py-1.5 rounded-full shadow-lg">
                                    {plan.badge}
                                </div>
                            )}

                            {/* Icon + Name */}
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-[#7C5CFF]" />
                                </div>
                                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                                <p className="text-xs text-[#9DA7B3] mt-1 leading-relaxed">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1 mb-6">
                                {plan.price !== "0" && plan.price !== "Free" && (
                                    <IndianRupee className="w-5 h-5 text-white mb-0.5" />
                                )}
                                <span className="text-4xl font-black text-white">
                                    {plan.price === "0" ? "Free" : plan.price === "Free" ? "Free" : plan.price}
                                </span>
                                <span className="text-[#9DA7B3] text-xs ml-1">{plan.billing}</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#9DA7B3]">
                                        <Check className="w-4 h-4 text-[#7C5CFF] stroke-[2.5] shrink-0 mt-0.5" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.ctaHref} className="w-full">
                                <button className={`w-full h-11 rounded-2xl text-sm font-bold transition-all ${plan.ctaStyle}`}>
                                    {plan.cta}
                                </button>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Comparison Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-3xl bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
                    <Shield className="w-4 h-4 text-[#7C5CFF]" />
                    <h3 className="font-black text-white text-sm">Full Feature Comparison</h3>
                </div>
                {/* Column headers */}
                <div className="grid grid-cols-4 px-6 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                    <span className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest">Feature</span>
                    <span className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest text-center">Free</span>
                    <span className="text-[10px] font-black text-[#7C5CFF] uppercase tracking-widest text-center">Chat ₹10</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest text-center">Call ₹30</span>
                </div>
                {compare.map((row, i) => (
                    <div key={i} className={`grid grid-cols-4 px-6 py-4 items-center ${i !== compare.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                        <span className="text-sm text-[#9DA7B3]">{row.feature}</span>
                        {[row.free, row.chat, row.call].map((val, j) => (
                            <span key={j} className="text-center">
                                {val === true
                                    ? <Check className="w-4 h-4 text-[#7C5CFF] stroke-[2.5] mx-auto" />
                                    : val === false
                                        ? <span className="text-white/20 text-lg">—</span>
                                        : <span className="text-xs font-bold text-white/70">{val}</span>}
                            </span>
                        ))}
                    </div>
                ))}
            </motion.div>

            {/* Trust strip */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-6 mt-14 text-[11px] text-[#9DA7B3] font-medium"
            >
                {["Secured by Razorpay", "No subscriptions", "Cancel anytime", "100% anonymous sessions", "HIPAA-friendly design"].map(t => (
                    <span key={t} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" /> {t}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

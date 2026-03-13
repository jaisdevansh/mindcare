"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserCheck, Heart, Shield, ArrowRight, Star, Users } from "lucide-react";

export default function HelpersPage() {
    const helpers = [
        { name: "Sarah J.", role: "Verified Listener", rating: 4.9, sessions: 124 },
        { name: "David K.", role: "Certified Empathetic Support", rating: 5.0, sessions: 86 },
        { name: "Elena R.", role: "Mental Health Advocate", rating: 4.8, sessions: 215 }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-44 flex flex-col items-center">
            <div className="text-center max-w-3xl mb-24">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
                >
                    Human Connection <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">When it Matters</span>
                </motion.h1>
                <p className="text-lg md:text-xl text-[#9DA7B3] leading-relaxed font-light">
                    Sometimes technology isn't enough. Our verified human helpers are sensitive, trained peers ready to listen and support you through life's stressors in an entirely anonymous space.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
                <div className="space-y-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Support from Real People</h2>
                        <p className="text-[#9DA7B3] leading-relaxed font-light">
                            Our helpers aren't just names—they are individuals who have chosen to dedicate their time to empathy. Every conversation is private, secure, and focused entirely on you.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {[
                            { icon: UserCheck, title: "Verified Empathy Experts", desc: "Every helper goes through background checks and deep empathy training." },
                            { icon: Shield, title: "End-to-End Privacy", desc: "You never share real identities or personal details. Sessions stay anonymous." },
                            { icon: Heart, title: "No Financial Barriers", desc: "Access high-quality human listening without the massive therapy costs." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#5B6CFF]/10 flex items-center justify-center border border-[#5B6CFF]/20 shrink-0">
                                    <item.icon className="w-5 h-5 text-[#5B6CFF]" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white tracking-wide">{item.title}</h4>
                                    <p className="text-[#9DA7B3] text-sm font-light leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    {helpers.map((helper, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md opacity-40 hover:opacity-100 transition-all cursor-default scale-95 hover:scale-100"
                        >
                            <div className="flex flex-col gap-4 text-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1B2150] to-[#141B3A] mx-auto border border-white/10 flex items-center justify-center text-white/40">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{helper.name}</h4>
                                    <p className="text-[#9DA7B3] text-xs font-light tracking-wide">{helper.role}</p>
                                </div>
                                <div className="flex items-center gap-1 justify-center text-[#7C5CFF]">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                                    <span className="text-[10px] ml-1 font-bold">{helper.rating}</span>
                                </div>
                                <p className="text-[#9DA7B3] text-[10px] font-bold tracking-widest uppercase">
                                    {helper.sessions}+ Sessions Helped
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Become a Helper Section */}
            <div className="w-full max-w-7xl grid md:grid-cols-2 gap-8 mb-40">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md flex flex-col justify-center">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                        <Heart className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Want to help others?</h3>
                    <p className="text-[#9DA7B3] leading-relaxed mb-8 font-light">
                        Join our community of verified human helpers. If you're a good listener and want to make a difference, we'll provide the training and tools you need to support others.
                    </p>
                    <Link href="/apply-helper">
                        <button className="flex items-center gap-2 text-white font-bold group">
                            Become a Helper <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
                <div className="bg-gradient-to-br from-[#7C5CFF]/10 to-transparent border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-sm flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <UserCheck className="w-32 h-32 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Verified & Trusted</h3>
                    <p className="text-[#9DA7B3] leading-relaxed mb-4 font-light">
                        Every helper on MindCare is thoroughly vetted to ensure they meet our high standards for empathy and professionalism.
                    </p>
                    <ul className="space-y-3">
                        {['Identity Verification', 'Empathy Training', 'Continuous Assessment'].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="w-full max-w-4xl bg-gradient-to-br from-[#141B3A] to-[#0B0F2A] border border-[#5B6CFF]/20 p-12 md:p-20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Connect and begin <br /> your healing Journey.</h2>
                <p className="text-[#9DA7B3] mb-12 max-w-xl mx-auto font-light leading-relaxed">
                    Login to access active human helper sessions in real-time. Start talking to a verified peer today.
                </p>
                <Link href="/login">
                    <button className="h-14 px-10 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-2xl text-[15px] font-bold shadow-[0_0_20px_rgba(124,92,255,0.3)] hover:shadow-[0_0_40px_rgba(124,92,255,0.5)] hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-2 mx-auto uppercase tracking-widest">
                        Talk to a Helper <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

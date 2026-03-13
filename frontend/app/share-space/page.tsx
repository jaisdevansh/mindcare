"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Heart, ShieldCheck, ArrowRight } from "lucide-react";

export default function CommunityPage() {
    const examplePosts = [
        { mood: "Anxious", content: "Lately I've been feeling like I'm not doing enough even when I'm working 12 hours a day. How do others handle this guilt?", likes: 42, replies: 12 },
        { mood: "Hopeful", content: "Started my first session with a helper today. It was terrifying at first but finally feeling like I'm moving in the right direction.", likes: 128, replies: 24 },
        { mood: "Overwhelmed", content: "Is it normal to feel like everything is changing too fast? I'm struggling to keep up with my own transitions.", likes: 85, replies: 19 }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-44 flex flex-col items-center">
            <div className="text-center max-w-3xl mb-24">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
                >
                    A Garden of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">Shared Strength</span>
                </motion.h1>
                <p className="text-lg md:text-xl text-[#9DA7B3] leading-relaxed font-light">
                    Mental wellness shouldn't be a lonely journey. Connect with thousands of others in a completely anonymous, safe environment built on empathy and trust.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
                <div className="space-y-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-6">Why Emotional Sharing Matters</h2>
                        <p className="text-[#9DA7B3] leading-relaxed font-light">
                            Verbalizing our internal emotions is the first step in neurological regulation. In our community, you aren't just a username—you're a part of a collective healing process.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {[
                            { icon: Users, title: "Zero Judgment Space", desc: "Moderated strictly to ensure every voice is heard with respect." },
                            { icon: ShieldCheck, title: "Total Anonymity", desc: "No real names, no profiles, just pure emotional connection." },
                            { icon: Heart, title: "Mood-Based Filtering", desc: "Find others who feel exactly like you do right now." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#7C5CFF]/10 flex items-center justify-center border border-[#7C5CFF]/20 shrink-0">
                                    <item.icon className="w-5 h-5 text-[#7C5CFF]" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                    <p className="text-[#9DA7B3] text-sm font-light leading-relaxed truncate-2">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 relative">
                    <div className="absolute inset-0 bg-[#7C5CFF]/5 blur-[100px] -z-10" />
                    {examplePosts.map((post, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default scale-95 hover:scale-100"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-2 h-2 rounded-full bg-[#7C5CFF]" />
                                <span className="text-[12px] font-bold text-[#7C5CFF] uppercase tracking-widest">{post.mood}</span>
                            </div>
                            <p className="text-white text-sm leading-relaxed mb-6 font-light">"{post.content}"</p>
                            <div className="flex items-center gap-4 text-[#9DA7B3] text-xs">
                                <span>{post.likes} Hearts</span>
                                <span>{post.replies} Replies</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-4xl bg-gradient-to-br from-[#141B3A] to-[#0B0F2A] border border-[#7C5CFF]/20 p-12 md:p-20 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFF]/10 blur-[100px] rounded-full" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to find your voice?</h2>
                <p className="text-[#9DA7B3] mb-12 max-w-xl mx-auto font-light leading-relaxed">
                    Join our community to start sharing and supporting others. Login to access full discussion feeds and interactive features.
                </p>
                <Link href="/login">
                    <button className="h-14 px-10 bg-white text-[#0B0F2A] rounded-2xl text-[15px] font-bold shadow-2xl shadow-white/10 hover:shadow-white/20 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center gap-2 mx-auto">
                        Join Community <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

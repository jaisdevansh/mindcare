"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, Send, Inbox } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success("Message deliver successfully!");
            setLoading(false);
        }, 1500);
    };

    const faqs = [
        { q: "Is my identity anonymous in the community?", a: "Yes. In our community and helper sessions, you are entirely anonymous and identifiable only by a self-chosen mood tag." },
        { q: "What is the training for verified helpers?", a: "Every helper undergoes a comprehensive empathy compliance training and identity verification." },
        { q: "How does the AI track my wellness?", a: "Our AI processes the sentiment of your conversations to visualize trends and emotional insights over time securely." },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-44 flex flex-col items-center relative overflow-hidden">
            <div className="text-center max-w-3xl mb-24 z-10">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
                >
                    We Are <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">Listening</span>
                </motion.h1>
                <p className="text-lg md:text-xl text-[#9DA7B3] leading-relaxed font-light">
                    Questions, feedback, or need technical support?
                    Our empathetic team is dedicated to your journey and ready to assist you.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-start w-full relative z-10 mb-40">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-10 tracking-widest uppercase text-xs">Direct Support</h2>
                    {[
                        { icon: Mail, title: "Support Email", info: "support@mindcare.ai", sub: "Avg. reply time: 2 hours" },
                        { icon: Phone, title: "Emergency Hotline", info: "988 (National Support)", sub: "Available 24/7" },
                        { icon: MessageSquare, title: "Social Interaction", info: "@mindcare_wellness", sub: "Active on Twitter/X" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-3xl flex items-center gap-6 group hover:bg-white/[0.08] hover:border-[#7C5CFF]/30 transition-all cursor-default"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[#141B3A] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                                <item.icon className="w-6 h-6 text-[#7C5CFF]" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-bold text-[#7C5CFF] uppercase tracking-widest mb-1">{item.title}</h4>
                                <p className="text-xl font-bold text-white mb-1">{item.info}</p>
                                <p className="text-sm font-light text-[#9DA7B3]">{item.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#141B3A] to-[#0B0F2A] border border-white/10 p-10 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFF]/10 blur-[100px] rounded-full" />
                    <h3 className="text-2xl font-bold text-white mb-10 tracking-tight flex items-center gap-2">
                        <Inbox className="w-6 h-6 text-[#7C5CFF]" />
                        Send a Message
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#9DA7B3] uppercase tracking-widest underline underline-offset-4 decoration-[#7C5CFF]/30">Your Name</label>
                                <input type="text" required placeholder="John Doe" className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#9DA7B3] uppercase tracking-widest underline underline-offset-4 decoration-[#7C5CFF]/30">Email Address</label>
                                <input type="email" required placeholder="john@example.com" className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#9DA7B3] uppercase tracking-widest underline underline-offset-4 decoration-[#7C5CFF]/30">Reason for inquiry</label>
                            <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30">
                                <option value="general" className="bg-[#0B0F2A]">General Inquiry</option>
                                <option value="support" className="bg-[#0B0F2A]">Technical Support</option>
                                <option value="helper" className="bg-[#0B0F2A]">Becoming a Helper</option>
                                <option value="press" className="bg-[#0B0F2A]">Press & Media</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#9DA7B3] uppercase tracking-widest underline underline-offset-4 decoration-[#7C5CFF]/30">Message</label>
                            <textarea required rows={5} placeholder="How can we assist your journey?" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 resize-none font-light leading-relaxed"></textarea>
                        </div>

                        <button disabled={loading} className="w-full h-14 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-2xl text-[14px] font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-2xl shadow-[#7C5CFF]/20">
                            <Send className="w-4 h-4" />
                            {loading ? "Sending Transmission..." : "Deliver Message"}
                        </button>
                    </form>
                </motion.div>
            </div>

            <div className="w-full max-w-4xl">
                <h3 className="text-3xl font-black text-white mb-16 text-center italic tracking-wider">Frequently Asked Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {faqs.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/[0.03] border border-white/5 p-8 rounded-3xl"
                        >
                            <h4 className="text-white font-bold mb-4 tracking-tight leading-relaxed">"{f.q}"</h4>
                            <p className="text-sm font-light text-[#9DA7B3] leading-relaxed">{f.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

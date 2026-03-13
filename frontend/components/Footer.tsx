"use client";

import React from "react";
import Link from "next/link";
import { Brain, Twitter, Github, Linkedin, ShieldCheck } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-[#0A0D20] border-t border-[#7C5CFF]/20 pt-24 pb-12 relative z-20 w-full mt-auto shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#7C5CFF]/50 to-transparent" />
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 relative">
                <div className="flex flex-col gap-6">
                    <Link href="/" className="flex items-center gap-2 transition-all">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center glow-purple">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white font-inter">MindCare</span>
                    </Link>
                    <p className="text-[#9DA7B3] text-[15px] leading-relaxed font-light">
                        The futuristic emotional wellness platform for the modern generation. Track, talk, and heal in a safe AI-powered space.
                    </p>
                    <div className="flex items-center gap-4">
                        {[Twitter, Github, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#9DA7B3] hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-8">Platform</h4>
                    <ul className="space-y-4">
                        {['Home', 'About', 'Helpers', 'Community', 'Pricing'].map((item) => (
                            <li key={item}>
                                <Link
                                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-8">Resources</h4>
                    <ul className="space-y-4">
                        {['Contact', 'Help Center', 'Terms', 'Privacy'].map((item) => (
                            <li key={item}>
                                <Link href={item === 'Contact' ? '/contact' : '#'} className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C5CFF]/10 blur-3xl rounded-full" />
                    <ShieldCheck className="w-8 h-8 text-[#7C5CFF] mb-4 stroke-[1.5]" />
                    <h4 className="text-[15px] font-bold text-white mb-2 tracking-wide">Safe & Anonymous</h4>
                    <p className="text-[13px] text-[#9DA7B3] font-light leading-relaxed">
                        Your identity and data are encrypted end-to-end. We put your privacy first.
                    </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[13px] text-[#9DA7B3]/60 font-medium">© 2026 MindCare. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    {['Terms', 'Cookies', 'Security'].map((item) => (
                        <Link key={item} href="#" className="text-[13px] text-[#9DA7B3]/60 hover:text-white font-medium">
                            {item}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
};

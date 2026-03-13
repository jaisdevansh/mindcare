'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, Twitter, Github, Linkedin, MessageSquareHeart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-transparent border-t border-white/5 pt-20 pb-10 relative z-10 w-full overflow-hidden mt-auto">
            {/* Ambient Background Glow for Footer */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-t from-[#141B3A]/40 to-transparent -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

                {/* Brand Column */}
                <div className="flex flex-col gap-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shadow-[0_0_15px_rgba(124,92,255,0.3)] transition-all group-hover:scale-105">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight font-inter">
                            MindCare
                        </span>
                    </Link>
                    <p className="text-[#9DA7B3] text-[14px] leading-relaxed font-light">
                        The futuristic mental wellness platform for the modern generation. Track, talk, and heal in a safe AI-powered space.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#9DA7B3] hover:text-white hover:bg-white/10 hover:border-white/10 transition-all">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#9DA7B3] hover:text-white hover:bg-white/10 hover:border-white/10 transition-all">
                            <Github className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#9DA7B3] hover:text-white hover:bg-white/10 hover:border-white/10 transition-all">
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Navigation Columns */}
                <div>
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-8">Platform</h4>
                    <ul className="space-y-4">
                        <li><Link href="/" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Home</Link></li>
                        <li><Link href="/about" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">About</Link></li>
                        <li><Link href="/helpers" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Helpers</Link></li>
                        <li><Link href="/community" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Community</Link></li>
                        <li><Link href="/pricing" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Pricing</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-8">Resources</h4>
                    <ul className="space-y-4">
                        <li><Link href="/contact" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Contact Us</Link></li>
                        <li><Link href="#" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Help Center</Link></li>
                        <li><Link href="/login" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Login Account</Link></li>
                        <li><Link href="#" className="text-[14px] text-[#9DA7B3] hover:text-white transition-all font-light">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Trust Badge Column */}
                <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C5CFF]/10 blur-3xl rounded-full" />
                    <MessageSquareHeart className="w-8 h-8 text-[#7C5CFF] mb-4 stroke-[1.5]" />
                    <h4 className="text-[15px] font-bold text-white mb-2">Safe & Anonymous</h4>
                    <p className="text-[13px] text-[#9DA7B3] font-light leading-relaxed">
                        Your identity and data are encrypted end-to-end. We put your privacy first.
                    </p>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[13px] text-[#9DA7B3]/60 font-medium">© 2026 MindCare Connect. All rights reserved.</p>
                <div className="flex items-center gap-6">
                    <Link href="#" className="text-[13px] text-[#9DA7B3]/60 hover:text-white">Terms</Link>
                    <Link href="#" className="text-[13px] text-[#9DA7B3]/60 hover:text-white">Cookies</Link>
                    <Link href="#" className="text-[13px] text-[#9DA7B3]/60 hover:text-white">Security</Link>
                </div>
            </div>
        </footer>
    );
};

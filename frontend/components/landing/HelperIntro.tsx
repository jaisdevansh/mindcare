'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export const HelperIntro = () => {
    return (
        <section className="py-24 relative z-10 w-full" id="helpers">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
                            Talk to someone who truly <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF]">understands</span>.
                        </h2>
                        <p className="text-[17px] text-[#9DA7B3] font-light mb-10 leading-relaxed">
                            Our verified helpers are peers trained to listen, support, and guide you through stressful times. Experience a deep, emotional connection inside a completely anonymous space.
                        </p>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFF]" />
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-semibold tracking-wide text-white">Verified Empathy</h4>
                                    <p className="text-[#9DA7B3] text-[14px] font-light mt-1.5">Every helper undergoes background screening and deep empathy compliance training.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B6CFF]" />
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-semibold tracking-wide text-white">End-to-End Safety</h4>
                                    <p className="text-[#9DA7B3] text-[14px] font-light mt-1.5">Strict anonymity bounds. Share your deepest thoughts without compromising identity.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6A8DFF]" />
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-semibold tracking-wide text-white">Radically Affordable</h4>
                                    <p className="text-[#9DA7B3] text-[14px] font-light mt-1.5">Immediate access to human support shouldn't cost a fortune. Start sessions instantly.</p>
                                </div>
                            </div>
                        </div>

                        <Link href="/helpers">
                            <button className="h-12 px-8 text-[15px] font-medium bg-white/5 border border-white/10 text-white rounded-xl backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:scale-[1.03] active:scale-[0.98]">
                                Browse Active Helpers
                            </button>
                        </Link>
                    </motion.div>

                    {/* Minimal SaaS Floating Cards (Right Side) */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[600px] w-full rounded-[2rem] overflow-hidden flex flex-col items-center justify-center p-8 hidden lg:flex"
                    >
                        {/* Soft Ambient Background for the wrapper */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#141B3A]/40 to-transparent border border-white/[0.05] rounded-[2rem]" />

                        <div className="w-full max-w-sm space-y-5 relative z-10">

                            {/* Card 1 */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transform -translate-x-4 hover:translate-x-0 outline outline-1 outline-white/[0.02] shadow-2xl transition-transform duration-500">
                                <div className="flex items-center gap-4">
                                    <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="w-12 h-12 rounded-full border border-white/20" />
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-white tracking-wide">Sarah Jenkins</h3>
                                        <p className="text-[13px] text-[#7C5CFF] font-medium mt-0.5">Verified Listener • 4.9 ★</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transform translate-x-8 hover:translate-x-4 outline outline-1 outline-white/[0.02] shadow-2xl transition-transform duration-500">
                                <div className="flex items-center gap-4">
                                    <img src="https://i.pravatar.cc/150?u=david" alt="David" className="w-12 h-12 rounded-full border border-white/20" />
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-white tracking-wide">David Chen</h3>
                                        <p className="text-[13px] text-[#5B6CFF] font-medium mt-0.5">Anxiety Specialist • 5.0 ★</p>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transform -translate-x-2 hover:translate-x-2 outline outline-1 outline-white/[0.02] shadow-2xl transition-transform duration-500">
                                <div className="flex items-center gap-4">
                                    <img src="https://i.pravatar.cc/150?u=elena" alt="Elena" className="w-12 h-12 rounded-full border border-white/20" />
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-white tracking-wide">Elena Rodriguez</h3>
                                        <p className="text-[13px] text-[#6A8DFF] font-medium mt-0.5">Burnout Advisor • 4.8 ★</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

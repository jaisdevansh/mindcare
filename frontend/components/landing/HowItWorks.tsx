'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { num: '1', title: 'Track Mood', desc: 'Identify your emotions daily.' },
    { num: '2', title: 'Get AI Insights', desc: 'Understand cognitive patterns.' },
    { num: '3', title: 'Talk to Helpers', desc: 'Connect safely and anonymously.' },
    { num: '4', title: 'Build Resilience', desc: 'Improve mental well-being.' },
];

export const HowItWorks = () => {
    return (
        <section className="py-24 relative z-10 w-full" id="how-it-works">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-6"
                    >
                        How It Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[#9DA7B3] font-light"
                    >
                        A structured path towards better cognitive clarity and peace of mind.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Horizontal Connector Line for Desktop */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-white/10 hidden lg:block -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 rounded-[1.2rem] bg-black border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-inner shadow-white/5 mb-8 relative transition-transform duration-500 group-hover:-translate-y-2 group-hover:border-[#7C5CFF]/30 group-hover:shadow-[0_0_20px_rgba(124,92,255,0.2)]">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-[#9DA7B3]">
                                        {step.num}
                                    </span>

                                    {/* Subtle Glow Node behind number box */}
                                    <div className="absolute -inset-2 bg-gradient-to-b from-[#7C5CFF]/10 to-transparent blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <h3 className="text-[17px] font-semibold tracking-wide text-white mb-3">{step.title}</h3>
                                <p className="text-[14px] text-[#9DA7B3] font-light max-w-[200px]">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const CTASection = () => {
    return (
        <section className="py-32 relative z-10 w-full overflow-hidden flex justify-center items-center">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        Ready to explore<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] via-[#5B6CFF] to-[#6A8DFF]">
                            your mental space?
                        </span>
                    </h2>
                    <p className="text-[17px] md:text-[19px] text-[#9DA7B3] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Join thousands of others taking control of their emotional well-being today. Built for modern thinkers.
                    </p>

                    <Link href="/register">
                        <button className="h-14 px-10 text-[16px] font-semibold bg-white text-[#0B0F2A] rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-[1.03] active:scale-[0.98]">
                            Create Free Account
                        </button>
                    </Link>

                    <p className="mt-8 text-[12px] text-[#9DA7B3] font-medium tracking-widest uppercase">
                        No credit card required. Free basic access.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

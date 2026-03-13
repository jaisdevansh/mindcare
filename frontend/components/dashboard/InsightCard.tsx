'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Sparkles } from 'lucide-react';

const MOOD_EMOJI: Record<string, string> = {
    happy: '😊', neutral: '😐', sad: '😔', stressed: '😤',
    anxious: '😰', burnout: '🥵', unknown: '🧠'
};

const MOOD_BG: Record<string, string> = {
    happy: 'from-emerald-500/15 to-teal-500/5 border-emerald-500/20',
    neutral: 'from-indigo-500/15 to-violet-500/5 border-indigo-500/20',
    sad: 'from-blue-500/15 to-indigo-500/5 border-blue-500/20',
    stressed: 'from-orange-500/15 to-amber-500/5 border-orange-500/20',
    anxious: 'from-amber-500/15 to-yellow-500/5 border-amber-500/20',
    burnout: 'from-rose-500/15 to-red-500/5 border-rose-500/20',
};

export const InsightCard = ({ mood, insight }: { mood: string; insight: string }) => {
    const key = mood?.toLowerCase() || 'neutral';
    const emoji = MOOD_EMOJI[key] || '🧠';
    const bg = MOOD_BG[key] || MOOD_BG.neutral;

    return (
        <div className={`relative overflow-hidden rounded-[1.5rem] border bg-gradient-to-br ${bg} p-6 h-full backdrop-blur-md shadow-xl`}>
            {/* Glow orb */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#7C5CFF]/10 blur-[60px] pointer-events-none" />

            <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.06] border border-white/10 rounded-full text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-5">
                    <Sparkles className="w-3 h-3 text-[#7C5CFF]" /> Today's Insight
                </div>

                {/* Mood + Emoji */}
                <div className="flex items-center gap-4 mb-4">
                    <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                        className="text-4xl"
                    >
                        {emoji}
                    </motion.div>
                    <div>
                        <p className="text-[10px] text-[#9DA7B3] font-bold uppercase tracking-widest">Current Mood</p>
                        <h3 className="text-2xl font-black text-white capitalize tracking-tight">{mood || 'Not yet tracked'}</h3>
                    </div>
                </div>

                {/* Insight text */}
                <p className="text-[#9DA7B3] text-sm leading-relaxed font-medium">
                    {insight}
                </p>

                {/* Decorative bar */}
                <div className="mt-5 flex gap-1">
                    {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className="flex-1 rounded-full bg-[#7C5CFF]/30 origin-bottom"
                            style={{ height: `${h * 28}px` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

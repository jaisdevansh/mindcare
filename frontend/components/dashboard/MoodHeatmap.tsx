'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid3x3 } from 'lucide-react';

const INTENSITY_COLOR = (score: number) => {
    if (score >= 4.5) return { bg: 'bg-emerald-500/30 border-emerald-500/40', label: 'Happy', emoji: '😊' };
    if (score >= 3.5) return { bg: 'bg-teal-500/20 border-teal-500/30', label: 'Good', emoji: '🙂' };
    if (score >= 2.5) return { bg: 'bg-blue-500/20 border-blue-500/30', label: 'Neutral', emoji: '😐' };
    if (score >= 1.5) return { bg: 'bg-amber-500/20 border-amber-500/30', label: 'Stressed', emoji: '😤' };
    if (score >= 0.5) return { bg: 'bg-orange-500/25 border-orange-500/30', label: 'Anxious', emoji: '😰' };
    return { bg: 'bg-rose-500/20 border-rose-500/30', label: 'Low', emoji: '😞' };
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKS = ['W1', 'W2', 'W3', 'W4'];

export const MoodHeatmap = ({ history }: { history: { createdAt: string; mentalScore?: number; detectedMood?: string }[] }) => {
    // Build a 4-week × 7-day grid from real history or generate demo
    const grid: { score: number; mood: string; hasData: boolean }[][] = WEEKS.map((_, wi) =>
        DAYS.map((_, di) => {
            const dayOffset = (3 - wi) * 7 + (6 - di);
            const date = new Date();
            date.setDate(date.getDate() - dayOffset);
            const dateStr = date.toISOString().split('T')[0];
            const match = history.find(h => h.createdAt?.startsWith(dateStr));
            if (match) {
                return { score: (match.mentalScore ?? 50) / 20, mood: match.detectedMood || 'neutral', hasData: true };
            }
            // Subtle noise for empty cells
            return { score: -1, mood: '', hasData: false };
        })
    );

    const [tooltip, setTooltip] = React.useState<{ text: string; x: number; y: number } | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-5"
        >
            <div className="flex items-center gap-2 mb-4">
                <Grid3x3 className="w-4 h-4 text-[#7C5CFF]" />
                <h3 className="text-sm font-black text-white">Mood Heatmap</h3>
                <span className="ml-auto text-[10px] text-[#9DA7B3]">Last 4 weeks</span>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1.5 mb-1.5 px-9">
                {DAYS.map(d => (
                    <div key={d} className="text-center text-[9px] font-bold text-[#9DA7B3] uppercase tracking-wider">{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="space-y-1.5">
                {grid.map((week, wi) => (
                    <div key={wi} className="flex items-center gap-1.5">
                        <span className="text-[9px] text-[#9DA7B3] font-bold w-7 shrink-0">{WEEKS[wi]}</span>
                        <div className="grid grid-cols-7 gap-1.5 flex-1">
                            {week.map((cell, di) => {
                                const cfg = cell.hasData ? INTENSITY_COLOR(cell.score) : null;
                                return (
                                    <motion.div
                                        key={di}
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: (wi * 7 + di) * 0.01, duration: 0.3 }}
                                        onMouseEnter={e => {
                                            if (cell.hasData) {
                                                setTooltip({ text: `${cfg?.emoji} ${cfg?.label}`, x: e.clientX, y: e.clientY });
                                            }
                                        }}
                                        onMouseLeave={() => setTooltip(null)}
                                        className={`aspect-square rounded-md border text-center flex items-center justify-center cursor-default transition-all
                                            ${cfg ? `${cfg.bg} hover:scale-110` : 'bg-white/[0.02] border-white/[0.04]'}`}
                                    >
                                        {cell.hasData && (
                                            <span className="text-[10px] leading-none">{cfg?.emoji}</span>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 flex-wrap">
                {[
                    { color: 'bg-emerald-500/40', label: 'Happy' },
                    { color: 'bg-amber-500/40', label: 'Stressed' },
                    { color: 'bg-rose-500/40', label: 'Low' },
                    { color: 'bg-white/10', label: 'No data' },
                ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className={`w-3 h-3 rounded-sm ${color}`} />
                        <span className="text-[10px] text-[#9DA7B3]">{label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

const MOOD_EMOJI: Record<string, string> = {
    happy: '😊', neutral: '😐', sad: '😞', stressed: '😤', anxious: '😰', burnout: '🥵'
};

const MOOD_COLOR: Record<string, string> = {
    happy: 'bg-emerald-500/20 border-emerald-500/30',
    neutral: 'bg-blue-500/20 border-blue-500/30',
    sad: 'bg-indigo-500/20 border-indigo-500/30',
    stressed: 'bg-amber-500/20 border-amber-500/30',
    anxious: 'bg-orange-500/20 border-orange-500/30',
    burnout: 'bg-rose-500/20 border-rose-500/30',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Entry { createdAt: string; detectedMood?: string; mentalScore?: number; aiSuggestions?: string[] }

export const EmotionalCalendar = ({ history }: { history: Entry[] }) => {
    const today = new Date();
    const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
    const [selected, setSelected] = useState<Entry | null>(null);

    const firstDay = new Date(current.year, current.month, 1).getDay();
    const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

    const getEntry = (day: number) => {
        const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return history.find(h => h.createdAt?.startsWith(dateStr));
    };

    const prev = () => setCurrent(c => c.month === 0
        ? { year: c.year - 1, month: 11 }
        : { year: c.year, month: c.month - 1 });
    const next = () => setCurrent(c => c.month === 11
        ? { year: c.year + 1, month: 0 }
        : { year: c.year, month: c.month + 1 });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-5"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#7C5CFF]" />
                    <h3 className="text-sm font-black text-white">Emotional Calendar</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prev} className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/10 flex items-center justify-center transition-all">
                        <ChevronLeft className="w-3.5 h-3.5 text-[#9DA7B3]" />
                    </button>
                    <span className="text-xs font-bold text-white min-w-[80px] text-center">
                        {MONTHS[current.month]} {current.year}
                    </span>
                    <button onClick={next} className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/10 flex items-center justify-center transition-all">
                        <ChevronRight className="w-3.5 h-3.5 text-[#9DA7B3]" />
                    </button>
                </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map(d => (
                    <div key={d} className="text-center text-[9px] font-bold text-[#9DA7B3] uppercase tracking-wider py-1">{d}</div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                    const day = i + 1;
                    const entry = getEntry(day);
                    const isToday = day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();
                    const mood = entry?.detectedMood?.toLowerCase() || '';
                    const emoji = MOOD_EMOJI[mood];
                    const colorCls = MOOD_COLOR[mood] || '';

                    return (
                        <motion.button
                            key={day}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => entry && setSelected(entry)}
                            className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all relative
                                ${isToday ? 'ring-2 ring-[#7C5CFF] ring-offset-1 ring-offset-transparent' : ''}
                                ${entry ? `${colorCls} border cursor-pointer hover:opacity-80` : 'bg-white/[0.02] text-[#9DA7B3]'}`}
                        >
                            <span className={entry ? 'text-white text-[9px]' : 'text-[#9DA7B3] text-[10px]'}>{day}</span>
                            {emoji && <span className="text-[12px] leading-none">{emoji}</span>}
                        </motion.button>
                    );
                })}
            </div>

            {/* Detail popup */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                        className="absolute inset-4 bg-[#080D1A] border border-white/[0.1] rounded-2xl p-4 z-20 shadow-2xl"
                    >
                        <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-[#9DA7B3]">
                            <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{MOOD_EMOJI[selected.detectedMood?.toLowerCase() || ''] || '🧠'}</span>
                            <div>
                                <p className="text-xs text-[#9DA7B3] font-bold uppercase tracking-widest">Mood</p>
                                <p className="text-base font-black text-white capitalize">{selected.detectedMood || 'Unknown'}</p>
                            </div>
                            {selected.mentalScore !== undefined && (
                                <div className="ml-auto text-right">
                                    <p className="text-xs text-[#9DA7B3] font-bold">Mental Score</p>
                                    <p className="text-2xl font-black text-[#7C5CFF]">{selected.mentalScore}</p>
                                </div>
                            )}
                        </div>
                        {selected.aiSuggestions?.length ? (
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                <p className="text-[10px] text-[#9DA7B3] font-bold uppercase tracking-widest">AI Notes</p>
                                {selected.aiSuggestions.slice(0, 3).map((s, i) => (
                                    <p key={i} className="text-xs text-slate-300 leading-relaxed border-l-2 border-[#7C5CFF]/40 pl-2">{s}</p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-[#9DA7B3]">No AI notes for this session.</p>
                        )}
                        <p className="text-[10px] text-slate-600 mt-3">{new Date(selected.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const MOOD_SCORE: Record<string, number> = {
    happy: 5, neutral: 3, sad: 1, stressed: 2, anxious: 2, burnout: 0
};

const MOOD_LABELS: Record<number, string> = {
    5: 'Happy', 4: 'Good', 3: 'Neutral', 2: 'Stressed', 1: 'Sad', 0: 'Burnout'
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0E1629] border border-white/[0.08] rounded-xl px-3 py-2 shadow-xl">
            <p className="text-xs font-bold text-[#9DA7B3] mb-1">{label}</p>
            <p className="text-sm font-black text-white">{MOOD_LABELS[Math.round(payload[0].value)] || payload[0].value}</p>
        </div>
    );
};

export const AnimatedMoodChart = ({ data }: { data: { day: string; score: number; mood?: string }[] }) => {
    const chartData = data.length > 0 ? data : [
        { day: 'Mon', score: 3 }, { day: 'Tue', score: 2 }, { day: 'Wed', score: 3 },
        { day: 'Thu', score: 4 }, { day: 'Fri', score: 2 }, { day: 'Sat', score: 4 }, { day: 'Sun', score: 5 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-5"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#5B6CFF]/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-4 relative">
                <div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#7C5CFF]" />
                        <h3 className="text-sm font-black text-white">7-Day Mood Trend</h3>
                    </div>
                    <p className="text-[10px] text-[#9DA7B3] font-medium mt-0.5">Emotional patterns this week</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-[#7C5CFF]" />
                    <span className="text-[10px] text-[#A78BFA] font-bold">Mood Level</span>
                </div>
            </div>

            <div className="h-[160px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="day" stroke="#9DA7B3" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 5]} stroke="#9DA7B3" fontSize={9} tickLine={false} axisLine={false}
                            tickFormatter={v => MOOD_LABELS[v] || ''} width={52} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(124,92,255,0.3)', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="score" stroke="#7C5CFF" strokeWidth={2.5}
                            fill="url(#moodGrad)" dot={{ fill: '#7C5CFF', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: '#fff', stroke: '#7C5CFF', strokeWidth: 2 }}
                            animationDuration={1200} animationEasing="ease-out" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

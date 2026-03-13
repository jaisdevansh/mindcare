'use client';
import React from "react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { BotMessageSquare, Activity, TrendingUp, Brain, Smile, AlertCircle, Zap } from "lucide-react";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const aiChats = DAYS.map((d, i) => ({ day: d, chats: [22, 48, 33, 61, 44, 77, 38][i], sessions: [12, 28, 19, 35, 24, 45, 21][i] }));
const moodDetection = [
    { name: 'Happy', value: 32, color: '#4ade80' },
    { name: 'Neutral', value: 38, color: '#A67C52' },
    { name: 'Anxious', value: 20, color: '#f97316' },
    { name: 'Depressed', value: 10, color: '#f87171' },
];
const depressionTrend = DAYS.map((d, i) => ({ day: d, detected: [3, 7, 4, 9, 6, 5, 4][i] }));

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1A0F0E] border border-[#3D2B1F] rounded-xl p-3 text-xs shadow-xl">
            <p className="text-[#A67C52] font-black mb-1">{label}</p>
            {payload.map((p: any) => <p key={p.name} className="text-[#EDE0D4] font-bold">{p.name}: {p.value}</p>)}
        </div>
    );
};

export default function AIAnalyticsPage() {
    const totalChats = aiChats.reduce((s, d) => s + d.chats, 0);
    const avgMoodAccuracy = 94;

    return (
        <div className="space-y-6 pb-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'AI Chats This Week', value: totalChats, icon: BotMessageSquare, color: '#A67C52' },
                    { label: 'Avg per Day', value: Math.floor(totalChats / 7), icon: Zap, color: '#7F5539' },
                    { label: 'Mood Accuracy', value: `${avgMoodAccuracy}%`, icon: Brain, color: '#4ade80' },
                    { label: 'High Risk Flagged', value: depressionTrend.reduce((s, d) => s + d.detected, 0), icon: AlertCircle, color: '#f87171' },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                        <c.icon className="w-4 h-4 mb-3" style={{ color: c.color }} />
                        <p className="text-3xl font-black text-[#EDE0D4]">{c.value}</p>
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* AI Chats per day */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <BotMessageSquare className="w-4 h-4 text-[#A67C52]" /> AI Chats — Last 7 Days
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={aiChats}>
                            <defs>
                                <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A67C52" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#A67C52" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7F5539" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#7F5539" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                            <XAxis dataKey="day" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="chats" name="AI Chats" stroke="#A67C52" fill="url(#aiGrad)" strokeWidth={2} dot={{ fill: '#A67C52', r: 3 }} />
                            <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#7F5539" fill="url(#sessGrad)" strokeWidth={1.5} dot={{ fill: '#7F5539', r: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Mood detection donut */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <Brain className="w-4 h-4 text-[#A67C52]" /> AI Mood Detection Results
                    </h3>
                    <div className="flex items-center gap-6">
                        <ResponsiveContainer width="45%" height={180}>
                            <PieChart>
                                <Pie data={moodDetection} cx="50%" cy="50%" innerRadius={42} outerRadius={65}
                                    dataKey="value" strokeWidth={0}>
                                    {moodDetection.map((e, i) => <Cell key={i} fill={e.color} opacity={0.85} />)}
                                </Pie>
                                <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: '#1A0F0E', border: '1px solid #3D2B1F', borderRadius: 12, fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3 flex-1">
                            {moodDetection.map(m => (
                                <div key={m.name} className="space-y-1">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                                            <span className="text-[10px] font-bold text-[#A67C52]/60">{m.name}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-[#EDE0D4]">{m.value}%</span>
                                    </div>
                                    <div className="h-1 bg-[#0F0A08] rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${m.value}%` }} transition={{ duration: 0.7 }}
                                            className="h-full rounded-full" style={{ background: m.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Depression trend */}
            <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                    <AlertCircle className="w-4 h-4 text-red-400/70" /> Depression Detection Trend — Last 7 Days
                </h3>
                <div className="flex gap-4 mb-4">
                    {[{ label: 'Total Flagged', v: depressionTrend.reduce((s, d) => s + d.detected, 0) }, { label: 'Daily Avg', v: (depressionTrend.reduce((s, d) => s + d.detected, 0) / 7).toFixed(1) }].map(s => (
                        <div key={s.label} className="px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10">
                            <p className="text-[9px] text-red-400/50 font-black uppercase tracking-widest">{s.label}</p>
                            <p className="text-xl font-black text-red-400/80">{s.v}</p>
                        </div>
                    ))}
                </div>
                <ResponsiveContainer width="100%" height={140}>
                    <LineChart data={depressionTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                        <XAxis dataKey="day" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="detected" name="Users" stroke="#f87171" strokeWidth={2} dot={{ fill: '#f87171', r: 3 }} strokeOpacity={0.7} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

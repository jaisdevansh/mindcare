'use client';
import React from "react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { ClipboardList, Activity, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const assessData = DAYS.map((d, i) => ({ day: d, completed: [8, 15, 11, 22, 18, 30, 14][i] }));
const depressionRisk = [
    { name: 'Low Risk', value: 60, color: '#4ade80' },
    { name: 'Moderate', value: 30, color: '#f97316' },
    { name: 'High Risk', value: 10, color: '#f87171' },
];
const moodDist = [
    { mood: 'Happy', count: 35, color: '#4ade80' },
    { mood: 'Neutral', count: 40, color: '#A67C52' },
    { mood: 'Stressed', count: 18, color: '#f97316' },
    { mood: 'Sad', count: 7, color: '#f87171' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1A0F0E] border border-[#3D2B1F] rounded-xl p-3 text-xs shadow-xl">
            <p className="text-[#A67C52] font-black mb-1">{label}</p>
            {payload.map((p: any) => <p key={p.name} className="text-[#EDE0D4] font-bold">{p.name}: {p.value}</p>)}
        </div>
    );
};

export default function AssessmentsPage() {
    const total = assessData.reduce((s, d) => s + d.completed, 0);

    return (
        <div className="space-y-6 pb-10">
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Assessments', value: total, icon: ClipboardList, color: '#A67C52' },
                    { label: 'This Week', value: assessData[assessData.length - 1].completed, icon: TrendingUp, color: '#7F5539' },
                    { label: 'High Risk Flagged', value: Math.floor(total * 0.1), icon: AlertTriangle, color: '#f87171' },
                    { label: 'Low Risk (Healthy)', value: Math.floor(total * 0.6), icon: CheckCircle, color: '#4ade80' },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                        <c.icon className="w-4 h-4 mb-3" style={{ color: c.color }} />
                        <p className="text-3xl font-black text-[#EDE0D4]">{c.value}</p>
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Assessments per day */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <ClipboardList className="w-4 h-4 text-[#A67C52]" /> Assessments Completed — Last 7 Days
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={assessData}>
                            <defs>
                                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A67C52" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#A67C52" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                            <XAxis dataKey="day" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="completed" name="Completed" stroke="#A67C52" fill="url(#aGrad)" strokeWidth={2} dot={{ fill: '#A67C52', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Depression risk donut */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <AlertTriangle className="w-4 h-4 text-[#A67C52]" /> Depression Risk Distribution
                    </h3>
                    <div className="flex items-center gap-8">
                        <ResponsiveContainer width="50%" height={180}>
                            <PieChart>
                                <Pie data={depressionRisk} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                    dataKey="value" strokeWidth={0}>
                                    {depressionRisk.map((e, i) => <Cell key={i} fill={e.color} opacity={0.85} />)}
                                </Pie>
                                <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: '#1A0F0E', border: '1px solid #3D2B1F', borderRadius: 12, fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-4 flex-1">
                            {depressionRisk.map(r => (
                                <div key={r.name} className="space-y-1">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                                            <span className="text-xs font-bold text-[#A67C52]/60">{r.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-[#EDE0D4]">{r.value}%</span>
                                    </div>
                                    <div className="h-1.5 bg-[#0F0A08] rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${r.value}%` }} transition={{ duration: 0.8 }}
                                            className="h-full rounded-full" style={{ background: r.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mood distribution */}
            <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                    <Activity className="w-4 h-4 text-[#A67C52]" /> Mood Distribution Across All Assessments
                </h3>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={moodDist} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="mood" type="category" tick={{ fill: '#A67C5260', fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} width={65} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Users" radius={[0, 6, 6, 0]}>
                            {moodDist.map((e, i) => <Cell key={i} fill={e.color} opacity={0.8} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

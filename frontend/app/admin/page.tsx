'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Users, UserCheck, MessageSquare, ClipboardList, BotMessageSquare, Activity, TrendingUp, RefreshCw, Shield, Zap } from "lucide-react";
import { adminService } from "@/lib/services/admin.service";
import Link from "next/link";

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const userGrowth = DAYS.map((d, i) => ({ day: d, users: [3, 7, 5, 12, 8, 14, 6][i], posts: [8, 15, 10, 22, 18, 30, 12][i] }));
const moodData = [
    { name: 'Happy', value: 35, color: '#4ade80' },
    { name: 'Neutral', value: 40, color: '#A67C52' },
    { name: 'Stressed', value: 18, color: '#f97316' },
    { name: 'Sad', value: 7, color: '#f87171' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1A0F0E] border border-[#3D2B1F] rounded-xl p-3 text-xs shadow-xl">
            <p className="text-[#A67C52] font-black uppercase tracking-widest mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.dataKey} className="text-[#EDE0D4] font-bold">{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => { fetchStats(); }, []);
    const fetchStats = async () => {
        try { setRefreshing(true); const res = await adminService.getDashboardStats(); if (res.success) setStats(res.data); }
        finally { setLoading(false); setRefreshing(false); }
    };

    const topCards = [
        { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: '#A67C52', href: '/admin/users' },
        { label: 'Active Helpers', value: stats?.totalHelpers ?? 0, icon: UserCheck, color: '#7F5539', href: '/admin/helpers' },
        { label: 'Community Posts', value: stats?.totalPosts ?? 0, icon: MessageSquare, color: '#B08968', href: '/admin/community' },
        { label: 'Pending Apps', value: stats?.pendingApplications ?? 0, icon: ClipboardList, color: '#9C6644', href: '/admin/applications' },
        { label: 'Active Now', value: stats?.activeNow ?? 0, icon: Zap, color: '#D4A96A', href: '#' },
    ];

    return (
        <div className="space-y-6 pb-10">
            {/* Refresh */}
            <div className="flex justify-end">
                <button onClick={fetchStats} disabled={refreshing}
                    className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#1A0F0E]/60 border border-[#3D2B1F]/50 text-[#A67C52] text-xs font-bold hover:bg-[#A67C52]/10 transition-all">
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Syncing…' : 'Refresh'}
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topCards.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                        <Link href={c.href}>
                            <div className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 hover:border-[#A67C52]/40 hover:bg-[#A67C52]/5 transition-all group cursor-pointer">
                                <c.icon className="w-5 h-5 mb-3 group-hover:scale-110 transition-transform" style={{ color: c.color }} />
                                <div className="text-3xl font-black text-[#EDE0D4]">
                                    {loading ? <span className="inline-block w-10 h-7 bg-[#3D2B1F]/40 rounded animate-pulse" /> : c.value}
                                </div>
                                <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{c.label}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* User Growth */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <TrendingUp className="w-4 h-4 text-[#A67C52]" /> New Users — Last 7 Days
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={userGrowth}>
                            <defs>
                                <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A67C52" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#A67C52" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                            <XAxis dataKey="day" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="users" name="Users" stroke="#A67C52" fill="url(#ugGrad)" strokeWidth={2} dot={{ fill: '#A67C52', r: 3 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Community Activity */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <MessageSquare className="w-4 h-4 text-[#A67C52]" /> Community Posts — Last 7 Days
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                            <XAxis dataKey="day" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="posts" name="Posts" fill="#A67C52" radius={[6, 6, 0, 0]} opacity={0.8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Mood donut */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <Activity className="w-4 h-4 text-[#A67C52]" /> Mood Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie data={moodData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                dataKey="value" strokeWidth={0} animationBegin={0}>
                                {moodData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} opacity={0.85} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: '#1A0F0E', border: '1px solid #3D2B1F', borderRadius: 12, fontSize: 11 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-1.5 mt-3">
                        {moodData.map(m => (
                            <div key={m.name} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: m.color }} />
                                <span className="text-[10px] text-[#A67C52]/60 font-bold">{m.name} {m.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Role distribution */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <Shield className="w-4 h-4 text-[#A67C52]" /> Role Distribution
                    </h3>
                    <div className="space-y-3 mt-2">
                        {[
                            { label: 'Users', count: stats?.breakdown?.users ?? 0, color: 'bg-[#A67C52]', total: stats?.totalRegistered || 1 },
                            { label: 'Helpers', count: stats?.breakdown?.helpers ?? 0, color: 'bg-[#7F5539]', total: stats?.totalRegistered || 1 },
                            { label: 'Admins', count: stats?.breakdown?.admins ?? 0, color: 'bg-[#4E342E]', total: stats?.totalRegistered || 1 },
                        ].map(r => (
                            <div key={r.label} className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-[#A67C52]/60">{r.label}</span>
                                    <span className="text-xs font-black text-[#EDE0D4]">{loading ? '-' : r.count}</span>
                                </div>
                                <div className="h-1.5 bg-[#0F0A08] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: `${(r.count / r.total) * 100}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className={`h-full rounded-full ${r.color}`} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#3D2B1F]/30 grid grid-cols-2 gap-3">
                        <div className="text-center">
                            <p className="text-2xl font-black text-[#EDE0D4]">{loading ? '-' : stats?.activeNow ?? 0}</p>
                            <p className="text-[9px] text-[#A67C52]/40 font-black uppercase tracking-widest">Active Now</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-amber-500/80">{loading ? '-' : `${stats?.moodSatisfaction ?? 0}%`}</p>
                            <p className="text-[9px] text-[#A67C52]/40 font-black uppercase tracking-widest">Satisfaction</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] mb-5">Quick Actions</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'Review Applications', href: '/admin/applications', icon: ClipboardList, count: stats?.pendingApplications },
                            { label: 'Manage Users', href: '/admin/users', icon: Users, count: stats?.totalUsers },
                            { label: 'Manage Helpers', href: '/admin/helpers', icon: UserCheck, count: stats?.totalHelpers },
                            { label: 'Reports', href: '/admin/reports', icon: Activity, count: 0 },
                            { label: 'Settings', href: '/admin/settings', icon: BotMessageSquare, count: null },
                        ].map((a, i) => (
                            <Link key={i} href={a.href}>
                                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#A67C52]/10 border border-transparent hover:border-[#A67C52]/20 transition-all group cursor-pointer mt-1">
                                    <a.icon className="w-4 h-4 text-[#A67C52]/60 group-hover:text-[#A67C52] transition-colors shrink-0" />
                                    <span className="text-sm font-semibold text-[#EDE0D4]/60 group-hover:text-[#EDE0D4] transition-colors flex-1">{a.label}</span>
                                    {a.count != null && <span className="text-[10px] font-black text-[#A67C52] bg-[#A67C52]/10 px-2 py-0.5 rounded-full">{loading ? '-' : a.count}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

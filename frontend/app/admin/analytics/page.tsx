'use client';
import React from "react";
import { motion } from "framer-motion";
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { TrendingUp, Users, UserCheck, MessageSquare, CalendarHeart } from "lucide-react";

const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
const userGrowth = weeks.map((w, i) => ({ week: w, cumulative: [120, 185, 240, 310, 390, 470, 580, 640][i], new: [20, 65, 55, 70, 80, 80, 110, 60][i] }));
const sessionTrend = weeks.map((w, i) => ({ week: w, sessions: [40, 68, 52, 85, 74, 90, 112, 95][i] }));
const communityGrowth = weeks.map((w, i) => ({ week: w, posts: [15, 28, 22, 44, 38, 55, 72, 60][i], comments: [8, 18, 14, 30, 25, 40, 55, 48][i] }));

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1A0F0E] border border-[#3D2B1F] rounded-xl p-3 text-xs shadow-xl">
            <p className="text-[#A67C52] font-black mb-1">{label}</p>
            {payload.map((p: any) => <p key={p.name} className="text-[#EDE0D4] font-bold">{p.name}: {p.value}</p>)}
        </div>
    );
};

export default function PlatformAnalyticsPage() {
    return (
        <div className="space-y-6 pb-10">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Registered', value: 640, icon: Users, color: '#A67C52', delta: '+12%' },
                    { label: 'Helper Sessions', value: 592, icon: CalendarHeart, color: '#7F5539', delta: '+8.4%' },
                    { label: 'Community Posts', value: 334, icon: MessageSquare, color: '#B08968', delta: '+22%' },
                    { label: 'Active Helpers', value: 56, icon: UserCheck, color: '#9C6644', delta: '+4' },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 space-y-3">
                        <div className="flex items-start justify-between">
                            <c.icon className="w-4 h-4" style={{ color: c.color }} />
                            <span className="text-[10px] font-black text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">{c.delta}</span>
                        </div>
                        <p className="text-3xl font-black text-[#EDE0D4]">{c.value}</p>
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* User Growth */}
            <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                    <TrendingUp className="w-4 h-4 text-[#A67C52]" /> User Growth — Last 8 Weeks
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={userGrowth}>
                        <defs>
                            <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#A67C52" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#A67C52" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="newGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7F5539" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#7F5539" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                        <XAxis dataKey="week" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="cumulative" name="Total Users" stroke="#A67C52" fill="url(#cumGrad)" strokeWidth={2} dot={{ fill: '#A67C52', r: 3 }} />
                        <Area type="monotone" dataKey="new" name="New Users" stroke="#7F5539" fill="url(#newGrad)" strokeWidth={1.5} dot={{ fill: '#7F5539', r: 2 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Sessions + Community side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Helper sessions */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <CalendarHeart className="w-4 h-4 text-[#A67C52]" /> Helper Sessions — Last 8 Weeks
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={sessionTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                            <XAxis dataKey="week" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="sessions" name="Sessions" fill="#A67C52" radius={[6, 6, 0, 0]} opacity={0.8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Community engagement */}
                <div className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                    <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                        <MessageSquare className="w-4 h-4 text-[#A67C52]" /> Community Engagement — Last 8 Weeks
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={communityGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3D2B1F30" />
                            <XAxis dataKey="week" tick={{ fill: '#A67C5260', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#A67C5260', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="posts" name="Posts" stroke="#A67C52" strokeWidth={2} dot={{ fill: '#A67C52', r: 3 }} />
                            <Line type="monotone" dataKey="comments" name="Comments" stroke="#7F5539" strokeWidth={1.5} dot={{ fill: '#7F5539', r: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

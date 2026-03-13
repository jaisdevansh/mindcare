'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, BotMessageSquare, Users, Activity, Loader2, RefreshCw, ArrowRight, Sparkles, Brain } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { authService } from '@/lib/services/auth.service';
import { assignmentService } from '@/lib/services/assignment.service';
import { MentalScoreCard } from './MentalScoreCard';
import { AnimatedMoodChart } from './AnimatedMoodChart';
import { MoodHeatmap } from './MoodHeatmap';
import { EmotionalCalendar } from './EmotionalCalendar';
import { AITherapistWidget } from './AITherapistWidget';
import { AIInsights } from './AIInsights';
import { ExerciseCards } from './ExerciseCards';

// ─── MOOD EMOJI ───────────────────────────────────────────────────────────────

const MOOD_EMOJI: Record<string, string> = {
    happy: '😊', neutral: '😐', sad: '😔', stressed: '😤', anxious: '😰', burnout: '🥵'
};
const MOOD_BG: Record<string, string> = {
    happy: 'from-emerald-500/15 to-teal-500/5 border-emerald-500/20',
    neutral: 'from-indigo-500/15 to-violet-500/5 border-indigo-500/20',
    sad: 'from-blue-500/15 to-indigo-500/5 border-blue-500/20',
    stressed: 'from-amber-500/15 to-yellow-500/5 border-amber-500/20',
    anxious: 'from-orange-500/15 to-amber-500/5 border-orange-500/20',
    burnout: 'from-rose-500/15 to-red-500/5 border-rose-500/20',
};
const MOOD_INSIGHT: Record<string, string> = {
    happy: 'You\'re in a great space today. Keep nurturing that positivity.',
    neutral: 'You\'re in a balanced state — a good day to reflect and recharge.',
    sad: 'It\'s okay to feel this way. Consider a grounding or breathing exercise.',
    stressed: 'Stress is high today. Try the 4-7-8 breathing exercise below.',
    anxious: 'You seem anxious. A short walk or grounding technique may help.',
    burnout: 'Signs of burnout detected. Rest is productive — take it easy today.',
};

// ─── MOOD SCORE MAP ───────────────────────────────────────────────────────────

const MOOD_SCORE_MAP: Record<string, number> = {
    happy: 5, neutral: 3, sad: 1, stressed: 2, anxious: 2, burnout: 0
};

// ─── QUICK ACTION BUTTON ──────────────────────────────────────────────────────

const QuickAction = ({ href, icon: Icon, label, color }: { href: string; icon: any; label: string; color: string }) => (
    <Link href={href} className="flex-1">
        <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer`}>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#9DA7B3] uppercase tracking-wider text-center">{label}</span>
        </motion.div>
    </Link>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export const UserDashboard = () => {
    const { user, setUser, setRiskScore } = useAppStore();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAll = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        try {
            const [profileRes, histRes] = await Promise.all([
                authService.getMe(),
                assignmentService.getHistory(),
            ]);
            if (profileRes?.success) setUser(profileRes.data);
            if (histRes?.success) {
                const h = histRes.data || [];
                setHistory(h);
                if (h.length > 0) setRiskScore(h[0].mentalScore ?? 50);
            }
        } catch { }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // ── Derived data ──────────────────────────────────────────────────────────

    const latest = history[0];
    const mood = latest?.detectedMood?.toLowerCase() || 'neutral';
    const mentalScore = latest?.mentalScore ?? 0;
    const riskLevel: 'Low' | 'Moderate' | 'High' = latest?.riskLevel ?? 'Moderate';

    // Build 7-day chart data from history
    const chartData = (() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const result = days.map(day => {
            const d = new Date();
            const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
            const todayIdx = d.getDay();
            let offset = todayIdx - dayIdx;
            if (offset < 0) offset += 7;
            const target = new Date();
            target.setDate(target.getDate() - offset);
            const dateStr = target.toISOString().split('T')[0];
            const match = history.find(h => h.createdAt?.startsWith(dateStr));
            return {
                day,
                score: match ? MOOD_SCORE_MAP[match.detectedMood?.toLowerCase() || 'neutral'] ?? 3 : 3,
                mood: match?.detectedMood || '',
            };
        });
        return result;
    })();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#7C5CFF]/20 border border-[#7C5CFF]/30 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-[#7C5CFF] animate-spin" />
                    </div>
                    <p className="text-[#9DA7B3] text-sm font-medium">Loading your wellness dashboard…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5 pb-12">

            {/* ── Welcome Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Dashboard <span className="text-[#7C5CFF]">Overview</span>
                    </h1>
                </div>
                <button onClick={() => fetchAll(true)}
                    className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#9DA7B3] hover:text-white hover:bg-white/[0.08] transition-all">
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </motion.div>

            {/* ── Premium Empty State (Hero) ── */}
            <AnimatePresence>
                {history.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-12 flex flex-col items-center text-center space-y-8"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#7C5CFF]/10 via-transparent to-transparent pointer-events-none" />

                        {/* Hero Icon */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 2, -2, 0]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shadow-[0_0_40px_rgba(124,92,255,0.3)]">
                                <Brain className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute -inset-4 bg-[#7C5CFF]/20 blur-2xl rounded-full -z-10" />
                        </motion.div>

                        {/* Text Content */}
                        <div className="max-w-md space-y-3">
                            <h2 className="text-4xl font-black text-white tracking-tight">Mental Wellness Check-in</h2>
                            <p className="text-[#9DA7B3] text-sm leading-relaxed">
                                Answer <span className="text-white font-bold">10 questions</span> about how you're feeling. Our AI will analyze your responses and generate a personalized wellness report.
                            </p>
                        </div>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                { icon: Activity, label: 'Mood Detection' },
                                { icon: Brain, label: 'Risk Analysis' },
                                { icon: Sparkles, label: 'AI Guidance' }
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl">
                                    <f.icon className="w-4 h-4 text-[#7C5CFF]" />
                                    <span className="text-xs font-bold text-[#9DA7B3]">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <Link href="/assessment">
                            <motion.div
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,92,255,0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-4 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-[1.25rem] font-black text-lg flex items-center gap-3 shadow-xl transition-all"
                            >
                                Begin Assessment <ArrowRight className="w-6 h-6" />
                            </motion.div>
                        </Link>

                        <p className="text-[10px] text-[#555E6D] font-bold uppercase tracking-[0.2em]">
                            Takes about 3-5 minutes • Completely private
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── ROW 1: Score + Mood + Quick Actions ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Mental Score */}
                <MentalScoreCard score={mentalScore} riskLevel={riskLevel} />

                {/* Current Mood Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className={`relative overflow-hidden bg-gradient-to-br border rounded-[1.5rem] p-6 flex flex-col justify-between ${MOOD_BG[mood] || MOOD_BG.neutral}`}>
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-[50px] bg-current opacity-20 pointer-events-none" />
                    <div>
                        <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-3">Current Mood</p>
                        <div className="flex items-center gap-3 mb-3">
                            <motion.span className="text-5xl" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                                {MOOD_EMOJI[mood] || '🧠'}
                            </motion.span>
                            <p className="text-2xl font-black text-white capitalize">{mood}</p>
                        </div>
                        <p className="text-xs text-[#9DA7B3] leading-relaxed">{MOOD_INSIGHT[mood] || MOOD_INSIGHT.neutral}</p>
                    </div>
                    {latest && (
                        <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                            <span className="text-[10px] text-[#9DA7B3]">
                                {new Date(latest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-400' : riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                {riskLevel} Risk
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    className="bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-5">
                    <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-4">Quick Actions</p>
                    <div className="flex gap-3 mb-3">
                        <QuickAction href="/assessment" icon={ClipboardList} label="Assessment" color="bg-[#7C5CFF]/20 border border-[#7C5CFF]/30 text-[#A78BFA]" />
                        <QuickAction href="/ai-chat" icon={BotMessageSquare} label="AI Chat" color="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" />
                        <QuickAction href="/helpers" icon={Users} label="Helpers" color="bg-rose-500/20 border border-rose-500/30 text-rose-400" />
                    </div>
                    <Link href="/history">
                        <motion.div whileHover={{ x: 4 }}
                            className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-white/[0.12] transition-all cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#7C5CFF]" />
                                <span className="text-xs font-semibold text-white">View Full History</span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#9DA7B3]" />
                        </motion.div>
                    </Link>
                </motion.div>
            </div>

            {/* ── ROW 2: Chart + Heatmap ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3">
                    <AnimatedMoodChart data={chartData} />
                </div>
                <div className="lg:col-span-2">
                    <MoodHeatmap history={history} />
                </div>
            </div>

            {/* ── ROW 3: Calendar + AI Therapist ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EmotionalCalendar history={history} />
                <AITherapistWidget />
            </div>

            {/* ── ROW 4: AI Insights + Exercises ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AIInsights history={history} />
                <ExerciseCards />
            </div>
        </div>
    );
};

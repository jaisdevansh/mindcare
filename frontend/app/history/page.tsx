'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History as HistoryIcon, Brain, TrendingUp, AlertTriangle,
    CheckCircle2, Clock, Sparkles, ChevronDown, ChevronUp,
    Loader2, FileQuestion, RotateCcw, Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { assignmentService } from '@/lib/services/assignment.service';
import { useRouter } from 'next/navigation';

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface AssessmentResult {
    _id: string;
    detectedMood: string;
    confidenceScore: number;
    depressionScore: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    mentalScore: number;
    mentalScoreCategory: 'Healthy' | 'Moderate' | 'High Risk';
    predictedMood: string;
    predictedMoodConfidence: number;
    suggestedExercises: string[];
    aiSuggestions: string[];
    helperRecommended: boolean;
    createdAt: string;
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const MOOD_EMOJI: Record<string, string> = {
    happy: '😊', neutral: '😐', sad: '😔', stressed: '😤', anxious: '😰', burnout: '🥵'
};

const RISK_CONFIG = {
    Low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
    Moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
    High: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-400' },
};

const SCORE_COLOR = (score: number) =>
    score >= 61 ? '#10b981' : score >= 31 ? '#f59e0b' : '#f43f5e';

// ─── MINI SCORE BAR ──────────────────────────────────────────────────────────

const ScoreBar = ({ score }: { score: number }) => (
    <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: SCORE_COLOR(score) }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </div>
        <span className="text-xs font-bold text-white w-8 text-right">{score}</span>
    </div>
);

// ─── ROW CARD ────────────────────────────────────────────────────────────────

const HistoryCard = ({ item, index }: { item: AssessmentResult; index: number }) => {
    const [expanded, setExpanded] = useState(false);
    const risk = RISK_CONFIG[item.riskLevel];
    const date = new Date(item.createdAt);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all"
        >
            {/* Main Row */}
            <button
                onClick={() => setExpanded(prev => !prev)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 group"
            >
                {/* Mood emoji */}
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {MOOD_EMOJI[item.detectedMood] || '🧠'}
                </div>

                {/* Date + mood */}
                <div className="min-w-[120px] shrink-0">
                    <p className="text-white text-sm font-bold capitalize">{item.detectedMood}</p>
                    <p className="text-[#9DA7B3] text-xs mt-0.5">
                        {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                </div>

                {/* Score bar */}
                <div className="flex-1 hidden sm:block">
                    <p className="text-[10px] text-[#9DA7B3] font-bold uppercase tracking-widest mb-1.5">Mental Score</p>
                    <ScoreBar score={item.mentalScore} />
                </div>

                {/* Risk badge */}
                <span className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${risk.bg} ${risk.color} shrink-0`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                    {item.riskLevel}
                </span>

                {/* Mood category */}
                <span className="hidden lg:block text-xs text-[#9DA7B3] font-medium shrink-0 w-20 text-right">
                    {item.mentalScoreCategory}
                </span>

                {/* Expand toggle */}
                <div className="ml-auto shrink-0 text-[#9DA7B3] group-hover:text-white transition-colors">
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {/* Expanded Detail Panel */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-white/[0.06]"
                    >
                        <div className="px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Stats */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-3">Analysis</p>
                                {[
                                    { label: 'Mental Score', value: `${item.mentalScore}/100` },
                                    { label: 'Depression Score', value: `${item.depressionScore}/100` },
                                    { label: 'Confidence', value: `${item.confidenceScore}%` },
                                    { label: 'Predicted Mood', value: `${item.predictedMood} (${item.predictedMoodConfidence}%)` },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between text-sm">
                                        <span className="text-[#9DA7B3] font-medium">{label}</span>
                                        <span className="text-white font-bold capitalize">{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Exercises */}
                            {item.suggestedExercises?.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-3">Exercises Given</p>
                                    <div className="space-y-2">
                                        {item.suggestedExercises.slice(0, 3).map((ex, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                                                <p className="text-xs text-[#9DA7B3] leading-snug">{ex}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* AI Suggestions */}
                            {item.aiSuggestions?.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-3">AI Suggestions</p>
                                    <div className="space-y-2">
                                        {item.aiSuggestions.slice(0, 3).map((s, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                                <p className="text-xs text-[#9DA7B3] leading-snug">{s}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {item.helperRecommended && (
                            <div className="mx-5 mb-4 px-4 py-2.5 bg-rose-500/8 border border-rose-500/20 rounded-xl flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                                <p className="text-xs text-rose-300 font-medium">Helper support was recommended during this session.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<AssessmentResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        assignmentService.getHistory()
            .then(res => {
                if (res.success) setHistory(res.data || []);
                else setError('Failed to load history.');
            })
            .catch(() => setError('Could not connect to server.'))
            .finally(() => setLoading(false));
    }, []);

    // ── Aggregate stats ──
    const avgScore = history.length
        ? Math.round(history.reduce((s, r) => s + r.mentalScore, 0) / history.length)
        : 0;
    const highRiskCount = history.filter(r => r.riskLevel === 'High').length;
    const lastMood = history[0]?.detectedMood || '—';

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-4">
                        <HistoryIcon className="w-3 h-3" /> Assessment History
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-1">Your Wellness Journey</h1>
                    <p className="text-[#9DA7B3] text-sm font-medium">
                        {history.length > 0 ? `${history.length} check-in${history.length > 1 ? 's' : ''} completed` : 'No check-ins yet'}
                    </p>
                </div>
                <button
                    onClick={() => router.push('/assessment')}
                    className="flex items-center gap-2 h-10 px-5 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 hover:opacity-90 transition-all shrink-0"
                >
                    <Brain className="w-4 h-4" /> New Check-in
                </button>
            </div>

            {/* Summary Cards */}
            {history.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Avg Score', value: avgScore, sub: '/100', icon: Activity, color: 'text-indigo-400' },
                        { label: 'Latest Mood', value: `${MOOD_EMOJI[lastMood] || '🧠'} ${lastMood}`, sub: '', icon: Brain, color: 'text-violet-400' },
                        { label: 'High Risk Sessions', value: highRiskCount, sub: `/ ${history.length}`, icon: AlertTriangle, color: 'text-rose-400' },
                    ].map(({ label, value, sub, icon: Icon, color }) => (
                        <div key={label} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-center">
                            <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                            <p className="text-xl font-black text-white capitalize">{value}<span className="text-xs font-medium text-[#9DA7B3]">{sub}</span></p>
                            <p className="text-[10px] text-[#9DA7B3] font-bold uppercase tracking-widest mt-1">{label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-[#7C5CFF] animate-spin" />
                    <p className="text-[#9DA7B3] text-sm font-medium">Loading your history…</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <AlertTriangle className="w-8 h-8 text-rose-400" />
                    <p className="text-rose-300 font-medium text-sm">{error}</p>
                </div>
            ) : history.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-center gap-5"
                >
                    <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <FileQuestion className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">No assessments yet</h2>
                        <p className="text-[#9DA7B3] text-sm font-medium max-w-xs">
                            Complete your first mental wellness check-in to see your history and trends here.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/assessment')}
                        className="flex items-center gap-2 h-11 px-7 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-2xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 hover:opacity-90 transition-all"
                    >
                        <RotateCcw className="w-4 h-4" /> Start First Assessment
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1 mb-1">
                        <p className="text-xs text-[#9DA7B3] font-bold uppercase tracking-widest">
                            {history.length} record{history.length > 1 ? 's' : ''} — newest first
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-[#9DA7B3]">
                            <Clock className="w-3 h-3" />
                            Click any row to expand
                        </div>
                    </div>
                    {history.map((item, i) => (
                        <HistoryCard key={item._id} item={item} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}

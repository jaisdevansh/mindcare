'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InsightProps {
    history: { detectedMood?: string; mentalScore?: number; riskLevel?: string; createdAt?: string }[];
}

function generateInsights(history: InsightProps['history']): { text: string; type: 'positive' | 'neutral' | 'warning' }[] {
    if (!history.length) return [
        { text: 'Take your first assessment to get personalized AI insights.', type: 'neutral' },
    ];

    const insights: { text: string; type: 'positive' | 'neutral' | 'warning' }[] = [];
    const moods = history.map(h => h.detectedMood?.toLowerCase()).filter(Boolean);
    const scores = history.map(h => h.mentalScore).filter((s): s is number => s !== undefined);

    // Score trend
    if (scores.length >= 2) {
        const recent = scores.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, scores.length);
        const older = scores.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, scores.length);
        if (recent > older + 5) insights.push({ text: 'Your mental score has been improving recently. Keep it up!', type: 'positive' });
        else if (recent < older - 5) insights.push({ text: 'Your mental score has dipped recently. Take extra care of yourself.', type: 'warning' });
    }

    // Dominant mood
    const moodCounts: Record<string, number> = {};
    moods.forEach(m => { if (m) moodCounts[m] = (moodCounts[m] || 0) + 1; });
    const dominant = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    if (dominant) {
        const [mood, count] = dominant;
        if (count > 1) {
            if (mood === 'happy') insights.push({ text: `You've felt "${mood}" most often — that's a great sign!`, type: 'positive' });
            else if (['stressed', 'anxious', 'burnout'].includes(mood)) {
                insights.push({ text: `You've reported "${mood}" in ${count} recent sessions. Consider trying relaxation exercises.`, type: 'warning' });
            } else {
                insights.push({ text: `Your mood has been mostly "${mood}" lately.`, type: 'neutral' });
            }
        }
    }

    // Weekend vs weekday
    const weekendScores = history.filter(h => {
        const d = new Date(h.createdAt || '').getDay();
        return d === 0 || d === 6;
    }).map(h => h.mentalScore).filter((s): s is number => s !== undefined);
    const weekdayScores = history.filter(h => {
        const d = new Date(h.createdAt || '').getDay();
        return d !== 0 && d !== 6;
    }).map(h => h.mentalScore).filter((s): s is number => s !== undefined);

    if (weekendScores.length && weekdayScores.length) {
        const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
        if (avg(weekendScores) > avg(weekdayScores) + 5) {
            insights.push({ text: 'Your mood improves on weekends — work stress may be a factor.', type: 'neutral' });
        }
    }

    // High-risk count
    const highRisk = history.filter(h => h.riskLevel === 'High').length;
    if (highRisk > 2) insights.push({ text: `You've had ${highRisk} high-risk sessions. Please consider talking to a professional.`, type: 'warning' });

    if (!insights.length) insights.push({ text: 'Keep checking in regularly to build your wellness picture.', type: 'neutral' });
    return insights.slice(0, 4);
}

export const AIInsights = ({ history }: InsightProps) => {
    const insights = generateInsights(history);
    const ICON = { positive: TrendingUp, neutral: Minus, warning: TrendingDown };
    const COLOR = {
        positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        neutral: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-5"
        >
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#7C5CFF]/30 to-[#5B6CFF]/20 border border-[#7C5CFF]/20 flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-[#A78BFA]" />
                </div>
                <h3 className="text-sm font-black text-white">AI Insights</h3>
                <span className="ml-auto text-[10px] text-[#9DA7B3] bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-lg">
                    Generated from your data
                </span>
            </div>

            <div className="space-y-3">
                {insights.map((insight, i) => {
                    const Icon = ICON[insight.type];
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            className={`flex items-start gap-3 p-3 rounded-xl border ${COLOR[insight.type]}`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${COLOR[insight.type]}`}>
                                <Icon className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-medium">{insight.text}</p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

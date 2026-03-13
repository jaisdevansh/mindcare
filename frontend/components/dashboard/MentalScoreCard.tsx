'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';
import { Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const RISK_COLOR: Record<string, { fill: string; glow: string; label: string; text: string }> = {
    Low: { fill: '#10b981', glow: '#10b981', label: 'Healthy', text: 'text-emerald-400' },
    Moderate: { fill: '#f59e0b', glow: '#f59e0b', label: 'Moderate', text: 'text-amber-400' },
    High: { fill: '#ef4444', glow: '#ef4444', label: 'High Risk', text: 'text-rose-400' },
};

export const MentalScoreCard = ({ score, riskLevel }: { score: number; riskLevel: string }) => {
    const [displayed, setDisplayed] = useState(0);
    const cfg = RISK_COLOR[riskLevel] ?? RISK_COLOR.Moderate;
    const hasData = score > 0;
    const safeScore = Math.max(2, score);
    const data = [{ v: safeScore }, { v: 100 - safeScore }];

    useEffect(() => {
        if (!hasData) return;
        let frame: number;
        const start = performance.now();
        const animate = (now: number) => {
            const t = Math.min((now - start) / 1200, 1);
            setDisplayed(Math.round(t * score));
            if (t < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [score]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-6 flex flex-col items-center"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/8 to-transparent pointer-events-none" />
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[60px]" style={{ background: cfg.glow + '22' }} />

            <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-2 relative">Mental Score</p>

            {hasData ? (
                <>
                    <div className="relative w-44 h-28">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} cx="50%" cy="85%" innerRadius={52} outerRadius={70}
                                    startAngle={180} endAngle={0} dataKey="v" stroke="none" cornerRadius={4}>
                                    <Cell fill={cfg.fill} />
                                    <Cell fill="rgba(255,255,255,0.04)" />
                                    <Label position="center" content={(props: any) => {
                                        const { viewBox } = props;
                                        if (!viewBox) return null;
                                        const { cx, cy } = viewBox;
                                        if (!cx || !cy || isNaN(cx) || isNaN(cy)) return null;
                                        return (
                                            <text x={cx} y={cy - 8} textAnchor="middle">
                                                <tspan style={{ fontSize: 32, fontWeight: 900, fill: 'white' }}>
                                                    {displayed}
                                                </tspan>
                                            </text>
                                        );
                                    }} />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: cfg.fill, boxShadow: `0 0 8px ${cfg.fill}` }} />
                        <span className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</span>
                    </div>
                    <p className="text-xs text-[#9DA7B3] mt-1 text-center">
                        {riskLevel === 'Low' ? 'You\'re in great shape today!' :
                            riskLevel === 'High' ? 'Consider speaking with a professional.' :
                                'Keep monitoring your mental wellness.'}
                    </p>
                </>
            ) : (
                <div className="flex flex-col items-center gap-3 py-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-[6px] border-white/[0.06] flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-[6px] border-dashed border-[#7C5CFF]/30 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl">🧠</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-white">No score yet</p>
                        <p className="text-[10px] text-[#9DA7B3] mt-0.5">Take an assessment to track your wellness</p>
                    </div>
                    <Link href="/assessment">
                        <div className="flex items-center gap-1.5 h-8 px-4 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-xs font-bold">
                            Start Check-in <ArrowRight className="w-3 h-3" />
                        </div>
                    </Link>
                </div>
            )}

            <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-xl">
                <Brain className="w-3.5 h-3.5 text-[#7C5CFF]" />
                <span className="text-[10px] text-[#9DA7B3] font-semibold">AI Assessment Score</span>
            </div>
        </motion.div>
    );
};

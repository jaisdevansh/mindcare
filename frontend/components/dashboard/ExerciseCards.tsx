'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Footprints, Zap, Heart, Play, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const EXERCISES = [
    {
        id: 'breathing',
        icon: Wind,
        color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/25',
        accent: 'text-cyan-400',
        glow: '#06b6d4',
        title: '4-7-8 Breathing',
        desc: 'Inhale 4s · Hold 7s · Exhale 8s',
        duration: '5 min',
        tag: 'Calming',
        steps: ['Sit comfortably and close your eyes.', 'Inhale through nose for 4 seconds.', 'Hold breath for 7 seconds.', 'Exhale completely for 8 seconds.', 'Repeat 4 cycles.'],
    },
    {
        id: 'grounding',
        icon: Footprints,
        color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/25',
        accent: 'text-emerald-400',
        glow: '#10b981',
        title: '5-4-3-2-1 Grounding',
        desc: 'Engage all five senses',
        duration: '3 min',
        tag: 'Anxiety Relief',
        steps: ['Name 5 things you can see.', 'Touch 4 things around you.', 'Listen for 3 sounds.', 'Identify 2 scents.', 'Notice 1 thing you can taste.'],
    },
    {
        id: 'walk',
        icon: Zap,
        color: 'from-amber-500/20 to-orange-500/10 border-amber-500/25',
        accent: 'text-amber-400',
        glow: '#f59e0b',
        title: 'Power Walk',
        desc: 'Brisk 10-minute walk',
        duration: '10 min',
        tag: 'Energy Boost',
        steps: ['Put on comfortable shoes.', 'Step outside or find space indoors.', 'Walk briskly for 10 minutes.', 'Focus on your breathing rhythm.', 'Notice how your body feels.'],
    },
    {
        id: 'body-scan',
        icon: Heart,
        color: 'from-rose-500/20 to-pink-500/10 border-rose-500/25',
        accent: 'text-rose-400',
        glow: '#f43f5e',
        title: 'Body Scan',
        desc: 'Release tension head to toe',
        duration: '7 min',
        tag: 'Relaxation',
        steps: ['Lie down or sit comfortably.', 'Close eyes and take 3 deep breaths.', 'Focus attention on your head slowly.', 'Move awareness down through your body.', 'Release tension in each area.'],
    },
];

interface Exercise {
    id: string;
    icon: LucideIcon;
    color: string;
    accent: string;
    glow: string;
    title: string;
    desc: string;
    duration: string;
    tag: string;
    steps: string[];
}

const ExerciseModal = ({ ex, onClose }: { ex: Exercise; onClose: () => void }) => {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);

    if (done) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
                className="bg-[#080D1A] border border-white/10 rounded-3xl p-8 text-center max-w-sm w-full">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-black text-white mb-2">Great work! 🎉</h3>
                <p className="text-[#9DA7B3] text-sm mb-6">You completed the {ex.title} exercise.</p>
                <button onClick={onClose} className="w-full h-11 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl font-bold">Done</button>
            </motion.div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4" onClick={onClose}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#080D1A] border border-white/[0.08] rounded-3xl p-6 max-w-sm w-full">
                <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${ex.color} border flex items-center justify-center`}>
                        <ex.icon className={`w-5 h-5 ${ex.accent}`} />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white">{ex.title}</h3>
                        <p className={`text-[10px] font-bold ${ex.accent}`}>{ex.tag} · {ex.duration}</p>
                    </div>
                    <button onClick={onClose} className="ml-auto text-[#9DA7B3] hover:text-white text-xl leading-none">×</button>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5 mb-5">
                    {ex.steps.map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= step ? ex.accent.replace('text-', 'bg-') : 'bg-white/10'}`} />
                    ))}
                </div>

                <p className="text-[10px] text-[#9DA7B3] font-bold uppercase tracking-widest mb-2">Step {step + 1} of {ex.steps.length}</p>
                <motion.p key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="text-base font-semibold text-white leading-relaxed mb-8 min-h-[60px]">
                    {ex.steps[step]}
                </motion.p>

                <div className="flex gap-3">
                    {step > 0 && (
                        <button onClick={() => setStep(s => s - 1)}
                            className="flex-1 h-11 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl font-semibold text-sm">
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => step < ex.steps.length - 1 ? setStep(s => s + 1) : setDone(true)}
                        className={`flex-1 h-11 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl font-bold text-sm`}>
                        {step < ex.steps.length - 1 ? 'Next →' : 'Complete ✓'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export const ExerciseCards = () => {
    const [active, setActive] = useState<Exercise | null>(null);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-black text-white">Recommended Exercises</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {EXERCISES.map((ex, i) => (
                        <motion.div
                            key={ex.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 + 0.4 }}
                            className={`bg-gradient-to-br ${ex.color} border rounded-2xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-all cursor-default`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center">
                                    <ex.icon className={`w-4 h-4 ${ex.accent}`} />
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.06] ${ex.accent}`}>
                                    {ex.tag}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-black text-white leading-tight">{ex.title}</p>
                                <p className="text-[10px] text-[#9DA7B3] mt-0.5">{ex.desc}</p>
                                <p className={`text-[10px] font-bold mt-0.5 ${ex.accent}`}>{ex.duration}</p>
                            </div>
                            <button
                                onClick={() => setActive(ex)}
                                className="flex items-center gap-1.5 self-start h-7 px-3 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-lg text-xs font-bold transition-all"
                            >
                                <Play className="w-3 h-3" /> Start
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {active && <ExerciseModal ex={active} onClose={() => setActive(null)} />}
        </>
    );
};

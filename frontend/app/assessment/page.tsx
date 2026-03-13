'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { assignmentService } from '@/lib/services/assignment.service';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';
import {
    Brain, ChevronRight, ChevronLeft, Loader2, CheckCircle2,
    AlertTriangle, Heart, Sparkles, Activity, Wind, Dumbbell,
    Users, ArrowRight, RotateCcw, PenLine, ListChecks
} from 'lucide-react';

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type Mode = 'descriptive' | 'mcq';

interface Question {
    id: number;
    question: string;
    options?: string[]; // only for MCQ
}

interface AnalysisResult {
    mood: string;
    confidenceScore: number;
    depressionScore: number;
    riskLevel: 'Low' | 'Moderate' | 'High';
    mentalScore: number;
    mentalScoreCategory: string;
    predictedMood: string;
    predictedMoodConfidence: number;
    exercises: string[];
    suggestions: string[];
    helperRecommended: boolean;
    helperMessage: string | null;
}

// ─── MOOD EMOJI MAP ──────────────────────────────────────────────────────────

const MOOD_EMOJI: Record<string, string> = {
    happy: '😊', neutral: '😐', sad: '😔', stressed: '😤', anxious: '😰', burnout: '🥵'
};

const RISK_COLORS: Record<string, string> = {
    Low: 'text-emerald-400',
    Moderate: 'text-yellow-400',
    High: 'text-rose-400',
};

const RISK_BG: Record<string, string> = {
    Low: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    Moderate: 'from-yellow-500/20 to-amber-500/10 border-yellow-500/30',
    High: 'from-rose-500/20 to-red-500/10 border-rose-500/30',
};

// ─── SCORE ARC ───────────────────────────────────────────────────────────────

const ScoreArc = ({ score }: { score: number }) => {
    const radius = 70;
    const stroke = 10;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const dash = (score / 100) * circumference;
    const color = score >= 61 ? '#10b981' : score >= 31 ? '#f59e0b' : '#f43f5e';

    return (
        <svg height={radius * 2 + 20} width={radius * 2 + 20} className="drop-shadow-2xl">
            <circle stroke="rgba(255,255,255,0.05)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius + 10} cy={radius + 10} />
            <motion.circle
                stroke={color} fill="transparent" strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`} strokeLinecap="round"
                r={normalizedRadius} cx={radius + 10} cy={radius + 10}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - dash }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <text x={radius + 10} y={radius + 14} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">{score}</text>
            <text x={radius + 10} y={radius + 30} textAnchor="middle" fill="#94a3b8" fontSize="9">/100</text>
        </svg>
    );
};

// ─── MODE CARD ────────────────────────────────────────────────────────────────

const ModeCard = ({
    icon: Icon, title, description, badge, gradient, borderColor, onClick
}: {
    icon: any; title: string; description: string; badge: string;
    gradient: string; borderColor: string; onClick: () => void;
}) => (
    <motion.button
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full text-left p-8 rounded-[2rem] border-2 ${borderColor} bg-gradient-to-br ${gradient} backdrop-blur-xl relative overflow-hidden group transition-all duration-300 shadow-xl`}
    >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/[0.02] transition-opacity rounded-[2rem]" />
        <div className="relative z-10">
            <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80">
                    {badge}
                </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">{description}</p>
            <div className="mt-6 flex items-center gap-2 text-white/70 text-sm font-bold group-hover:text-white transition-colors">
                Choose this mode <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </motion.button>
);

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AssessmentPage() {
    const router = useRouter();
    const { setRiskScore } = useAppStore();

    const [mode, setMode] = useState<Mode | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<string[]>(Array(10).fill(''));
    // steps: 0=intro, 1=mode-select, 2..11=questions, 12=result
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loadingText, setLoadingText] = useState('Analyzing your responses...');

    const fetchQuestions = async (selectedMode: Mode) => {
        try {
            const res = await assignmentService.getQuestions(selectedMode);
            if (res.success) setQuestions(res.data.questions || res.data);
        } catch {
            toast.error('Failed to load questions. Please refresh.');
        }
    };

    const handleModeSelect = (selectedMode: Mode) => {
        setMode(selectedMode);
        fetchQuestions(selectedMode);
        setCurrentStep(2); // jump to first question
    };

    const questionIndex = currentStep - 2; // questions start at step 2
    const totalQuestions = 10;
    const progress = currentStep <= 1 ? 0
        : currentStep >= 12 ? 100
            : ((questionIndex + 1) / totalQuestions) * 100;

    const handleNext = () => {
        if (currentStep >= 2 && currentStep <= 11) {
            if (!answers[questionIndex]?.trim()) {
                toast.error(mode === 'mcq' ? 'Please select an option to continue.' : 'Please share your thoughts before continuing.');
                return;
            }
        }
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => setCurrentStep(prev => Math.max(0, prev - 1));

    const handleSubmit = async () => {
        if (!answers[totalQuestions - 1]?.trim()) {
            toast.error('Please answer the final question.');
            return;
        }

        setIsLoading(true);
        const loadingMessages = [
            'Analyzing your emotional state...',
            'Detecting mood patterns with AI...',
            'Calculating mental wellness score...',
            'Generating personalized guidance...',
            'Preparing your wellness report...',
        ];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % loadingMessages.length;
            setLoadingText(loadingMessages[idx]);
        }, 1800);

        try {
            const res = await assignmentService.submitAnswers(answers.slice(0, totalQuestions));
            if (res.success) {
                setResult(res.data);
                setRiskScore(res.data.depressionScore);
                setCurrentStep(12);
            } else {
                toast.error(res.message || 'Submission failed.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong.');
        } finally {
            clearInterval(interval);
            setIsLoading(false);
        }
    };

    const handleRetake = () => {
        setAnswers(Array(10).fill(''));
        setCurrentStep(0);
        setResult(null);
        setMode(null);
        setQuestions([]);
    };

    return (
        <div className="min-h-[80vh] max-w-3xl mx-auto flex flex-col">

            {/* Progress Bar */}
            {currentStep >= 2 && currentStep < 12 && (
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                        <span className="flex items-center gap-2">
                            {mode === 'mcq'
                                ? <><ListChecks className="w-3 h-3" /> MCQ Mode</>
                                : <><PenLine className="w-3 h-3" /> Descriptive Mode</>}
                            &nbsp;· Question {questionIndex + 1} of {totalQuestions}
                        </span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">

                {/* ─── INTRO SCREEN (Compact Hero) ─────────────────────────────────── */}
                {currentStep === 0 && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col items-center justify-center text-center py-4 relative overflow-hidden"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-indigo-500/10 blur-[80px] rounded-full -z-10" />

                        {/* Animated Icon (Smaller) */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative mb-6 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                        >
                            <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center border border-white/20 relative z-10 overflow-hidden">
                                <div className="absolute inset-0 bg-white/10" />
                                <Brain className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                        </motion.div>

                        <div className="space-y-3 mb-6 relative">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] uppercase tracking-[0.2em] font-black text-indigo-400 mb-1">
                                Mental Wellness AI 2.0
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-[0.9]">
                                Mental Wellness <br /> <span className="text-indigo-500">Check-in</span>
                            </h1>
                            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed font-medium px-4">
                                Share <span className="text-white font-bold">10 honest answers</span> about your state.
                                Our AI calculates your wellness score instantly.
                            </p>
                        </div>

                        {/* Feature Row (Horizontal) */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8 w-full max-w-xl relative">
                            {[
                                { icon: Activity, label: 'Mood Detection', color: 'text-indigo-400' },
                                { icon: Heart, label: 'Risk Analysis', color: 'text-rose-400' },
                                { icon: Sparkles, label: 'AI Guidance', color: 'text-amber-400' },
                            ].map((f) => (
                                <div key={f.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 flex items-center gap-2 backdrop-blur-xl">
                                    <f.icon className={`w-4 h-4 ${f.color}`} />
                                    <span className="text-white font-bold text-[10px] tracking-tight">{f.label}</span>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => setCurrentStep(1)}
                            className="h-14 px-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-lg font-black shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all active:scale-95 flex items-center gap-3 group"
                        >
                            Begin Assessment
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-6">
                            3-5 minutes • Anonymous & Secure
                        </p>
                    </motion.div>
                )}

                {/* ─── MODE SELECTION SCREEN ────────────────────────────────── */}
                {currentStep === 1 && (
                    <motion.div
                        key="mode-select"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35 }}
                        className="flex-1 flex flex-col py-6"
                    >
                        <div className="mb-10 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest mb-5"
                            >
                                <Sparkles className="w-3 h-3" /> Choose Your Style
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                                How would you like to answer?
                            </h2>
                            <p className="text-slate-400 font-medium max-w-md mx-auto">
                                Both modes analyze your mental wellness with the same AI — pick whatever feels more comfortable.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <ModeCard
                                icon={PenLine}
                                title="Descriptive"
                                description="Type your honest thoughts in free-form text. Great for expressing complex emotions and nuanced feelings."
                                badge="Open-ended"
                                gradient="from-indigo-500/15 to-violet-600/10"
                                borderColor="border-indigo-500/30 hover:border-indigo-400/60"
                                onClick={() => handleModeSelect('descriptive')}
                            />
                            <ModeCard
                                icon={ListChecks}
                                title="MCQ"
                                description="Choose from multiple options for each question. Fast, simple, and perfect if you prefer structured answers."
                                badge="Multiple Choice"
                                gradient="from-violet-500/15 to-pink-600/10"
                                borderColor="border-violet-500/30 hover:border-violet-400/60"
                                onClick={() => handleModeSelect('mcq')}
                            />
                        </div>

                        <button
                            onClick={handleBack}
                            className="mt-8 mx-auto flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-semibold"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Intro
                        </button>
                    </motion.div>
                )}

                {/* ─── QUESTION SCREENS ─────────────────────────────────────── */}
                {currentStep >= 2 && currentStep <= 11 && questions[questionIndex] && (
                    <motion.div
                        key={`q-${currentStep}`}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1"
                    >
                        <div className="bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <span className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                                        {questionIndex + 1}
                                    </span>
                                    <span className="text-slate-500 text-sm font-semibold tracking-widest uppercase">
                                        Question {questionIndex + 1} / {totalQuestions}
                                    </span>
                                    <span className={`ml-auto text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${mode === 'mcq' ? 'bg-violet-500/10 border-violet-500/30 text-violet-300' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'}`}>
                                        {mode === 'mcq' ? 'MCQ' : 'Descriptive'}
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
                                    {questions[questionIndex].question}
                                </h2>

                                {/* ── MCQ OPTIONS ──────────────────────────────── */}
                                {mode === 'mcq' && questions[questionIndex].options ? (
                                    <div className="space-y-3">
                                        {questions[questionIndex].options!.map((opt, optIdx) => {
                                            const isSelected = answers[questionIndex] === opt;
                                            return (
                                                <motion.button
                                                    key={optIdx}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => {
                                                        const updated = [...answers];
                                                        updated[questionIndex] = opt;
                                                        setAnswers(updated);
                                                    }}
                                                    className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 font-medium text-sm ${isSelected
                                                        ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/[0.07]'
                                                        }`}
                                                >
                                                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-white/20'
                                                        }`}>
                                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                    </span>
                                                    {opt}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* ── DESCRIPTIVE TEXTAREA ─────────────────── */
                                    <textarea
                                        value={answers[questionIndex]}
                                        onChange={e => {
                                            const updated = [...answers];
                                            updated[questionIndex] = e.target.value;
                                            setAnswers(updated);
                                        }}
                                        rows={5}
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/60 rounded-2xl p-5 text-white text-base placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none transition-all backdrop-blur-md"
                                        placeholder="Share your honest feelings here... There are no wrong answers."
                                    />
                                )}

                                <div className="flex justify-between items-center mt-8">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-semibold text-sm"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back
                                    </button>

                                    {currentStep < 11 ? (
                                        <Button
                                            onClick={handleNext}
                                            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
                                        >
                                            Next <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            className="h-12 px-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-indigo-600/30"
                                        >
                                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Analyze with AI</>}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ─── LOADING SCREEN ────────────────────────────────────────── */}
                {isLoading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
                    >
                        <div className="text-center p-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                className="w-20 h-20 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 mx-auto mb-6"
                            />
                            <motion.p key={loadingText} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white text-lg font-bold">
                                {loadingText}
                            </motion.p>
                        </div>
                    </motion.div>
                )}

                {/* ─── RESULT SCREEN ─────────────────────────────────────────── */}
                {currentStep === 12 && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 pb-12"
                    >
                        {/* Header Card */}
                        <div className={`bg-gradient-to-br ${RISK_BG[result.riskLevel]} border rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="text-center">
                                    <ScoreArc score={result.mentalScore} />
                                    <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Mental Score</p>
                                    <p className={`text-xs font-black mt-1 ${RISK_COLORS[result.riskLevel]} uppercase tracking-widest`}>{result.mentalScoreCategory}</p>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="text-6xl mb-3">{MOOD_EMOJI[result.mood] || '🧠'}</div>
                                    <h2 className="text-3xl font-black text-white mb-2 capitalize">{result.mood} Mood Detected</h2>
                                    <p className="text-slate-400 font-medium text-lg">
                                        Confidence: <span className="text-white font-bold">{result.confidenceScore}%</span>
                                    </p>
                                    <p className="text-slate-400 font-medium">
                                        Tomorrow's Predicted Mood: <span className="text-white font-bold capitalize">{result.predictedMood}</span>
                                        <span className="text-slate-500 text-sm ml-1">({result.predictedMoodConfidence}% confident)</span>
                                    </p>
                                    <div className="flex items-center gap-3 mt-4 flex-wrap">
                                        <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm font-bold">
                                            Depression Risk: <span className={RISK_COLORS[result.riskLevel]}>{result.riskLevel}</span>
                                        </div>
                                        <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-sm font-bold text-white">
                                            Score: {result.depressionScore}/100
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl border text-sm font-bold capitalize ${mode === 'mcq' ? 'bg-violet-500/10 border-violet-500/20 text-violet-300' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'}`}>
                                            {mode === 'mcq' ? '📋 MCQ Mode' : '✍️ Descriptive Mode'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Helper Recommendation */}
                        {result.helperRecommended && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-6 flex items-start gap-4"
                            >
                                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="text-rose-300 font-bold text-lg mb-1">Support Recommended</h3>
                                    <p className="text-slate-400 text-sm font-medium">{result.helperMessage}</p>
                                </div>
                                <Button
                                    onClick={() => router.push('/helpers')}
                                    className="bg-rose-600 hover:bg-rose-700 rounded-xl h-10 px-5 text-sm font-bold shrink-0"
                                >
                                    <Users className="w-4 h-4 mr-2" /> Find Helper
                                </Button>
                            </motion.div>
                        )}

                        {/* Grid: Exercises + Suggestions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                                <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                    <Wind className="w-5 h-5 text-teal-400" /> Instant Calming Exercises
                                </h3>
                                <div className="space-y-3">
                                    {result.exercises.map((ex, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="flex items-start gap-3 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                                            <p className="text-slate-300 text-sm leading-relaxed font-medium">{ex}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                                <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-amber-400" /> AI Therapist Suggestions
                                </h3>
                                <div className="space-y-3">
                                    {result.suggestions.map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl"
                                        >
                                            <Dumbbell className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                            <p className="text-slate-300 text-sm leading-relaxed font-medium">{s}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Button
                                onClick={handleRetake}
                                variant="outline"
                                className="flex-1 h-14 border-white/10 text-white hover:bg-white/5 rounded-2xl font-bold flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" /> Retake Assessment
                            </Button>
                            <Button
                                onClick={() => router.push('/dashboard')}
                                className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                            >
                                <Activity className="w-5 h-5" /> View Dashboard
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

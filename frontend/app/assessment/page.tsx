'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { assignmentService } from '@/lib/services/assignment.service';
import { dynamicAssessmentService } from '@/lib/services/dynamicAssessment.service';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';
import {
    Brain, ChevronRight, ChevronLeft, Loader2, CheckCircle2,
    AlertTriangle, Heart, Sparkles, Activity, Wind, Dumbbell,
    Users, ArrowRight, RotateCcw, Zap, PenLine, ListChecks
} from 'lucide-react';
import { getMoodIcon, getMoodColor } from '@/lib/moodIcons';

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type Mode = 'descriptive' | 'mcq';

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

// Removed - now using Lucide icons from moodIcons.tsx

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
    // steps: 0=intro, 1=mode-select, 2=dynamic-questions, 3=result
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loadingText, setLoadingText] = useState('Analyzing your responses...');

    // Dynamic assessment state (used by both modes)
    const [sessionId, setSessionId] = useState<string>('');
    const [currentQuestion, setCurrentQuestion] = useState<string>('');
    const [currentAnswer, setCurrentAnswer] = useState<string>('');
    const [currentOptions, setCurrentOptions] = useState<string[]>([]); // For MCQ mode
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);

    // Auto-scroll to top when step changes
    useEffect(() => {
        const main = document.querySelector('main');
        if (main) {
            main.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentStep]);

    const totalQuestions = 10;
    const progress = currentStep === 0 || currentStep === 1 ? 0
        : currentStep === 3 ? 100
            : (questionNumber / totalQuestions) * 100;

    // Handle mode selection - Start dynamic assessment for selected mode
    const handleModeSelect = (selectedMode: Mode) => {
        setMode(selectedMode);
        startDynamicAssessment(selectedMode);
    };

    // Start dynamic assessment (both modes use this)
    const startDynamicAssessment = async (selectedMode: Mode) => {
        setIsLoading(true);
        try {
            const res = await dynamicAssessmentService.start();
            if (res.success) {
                setSessionId(res.data.sessionId);
                setCurrentQuestion(res.data.question);
                
                // For MCQ mode, generate options from the question
                if (selectedMode === 'mcq') {
                    setCurrentOptions(res.data.options || [
                        'Strongly Agree',
                        'Agree',
                        'Neutral',
                        'Disagree',
                        'Strongly Disagree'
                    ]);
                }
                
                setQuestionNumber(1);
                setCurrentStep(2); // Go to question screen
                toast.success(`${selectedMode === 'mcq' ? 'MCQ' : 'Descriptive'} Assessment started!`);
            } else {
                toast.error(res.message || 'Failed to start assessment');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to start assessment');
        } finally {
            setIsLoading(false);
        }
    };

    // Answer and get next question (both modes use this)
    const handleDynamicNext = async () => {
        if (!currentAnswer.trim()) {
            toast.error('Please provide an answer to continue');
            return;
        }

        setIsLoading(true);
        try {
            const res = await dynamicAssessmentService.answerAndGetNext(sessionId, currentAnswer);
            
            if (res.success) {
                if (res.data.isCompleted) {
                    // All 10 questions answered, auto submit!
                    setIsCompleted(true);
                    toast.success('All questions answered! Analyzing...');
                    handleDynamicSubmit();
                } else {
                    // Show next question
                    setCurrentQuestion(res.data.question);
                    setQuestionNumber(res.data.questionNumber);
                    setCurrentAnswer(''); // Clear input for next question
                    
                    // For MCQ, keep same options (or update if backend sends new ones)
                    if (mode === 'mcq') {
                        setCurrentOptions(res.data.options || [
                            'Strongly Agree',
                            'Agree',
                            'Neutral',
                            'Disagree',
                            'Strongly Disagree'
                        ]);
                    }
                }
            } else {
                toast.error(res.message || 'Failed to get next question');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to get next question');
        } finally {
            setIsLoading(false);
        }
    };

    // Submit dynamic assessment
    const handleDynamicSubmit = async () => {
        setIsLoading(true);
        const loadingMessages = [
            'Analyzing your 10 responses...',
            'Connecting the dots based on your answers...',
            'Detecting your unique mood patterns...',
            'Crafting highly personalized insights...',
            'Preparing your custom AI report...',
        ];
        let idx = 0;
        const interval = setInterval(() => {
            idx = (idx + 1) % loadingMessages.length;
            setLoadingText(loadingMessages[idx]);
        }, 2000);

        try {
            const res = await dynamicAssessmentService.submit(sessionId);
            
            if (res.success) {
                setResult(res.data);
                setRiskScore(res.data.depressionScore);
                setCurrentStep(3); // Show results
                toast.success('Analysis complete!');
            } else {
                toast.error(res.message || 'Failed to analyze assessment');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to analyze assessment');
        } finally {
            clearInterval(interval);
            setIsLoading(false);
        }
    };

    const handleRetake = () => {
        setCurrentStep(0);
        setResult(null);
        setMode(null);
        // Reset dynamic state
        setSessionId('');
        setCurrentQuestion('');
        setCurrentAnswer('');
        setCurrentOptions([]);
        setQuestionNumber(1);
        setIsCompleted(false);
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="w-full max-w-3xl mx-auto min-h-full flex flex-col py-0.5 md:py-2">

            {/* Progress Bar */}
            {currentStep === 2 && !isCompleted && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                        <span className="flex items-center gap-2">
                            {mode === 'mcq' ? (
                                <><ListChecks className="w-3 h-3" /> AI Dynamic MCQ</>
                            ) : (
                                <><PenLine className="w-3 h-3" /> AI Dynamic Descriptive</>
                            )}
                            &nbsp;· Question {questionNumber} of {totalQuestions}
                        </span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
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
                            className="relative mb-4 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                        >
                            <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center border border-white/20 relative z-10 overflow-hidden">
                                <div className="absolute inset-0 bg-white/10" />
                                <Brain className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                        </motion.div>

                        <div className="space-y-2 mb-4 relative">
                            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] uppercase tracking-[0.2em] font-black text-indigo-400 mb-1">
                                Mental Wellness AI 2.0
                            </span>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-[1]">
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
                            className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-base font-black shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all active:scale-95 flex items-center gap-3 group"
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
                        <div className="mb-6 text-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-xs font-bold uppercase tracking-widest mb-5"
                            >
                                <Zap className="w-3 h-3" /> AI-Powered Dynamic Assessment
                            </motion.div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                                Choose Your Answer Style
                            </h2>
                            <p className="text-slate-400 font-medium max-w-md mx-auto">
                                Both modes use <span className="text-blue-400 font-bold">AI to adapt questions</span> based on your answers. Pick your preferred input style.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            <ModeCard
                                icon={PenLine}
                                title="Descriptive"
                                description="Type your thoughts freely. AI adapts each question based on what you write. Best for detailed expression."
                                badge="AI DYNAMIC · TEXT"
                                gradient="from-indigo-500/15 to-violet-600/10"
                                borderColor="border-indigo-500/30 hover:border-indigo-400/60"
                                onClick={() => handleModeSelect('descriptive')}
                            />
                            <ModeCard
                                icon={ListChecks}
                                title="MCQ"
                                description="Select from options. AI adapts each question based on your choices. Quick and structured."
                                badge="AI DYNAMIC · CHOICE"
                                gradient="from-blue-500/15 to-cyan-600/10"
                                borderColor="border-blue-500/30 hover:border-blue-400/60"
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

                {/* ─── DYNAMIC QUESTION SCREEN (Both Modes) ─────────────────────────────────────── */}
                {currentStep === 2 && !isCompleted && (
                    <motion.div
                        key={`dynamic-q-${questionNumber}`}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1"
                    >
                        <div className="bg-white/[0.04] border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -mr-24 -mt-24" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                                        {questionNumber}
                                    </span>
                                    <span className="text-slate-500 text-sm font-semibold tracking-widest uppercase">
                                        Question {questionNumber} / {totalQuestions}
                                    </span>
                                    <span className={`ml-auto text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                                        mode === 'mcq' 
                                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                                    }`}>
                                        <Zap className="w-3 h-3" /> AI {mode === 'mcq' ? 'MCQ' : 'Descriptive'}
                                    </span>
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight">
                                    {currentQuestion}
                                </h2>

                                {/* MCQ Options */}
                                {mode === 'mcq' ? (
                                    <div className="space-y-3">
                                        {currentOptions.map((opt, optIdx) => {
                                            const isSelected = currentAnswer === opt;
                                            return (
                                                <motion.button
                                                    key={optIdx}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => setCurrentAnswer(opt)}
                                                    className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 font-medium text-sm ${isSelected
                                                        ? 'bg-blue-600/25 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                                                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:bg-white/[0.07]'
                                                        }`}
                                                >
                                                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-blue-400 bg-blue-500' : 'border-white/20'
                                                        }`}>
                                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                    </span>
                                                    {opt}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    /* Descriptive Textarea */
                                    <textarea
                                        value={currentAnswer}
                                        onChange={e => setCurrentAnswer(e.target.value)}
                                        rows={4}
                                        autoFocus
                                        placeholder="Share your honest thoughts here... The AI will adapt the next question based on your answer."
                                        className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/60 rounded-2xl p-5 text-white text-base placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none transition-all backdrop-blur-md"
                                    />
                                )}

                                <div className="flex justify-between items-center mt-6">
                                    <button
                                        onClick={handleBack}
                                        className="text-slate-400 hover:text-white text-sm font-semibold transition-all flex items-center gap-1 group"
                                    >
                                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        Back
                                    </button>
                                    <Button
                                        onClick={handleDynamicNext}
                                        disabled={isLoading || !currentAnswer.trim()}
                                        className={`h-12 px-8 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                            mode === 'mcq'
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-blue-600/30'
                                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/30'
                                        }`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                Next Question <ChevronRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </Button>
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
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 md:p-14 backdrop-blur-xl shadow-2xl max-w-lg w-[90%] text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
                            
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 mx-auto mb-8 relative z-10 shadow-[0_0_40px_rgba(99,102,241,0.3)]"
                            />
                            
                            <motion.h3 
                                key={loadingText} 
                                initial={{ opacity: 0, y: 5 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="text-white text-xl md:text-2xl font-black tracking-tight mb-3 relative z-10"
                            >
                                {loadingText}
                            </motion.h3>
                            
                            <p className="text-slate-400 font-medium text-sm relative z-10">
                                Based strictly on your 10 unique answers, the AI is crafting a highly personalized wellness report. Please wait...
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ─── RESULT SCREEN ─────────────────────────────────────────── */}
                {currentStep === 3 && result && (
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
                                    <div className="flex items-center justify-center md:justify-start mb-3">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            {getMoodIcon(result.mood, 'w-8 h-8')}
                                        </div>
                                    </div>
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
                                        <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-1.5 ${
                                            mode === 'mcq'
                                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                                                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                                        }`}>
                                            <Zap className="w-3.5 h-3.5" /> AI {mode === 'mcq' ? 'MCQ' : 'Descriptive'}
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

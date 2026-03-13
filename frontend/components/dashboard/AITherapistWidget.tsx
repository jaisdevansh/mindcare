'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BotMessageSquare, Send, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { aiService } from '@/lib/services/ai.service';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
    "I'm feeling overwhelmed today",
    "Help me with a breathing exercise",
    "I need some positivity",
];

export const AITherapistWidget = () => {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);

    const send = async (text?: string) => {
        const msg = text || message;
        if (!msg.trim()) return;
        setMessage('');
        setLoading(true);
        setReply('');
        try {
            const res = await aiService.chat(msg);
            if (res?.success) {
                setReply(res.data?.reply || res.data?.message || 'I\'m here for you. Tell me more.');
            } else {
                setReply('I\'m here for you. Tell me more.');
            }
        } catch {
            setReply('I\'m here for you. Tell me more.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="relative overflow-hidden bg-white/[0.03] border border-white/[0.08] rounded-[1.5rem] p-5 flex flex-col"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-[#7C5CFF]/5 pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-[40px]" />

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 relative">
                <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center">
                        <BotMessageSquare className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#080D1A] bg-emerald-400 animate-pulse" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white">AI Therapist</h3>
                    <p className="text-[10px] text-emerald-400 font-semibold">Online · Ready to listen</p>
                </div>
                <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-300 font-bold">Gemini AI</span>
                </div>
            </div>

            {/* Greeting / Reply */}
            <div className="flex-1 mb-4 relative">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="bg-white/[0.04] rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                            <span className="text-xs text-[#9DA7B3]">Thinking...</span>
                        </motion.div>
                    ) : (
                        <motion.div key={reply || 'greeting'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.04] rounded-2xl rounded-tl-sm p-3">
                            <p className="text-sm text-white leading-relaxed font-medium">
                                {reply || '"How are you feeling today? I\'m here to listen and support you on your wellness journey."'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick prompts */}
                {!reply && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {QUICK_PROMPTS.map(p => (
                            <button key={p} onClick={() => send(p)}
                                className="text-[10px] font-semibold text-[#9DA7B3] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] rounded-lg px-2.5 py-1 transition-all">
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] focus-within:border-[#7C5CFF]/40 rounded-xl px-3 py-2 transition-all relative">
                <input value={message} onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') send(); }}
                    placeholder="How are you feeling?"
                    className="flex-1 bg-transparent text-white text-xs placeholder:text-white/20 outline-none" />
                <button onClick={() => send()}
                    className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center text-white hover:opacity-90 transition-all">
                    <Send className="w-3 h-3" />
                </button>
            </div>

            {/* Full chat CTA */}
            <button onClick={() => router.push('/ai-chat')}
                className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[#7C5CFF] hover:text-[#9B7FFF] transition-colors group">
                Open full AI chat
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};

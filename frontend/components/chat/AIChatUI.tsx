"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, User, Send, Shield, ChevronDown, Mic, MicOff, Volume2, VolumeX, Languages } from 'lucide-react';
import { aiService } from '@/lib/services/ai.service';
import toast from 'react-hot-toast';

interface Message { role: 'ai' | 'user'; content: string; }

const QUICK_PROMPTS = [
    "I'm feeling really anxious today",
    "I can't stop overthinking everything",
    "I feel lonely and disconnected",
    "Work stress is overwhelming me",
    "I haven't been sleeping well",
    "I just need someone to talk to",
];

const MOOD_TAGS = [
    { label: 'Anxious',     color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    { label: 'Sad',         color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    { label: 'Stressed',    color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
    { label: 'Overwhelmed', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    { label: 'Lost',        color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
    { label: 'Hopeful',     color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
];

// ── Typing dots ───────────────────────────────────────────────────────────────
const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className="flex gap-3 max-w-[80%]"
    >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shrink-0 shadow-lg shadow-[#7C5CFF]/20">
            <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="px-5 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl rounded-tl-none flex items-center gap-2">
            {[0, 0.18, 0.36].map((delay, i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#7C5CFF]"
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.7, delay }}
                />
            ))}
        </div>
    </motion.div>
);

// ── Mic pulse ring ────────────────────────────────────────────────────────────
const MicPulse = () => (
    <span className="absolute inset-0 rounded-full">
        <motion.span
            className="absolute inset-0 rounded-full bg-rose-500/40"
            animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
        />
    </span>
);

// ── Async voice loader (Chrome returns [] on first call until voiceschanged) ──
const getVoicesAsync = (): Promise<SpeechSynthesisVoice[]> =>
    new Promise(resolve => {
        const immediate = window.speechSynthesis.getVoices();
        if (immediate.length > 0) { resolve(immediate); return; }
        const handler = () => resolve(window.speechSynthesis.getVoices());
        window.speechSynthesis.addEventListener('voiceschanged', handler, { once: true });
        // safety timeout — resolve with whatever we have after 2s
        setTimeout(() => resolve(window.speechSynthesis.getVoices()), 2000);
    });

// ── Strip emojis & special chars that break TTS ───────────────────────────────
const cleanForTTS = (text: string) =>
    text
        .replace(/[\u{1F300}-\u{1FFFF}]/gu, '') // emojis
        .replace(/[*_~`#>]/g, '')                // markdown
        .replace(/\s+/g, ' ')
        .trim();

// ── Helpers ───────────────────────────────────────────────────────────────────
const speak = async (text: string, lang: 'en' | 'hi', onEnd?: () => void) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleaned = cleanForTTS(text);
    if (!cleaned) { onEnd?.(); return; }

    // Skip Devanagari if no native Hindi voice — AI is set to send Hinglish anyway
    const hasDevnag = /[\u0900-\u097F]/.test(cleaned);

    const voices = await getVoicesAsync();

    const hiVoice = voices.find(v => v.lang.startsWith('hi-')) ||
                    voices.find(v => v.lang === 'hi') ||
                    voices.find(v => v.name.toLowerCase().includes('hindi'));

    const enVoice = voices.find(v =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('zira') ||
         v.name.toLowerCase().includes('samantha') ||
         v.name.toLowerCase().includes('google us english') ||
         v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('heera'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (hasDevnag && !hiVoice) { onEnd?.(); return; } // can't read Devanagari

    const utter = new SpeechSynthesisUtterance(cleaned);
    utter.rate   = 1.0;   // normal speed — slower caused word-by-word pauses
    utter.pitch  = 1.05;
    utter.volume = 1;

    if (lang === 'hi') {
        // Hinglish (Roman) → English voice reads it naturally
        // Devanagari → Hindi voice if available
        if (hasDevnag && hiVoice) { utter.voice = hiVoice; utter.lang = 'hi-IN'; }
        else if (enVoice)         { utter.voice = enVoice; utter.lang = 'en-IN'; }
    } else {
        if (enVoice) utter.voice = enVoice;
    }

    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
};

const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis)
        window.speechSynthesis.cancel();
};

// ── Main Component ────────────────────────────────────────────────────────────
export const AIChatUI = () => {
    const [messages, setMessages] = useState<Message[]>([{
        role: 'ai',
        content: "Hi, I'm Aria — your AI therapist from MindCare 💙\n\nThis is a safe, private space. I'm here to listen without judgment and help you work through whatever's on your mind.\n\nHow are you feeling right now? You can share as much or as little as you'd like.",
    }]);
    const [input,       setInput]       = useState('');
    const [isTyping,    setIsTyping]    = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking,  setIsSpeaking]  = useState(false);
    const [voiceOn,     setVoiceOn]     = useState(true);
    const [showScroll,  setShowScroll]  = useState(false);
    const [micLang,     setMicLang]     = useState<'en' | 'hi'>('en');

    const endRef      = useRef<HTMLDivElement>(null);
    const inputRef    = useRef<HTMLTextAreaElement>(null);
    const recognRef   = useRef<any>(null);

    // ── Load history ────────────────────────────────────────────────────────
    useEffect(() => {
        aiService.getHistory().then(r => {
            if (r.success && r.data.length > 0) setMessages(r.data);
        }).catch(() => {});
    }, []);

    // ── Auto-scroll ─────────────────────────────────────────────────────────
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // ── Voice output ─────────────────────────────────────────────────────────
    const speakMessage = useCallback(async (text: string) => {
        if (!voiceOn) return;
        setIsSpeaking(true);
        await speak(text, micLang, () => setIsSpeaking(false));
    }, [voiceOn, micLang]);

    // ── Send message ─────────────────────────────────────────────────────────
    const handleSend = useCallback(async (text?: string) => {
        const msg = (text ?? input).trim();
        if (!msg || isTyping) return;

        setMessages(prev => [...prev, { role: 'user', content: msg }]);
        setInput('');
        setIsTyping(true);
        stopSpeaking();
        setIsSpeaking(false);

        try {
            const res = await aiService.chat(msg);
            if (res.success) {
                const reply = res.data.aiResponse || res.data.reply || "I'm here. Tell me more about that.";
                setMessages(prev => [...prev, { role: 'ai', content: reply }]);
                speakMessage(reply);
            }
        } catch {
            const fallback = "I apologize — I'm having a brief connection issue. Please try again. I'm still here for you. 💙";
            setMessages(prev => [...prev, { role: 'ai', content: fallback }]);
            speakMessage(fallback);
            toast.error('Connection issue. Please try again.');
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    }, [input, isTyping, speakMessage]);

    // ── Speech recognition ────────────────────────────────────────────────────
    const toggleMic = useCallback(() => {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) { toast.error('Speech recognition not supported in this browser.'); return; }

        if (isListening) {
            recognRef.current?.stop();
            setIsListening(false);
            return;
        }

        stopSpeaking();
        setIsSpeaking(false);

        const recognition = new SR();
        recognRef.current = recognition;
        recognition.lang = micLang === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart  = () => setIsListening(true);
        recognition.onend    = () => setIsListening(false);
        recognition.onerror  = (e: any) => {
            setIsListening(false);
            if (e.error !== 'no-speech') toast.error('Mic error: ' + e.error);
        };
        recognition.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript.trim();
            if (transcript) {
                setInput('');
                handleSend(transcript);
            }
        };

        recognition.start();
    }, [isListening, handleSend]);

    const toggleVoice = () => {
        if (isSpeaking) { stopSpeaking(); setIsSpeaking(false); }
        setVoiceOn(v => !v);
    };

    const isFirst = messages.length === 1;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] relative">

            {/* ── Therapist Header ──────────────────────────────────────────── */}
            <div className="flex items-center gap-4 px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-2xl mb-3 shrink-0">
                <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shadow-lg shadow-[#7C5CFF]/25">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#080D1A]" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">Aria</span>
                        <span className="text-[10px] bg-[#7C5CFF]/15 text-[#A78BFA] border border-[#7C5CFF]/25 px-2 py-0.5 rounded-full font-bold">AI Therapist</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        {isListening ? 'Listening to you…' : isSpeaking ? 'Speaking…' : 'Online · Ready to listen'}
                    </p>
                </div>

                {/* Voice toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleVoice}
                        title={voiceOn ? 'Mute Aria' : 'Unmute Aria'}
                        className={`p-2 rounded-xl border transition-all ${voiceOn ? 'bg-[#7C5CFF]/15 border-[#7C5CFF]/30 text-[#A78BFA]' : 'bg-white/[0.04] border-white/[0.08] text-[#9DA7B3]'}`}
                    >
                        {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    {/* Language toggle */}
                    <button
                        onClick={() => setMicLang(l => l === 'en' ? 'hi' : 'en')}
                        title={`Switch to ${micLang === 'en' ? 'Hindi' : 'English'}`}
                        className="px-2.5 py-1.5 rounded-xl border bg-white/[0.04] border-white/[0.08] text-[#9DA7B3] hover:text-white hover:border-[#7C5CFF]/40 transition-all text-[11px] font-black"
                    >
                        {micLang === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'}
                    </button>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#9DA7B3]">
                        <Shield className="w-3 h-3 text-emerald-400" />
                        Private
                    </div>
                </div>
            </div>

            {/* ── Messages ──────────────────────────────────────────────────── */}
            <div
                className="flex-1 overflow-y-auto space-y-4 px-1 pb-2 scroll-smooth"
                data-lenis-prevent
                onScroll={e => {
                    const el = e.currentTarget;
                    setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
                }}
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[80%]' : 'max-w-[82%]'}`}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                                msg.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-500/20'
                                    : 'bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] shadow-[#7C5CFF]/20'
                            }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Brain className="w-4 h-4 text-white" />}
                            </div>
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-500/25 to-violet-500/15 border border-indigo-500/30 text-white rounded-tr-none'
                                    : 'bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-tl-none'
                            }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && <TypingIndicator key="typing" />}
                </AnimatePresence>

                {/* Quick prompts — first message only */}
                {isFirst && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2">
                        <p className="text-[10px] text-[#9DA7B3] uppercase tracking-widest font-bold mb-2 px-1">Quick start</p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_PROMPTS.map((p, i) => (
                                <button key={i} onClick={() => handleSend(p)} className="text-xs px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-[#7C5CFF]/40 hover:bg-[#7C5CFF]/10 text-slate-300 hover:text-white rounded-full transition-all">
                                    {p}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-[#9DA7B3] uppercase tracking-widest font-bold mb-2 px-1 mt-4">How are you feeling?</p>
                        <div className="flex flex-wrap gap-2">
                            {MOOD_TAGS.map((m, i) => (
                                <button key={i} onClick={() => handleSend(`I'm feeling ${m.label.toLowerCase()}`)} className={`text-xs px-3 py-1.5 border rounded-full transition-all hover:scale-105 ${m.color}`}>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div ref={endRef} />
            </div>

            {/* Scroll to bottom */}
            <AnimatePresence>
                {showScroll && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="absolute bottom-20 right-4 w-8 h-8 rounded-full bg-[#7C5CFF] shadow-lg flex items-center justify-center z-10"
                    >
                        <ChevronDown className="w-4 h-4 text-white" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* ── Input bar ─────────────────────────────────────────────────── */}
            <div className="shrink-0 pt-3 border-t border-white/[0.06]">
                <div className="relative flex items-end gap-2 bg-white/[0.03] border border-white/[0.08] focus-within:border-[#7C5CFF]/50 rounded-2xl p-3 transition-all">

                    {/* Mic button */}
                    <div className="relative shrink-0">
                        {isListening && <MicPulse />}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.93 }}
                            onClick={toggleMic}
                            title={isListening ? 'Stop listening' : 'Speak to Aria'}
                            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all border z-10 ${
                                isListening
                                    ? 'bg-rose-500 border-rose-400 shadow-lg shadow-rose-500/30 text-white'
                                    : 'bg-white/[0.06] border-white/[0.1] text-[#9DA7B3] hover:text-white hover:bg-white/[0.1]'
                            }`}
                        >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </motion.button>
                    </div>

                    {/* Text input */}
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => {
                            setInput(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        placeholder={isListening
                            ? (micLang === 'hi' ? '🎙️ सुन रही हूँ… बोलिए' : '🎙️ Listening… speak now')
                            : (micLang === 'hi' ? 'हिंदी में लिखें या माइक से बोलें…' : 'Type or use the mic to talk to Aria…')
                        }
                        rows={1}
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-white/20 focus:outline-none resize-none leading-relaxed max-h-[120px] overflow-y-auto"
                        style={{ height: '24px' }}
                        disabled={isListening}
                    />

                    {/* Send */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isTyping || isListening}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-[#7C5CFF]/20 transition-all"
                    >
                        <Send className="w-4 h-4 text-white ml-0.5" />
                    </motion.button>
                </div>

                {/* Status + disclaimer */}
                <div className="flex items-center justify-between mt-2 px-1">
                    <span className="text-[10px] text-[#9DA7B3]/50">
                        {isListening
                            ? <span className="text-rose-400 font-bold animate-pulse">🎙️ Listening…</span>
                            : isSpeaking
                                ? <span className="text-[#A78BFA] font-bold">🔊 Aria is speaking…</span>
                                : <span>Press mic or type · Enter to send</span>
                        }
                    </span>
                    <span className="text-[10px] text-[#9DA7B3]/40">
                        Crisis? <span className="text-rose-400">iCall: 9152987821</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

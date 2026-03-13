'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Send, StopCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export const HelperChatUI = ({ helperName, avatar }: { helperName?: string, avatar?: string }) => {
    const [messages, setMessages] = useState([
        { role: 'helper', content: `Hi there, I'm ${helperName || 'your helper'}. How can I support you today?` }
    ]);
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || timeLeft === 0) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');
        setIsTyping(true);

        // Simulate helper response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'helper', content: "That must have been difficult. Do you want to talk more about what happened?" }]);
        }, 3000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] bg-black/20 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative">
            <div className="h-16 bg-white/5 border-b border-white/10 flex items-center justify-between px-6 shrink-0 relative z-20">
                <div className="flex items-center gap-3">
                    <img src={avatar || '/images/avatar.png'} alt={helperName} className="w-8 h-8 rounded-full border border-indigo-500/50" />
                    <span className="font-semibold text-white">{helperName || 'Helper Session'}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                        <Clock className="w-4 h-4 text-indigo-400" />
                        <span className={`font-mono text-sm font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-indigo-300'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <Button variant="destructive" size="sm" className="hidden sm:flex" onClick={() => toast.success('Session End Requested')}>
                        End Session
                    </Button>
                </div>
            </div>

            <div className="absolute inset-x-0 top-16 h-8 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />

            <div
                className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-transparent/50 pt-8"
                data-lenis-prevent
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                        >
                            <div
                                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-lg overflow-hidden border ${msg.role === 'user'
                                    ? 'border-indigo-400/30 bg-indigo-600'
                                    : 'border-indigo-500/50'
                                    }`}
                            >
                                {msg.role === 'user' ? (
                                    <User className="w-5 h-5 text-white" />
                                ) : (
                                    <img src={avatar || '/images/avatar.png'} alt={helperName} className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div
                                className={`p-4 rounded-2xl relative shadow-xl backdrop-blur-md text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-indigo-500/20 border border-indigo-500/30 text-white rounded-tr-none'
                                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex gap-3 max-w-[85%]"
                        >
                            <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden border border-indigo-500/50 shadow-lg">
                                <img src={avatar || '/images/avatar.png'} alt={helperName} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 rounded-tl-none flex gap-1 items-center h-12">
                                <motion.div className="w-2 h-2 rounded-full bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                <motion.div className="w-2 h-2 rounded-full bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                <motion.div className="w-2 h-2 rounded-full bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={endRef} />
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-xl relative z-20">
                <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={timeLeft === 0}
                        placeholder={timeLeft === 0 ? "Session ended." : "Type your message..."}
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner disabled:opacity-50"
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || timeLeft === 0}
                        className="absolute right-1 w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center disabled:opacity-50 disabled:bg-slate-700 transition"
                    >
                        <Send className="w-4 h-4 text-white ml-0.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

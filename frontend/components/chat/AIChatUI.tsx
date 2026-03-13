"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { aiService } from '@/lib/services/ai.service';
import toast from 'react-hot-toast';

export const AIChatUI = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello there. I'm your AI Listener built into MindCare Connect. I'm here to provide a safe, non-judgmental space for you to talk. How are you feeling right now?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await aiService.getHistory();
                if (response.success && response.data.length > 0) {
                    setMessages(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        };
        fetchHistory();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await aiService.chat(userMessage);
            if (response.success) {
                const reply = response.data.aiResponse || response.data.reply || "I'm listening. Tell me more.";
                setMessages(prev => [...prev, { role: 'ai', content: reply }]);
            }
        } catch (error: any) {
            toast.error(error.message || "AI failed to respond. Please try again.");
            setMessages(prev => [...prev, { role: 'ai', content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };


    return (
        <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] bg-black/20 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md relative">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />

            <div
                className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
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
                                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-lg ${msg.role === 'user'
                                    ? 'bg-indigo-600 border border-indigo-400/30'
                                    : 'bg-emerald-600 border border-emerald-400/30'
                                    }`}
                            >
                                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
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
                            <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-600 border border-emerald-400/30 flex items-center justify-center shadow-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 rounded-tl-none flex gap-1.5 items-center h-12 px-6">
                                <motion.div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                <motion.div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                <motion.div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={endRef} />
            </div>

            <div className="p-4 bg-black/40 border-t border-white/5 backdrop-blur-xl">
                <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-1 w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center disabled:opacity-50 disabled:bg-slate-700 transition"
                    >
                        <Send className="w-4 h-4 text-white ml-0.5" />
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-500">AI responses are not professional medical advice. For emergencies, please call your local authorities.</span>
                </div>
            </div>
        </div>
    );
};

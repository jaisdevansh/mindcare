"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MessageSquare, Send, Inbox, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

const faqs = [
    { q: "Is my identity anonymous in the community?", a: "Yes. In our community and helper sessions, you are entirely anonymous and identifiable only by a self-chosen mood tag." },
    { q: "What is the training for verified helpers?", a: "Every helper undergoes a comprehensive empathy compliance training and identity verification before being listed." },
    { q: "How does the AI track my wellness?", a: "Our AI processes the sentiment of your conversations to visualize trends and emotional insights over time securely." },
    { q: "How does payment work for helper sessions?", a: "Chat sessions cost ₹10 and voice calls cost ₹30 per 30 minutes. All payments are securely processed via Razorpay." },
    { q: "Can I get a refund?", a: "If your session fails to connect due to a technical issue, we'll refund the full amount within 3–5 business days." },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-white/[0.08] rounded-2xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-all"
            >
                <span className="text-sm font-semibold text-white pr-4">{q}</span>
                {open ? <ChevronUp className="w-4 h-4 text-[#7C5CFF] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#9DA7B3] shrink-0" />}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-4 text-sm text-[#9DA7B3] leading-relaxed border-t border-white/[0.06] pt-3">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [form, setForm] = useState({ name: "", email: "", reason: "general", message: "" });

    const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill all fields");
            return;
        }
        setLoading(true);
        try {
            const res = await apiFetch("/contact", {
                method: "POST",
                body: JSON.stringify(form),
            });
            if (res.success) {
                setSent(true);
                toast.success(res.message || "Message sent!");
                formRef.current?.reset();
                setForm({ name: "", email: "", reason: "general", message: "" });
            } else {
                toast.error(res.message || "Failed to send");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#7C5CFF]/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/20 transition-all";

    return (
        <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center relative overflow-hidden">

            {/* Header */}
            <div className="text-center max-w-3xl mb-20 z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                >
                    We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#6A8DFF]">Listening</span>
                </motion.h1>
                <p className="text-lg text-[#9DA7B3] leading-relaxed">
                    Questions, feedback, or need support? Our team replies within 2 hours.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-14 items-start w-full relative z-10 mb-20">

                {/* Contact Info */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest mb-6">Direct Support</p>
                    {[
                        { icon: Mail, title: "Support Email", info: "mindcare65@gmail.com", sub: "Avg. reply: 2 hours" },
                        { icon: Phone, title: "Emergency Helpline", info: "iCall: 9152987821", sub: "Mon–Sat, 8AM–10PM" },
                        { icon: MessageSquare, title: "Community", info: "@mindcare_wellness", sub: "Active on Twitter / X" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl flex items-center gap-5 hover:border-[#7C5CFF]/30 hover:bg-white/[0.05] transition-all"
                        >
                            <div className="w-11 h-11 rounded-xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 flex items-center justify-center shrink-0">
                                <item.icon className="w-5 h-5 text-[#7C5CFF]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#7C5CFF] uppercase tracking-widest">{item.title}</p>
                                <p className="text-base font-bold text-white mt-0.5">{item.info}</p>
                                <p className="text-xs text-[#9DA7B3] mt-0.5">{item.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.02] border border-white/[0.08] p-8 rounded-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C5CFF]/8 blur-[80px] rounded-full pointer-events-none" />

                    <AnimatePresence mode="wait">
                        {sent ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-12 text-center gap-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black text-white">Message Sent!</h3>
                                <p className="text-sm text-[#9DA7B3]">We'll reply to your email within 2 hours. Check your inbox for a confirmation.</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-2 text-xs font-bold text-[#7C5CFF] hover:underline"
                                >
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="space-y-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Inbox className="w-5 h-5 text-[#7C5CFF]" />
                                    <h3 className="text-lg font-black text-white">Send a Message</h3>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest">Your Name *</label>
                                        <input className={inputCls} placeholder="John Doe" value={form.name} onChange={e => update("name", e.target.value)} required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest">Email *</label>
                                        <input type="email" className={inputCls} placeholder="john@example.com" value={form.email} onChange={e => update("email", e.target.value)} required />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest">Reason</label>
                                    <select className={inputCls} value={form.reason} onChange={e => update("reason", e.target.value)}>
                                        <option value="general" className="bg-[#0B0F2A]">General Inquiry</option>
                                        <option value="support" className="bg-[#0B0F2A]">Technical Support</option>
                                        <option value="payment" className="bg-[#0B0F2A]">Payment / Refund</option>
                                        <option value="helper" className="bg-[#0B0F2A]">Becoming a Helper</option>
                                        <option value="press" className="bg-[#0B0F2A]">Press & Media</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-[#9DA7B3] uppercase tracking-widest">Message *</label>
                                    <textarea
                                        className={`${inputCls} resize-none`}
                                        rows={5}
                                        placeholder="How can we help your journey?"
                                        value={form.message}
                                        onChange={e => update("message", e.target.value)}
                                        required
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#7C5CFF]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                    {loading ? "Sending…" : "Send Message"}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* FAQ */}
            <div className="w-full max-w-2xl">
                <h3 className="text-2xl font-black text-white mb-8 text-center">Frequently Asked Questions</h3>
                <div className="space-y-3">
                    {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, ChevronLeft, Brain, Sparkles } from "lucide-react";
import { authService } from "@/lib/services/auth.service";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const response = await authService.forgotPassword(email);
            if (response.success) {
                setStatus("success");
                setMessage("Password reset link sent! Check your inbox.");
            } else {
                setStatus("error");
                setMessage(response.message || "Failed to send reset link.");
            }
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-transparent">

            {/* Back to Login */}
            <Link
                href="/login"
                className="fixed top-8 left-8 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-[#9DA7B3] hover:text-white hover:bg-white/[0.08] transition-all group text-[13px] shadow-xl"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
            </Link>

            <div className="w-full max-w-[440px] relative z-10">
                <AnimatePresence mode="wait">

                    {/* ─── FORM STATE ─── */}
                    {status !== "success" && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.5 }}
                            className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl"
                        >
                            {/* Icon */}
                            <div className="mb-8 text-center">
                                <div className="relative w-16 h-16 mx-auto mb-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shadow-lg shadow-[#7C5CFF]/30">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    {/* Sparkle orbit */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                                        className="absolute -inset-2 rounded-3xl border border-dashed border-[#7C5CFF]/20"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                                        className="absolute -inset-4 rounded-full border border-dashed border-[#5B6CFF]/10"
                                    />
                                </div>

                                <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Forgot Password?</h1>
                                <p className="text-[#9DA7B3] text-sm font-light">
                                    No worries — we'll send reset instructions to your email.
                                </p>
                            </div>

                            {/* Error Alert */}
                            <AnimatePresence>
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mb-5 overflow-hidden"
                                    >
                                        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <p className="text-xs font-medium">{message}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-[#9DA7B3] ml-1">Email Address</label>
                                    <div className="relative flex items-center group">
                                        <Mail className="w-4 h-4 absolute left-4 text-[#9DA7B3] group-focus-within:text-[#7C5CFF] transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={status === "loading"}
                                            className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF]/50 transition-all placeholder:text-white/20 disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={status === "loading"}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full h-11 mt-2 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <p className="mt-8 text-center text-xs text-[#9DA7B3]">
                                Remembered it?{" "}
                                <Link href="/login" className="text-[#7C5CFF] font-bold hover:text-[#9B7FFF] transition-colors">
                                    Sign in instead
                                </Link>
                            </p>
                        </motion.div>
                    )}

                    {/* ─── SUCCESS STATE ─── */}
                    {status === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                            className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl text-center"
                        >
                            {/* Animated checkmark */}
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                                </motion.div>
                                {/* Ripple rings */}
                                {[1, 2, 3].map((ring) => (
                                    <motion.div
                                        key={ring}
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 1 + ring * 0.4, opacity: 0 }}
                                        transition={{ delay: 0.3 + ring * 0.15, duration: 1.2, ease: "easeOut" }}
                                        className="absolute inset-0 rounded-full border border-emerald-500/30"
                                    />
                                ))}
                            </div>

                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Check your inbox!</h2>
                                <p className="text-[#9DA7B3] text-sm font-light leading-relaxed mb-2">
                                    We've sent a password reset link to
                                </p>
                                <p className="text-[#7C5CFF] font-bold text-sm mb-6">{email}</p>
                                <p className="text-xs text-slate-600 mb-8">
                                    Didn't receive it? Check your spam folder or try again.
                                </p>
                            </motion.div>

                            <div className="flex flex-col gap-3">
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    onClick={() => { setStatus("idle"); setEmail(""); }}
                                    className="w-full h-11 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 transition-all hover:opacity-90 active:scale-[0.98]"
                                >
                                    Send Again
                                </motion.button>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                                    <Link
                                        href="/login"
                                        className="block w-full h-11 bg-white/[0.05] border border-white/10 text-white rounded-xl text-sm font-bold transition-all hover:bg-white/[0.08] flex items-center justify-center"
                                    >
                                        Back to Login
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

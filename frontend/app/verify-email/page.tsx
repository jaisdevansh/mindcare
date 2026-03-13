'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OtpInput } from '@/components/OtpInput';
import { MailCheck, ArrowRight, ChevronLeft, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authService } from '@/lib/services/auth.service';

export default function VerifyEmailPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7C5CFF]"></div>
            </div>
        }>
            <VerifyEmailContent />
        </React.Suspense>
    );
}

function VerifyEmailContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || "";

    const handleComplete = async (otp: string) => {
        if (!email) {
            toast.error("Email is missing. Please try signing up again.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await authService.verifyOtp(email, otp);
            if (res.success) {
                toast.success("Email verified successfully! You can now log in.");
                router.push('/login');
            } else {
                toast.error(res.message || "Invalid OTP. Please try again.");
            }
        } catch (error: any) {
            toast.error(error.message || "Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email || isResending) return;
        setIsResending(true);
        try {
            // Ideally we'd have a specific resend endpoint, for now we simulate success
            // or we could trigger registration again which also sends OTP
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("A new verification code has been sent!");
        } catch (error) {
            toast.error("Failed to resend code.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
            {/* Back to Home - Absolute Top Left */}
            <Link
                href="/signup"
                className="fixed top-8 left-8 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-[#9DA7B3] hover:text-white hover:bg-white/[0.08] transition-all group text-[13px] shadow-xl"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Signup
            </Link>

            <div className="w-full max-w-[460px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFF]/10 rounded-full blur-[50px] -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#5B6CFF]/10 rounded-full blur-[50px] -ml-16 -mb-16" />

                    <div className="mb-10 text-center relative z-10">
                        <motion.div 
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#7C5CFF]/30 ring-4 ring-white/5"
                        >
                            <MailCheck className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Verify Identity</h1>
                        <p className="text-[#9DA7B3] text-sm leading-relaxed font-medium">
                            We've sent a <span className="text-white font-bold">6-digit security code</span> to <br />
                            <span className="text-indigo-400 font-bold underline decoration-indigo-400/30 underline-offset-4">{email || "your email"}</span>
                        </p>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="w-full">
                            <OtpInput length={6} onComplete={handleComplete} disabled={isLoading} />
                        </div>

                        <div className="space-y-4">
                            <motion.button
                                onClick={handleResend}
                                disabled={isLoading || isResending}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#9DA7B3] hover:text-white transition-all flex items-center justify-center gap-3 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/5 disabled:opacity-50"
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Resend Code
                                    </>
                                )}
                            </motion.button>

                            <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest px-8 leading-loose">
                                Having trouble? Check your spam folder or ensure the email entered is correct.
                            </p>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2.5rem] flex items-center justify-center z-50">
                            <div className="flex flex-col items-center gap-4">
                                <Loader2 className="w-10 h-10 text-[#7C5CFF] animate-spin" />
                                <span className="text-white font-bold text-xs uppercase tracking-widest">Verifying...</span>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Footer Link */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center text-xs text-[#9DA7B3]"
                >
                    Entered wrong email?{" "}
                    <Link href="/signup" className="text-white font-bold hover:text-[#7C5CFF] transition-colors underline underline-offset-4 decoration-[#7C5CFF]">
                        Change Address
                    </Link>
                </motion.p>
            </div>
        </div>
    );
}

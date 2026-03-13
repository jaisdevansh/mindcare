"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Brain, ArrowRight, Github, Chrome, Mail, Lock, ChevronLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "@/lib/services/auth.service";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser } = useAppStore();

    useEffect(() => {
        const token = searchParams.get('token');
        const userStr = searchParams.get('user');
        const error = searchParams.get('error');

        if (error) {
            toast.error("Authentication failed. Please try again.");
            router.replace('/login');
        } else if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                toast.success("Welcome to MindCare!");
                router.push("/dashboard");
            } catch (err) {
                toast.error("An error occurred during social login.");
            }
        }
    }, [searchParams, router, setUser]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            if (response.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setUser(response.data.user);
                toast.success("Login successful!");
                // Redirect based on role
                const role = response.data.user?.role;
                if (role === 'admin') router.push('/admin');
                else if (role === 'helper') router.push('/helper/dashboard');
                else router.push('/dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: 'google' | 'github') => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/auth/${provider}`;
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
            {/* Back to Home - Absolute Top Left */}
            <Link
                href="/"
                className="fixed top-8 left-8 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-[#9DA7B3] hover:text-white hover:bg-white/[0.08] transition-all group text-[13px] shadow-xl"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>

            <div className="w-full max-w-[440px] relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl"
                >
                    <div className="mb-8 text-center">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7C5CFF]/20">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Welcome Back</h1>
                        <p className="text-[#9DA7B3] text-sm font-light">Continue your journey to mental wellness.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
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
                                    className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF]/50 transition-all placeholder:text-white/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-medium text-[#9DA7B3]">Password</label>
                                <Link href="/forgot-password" title="Go to Forgot Password Page" className="text-xs text-[#7C5CFF] hover:underline font-medium">Forgot?</Link>
                            </div>
                            <div className="relative flex items-center group">
                                <Lock className="w-4 h-4 absolute left-4 text-[#9DA7B3] group-focus-within:text-[#7C5CFF] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-11 bg-white/[0.05] border border-white/10 rounded-xl px-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF]/50 transition-all placeholder:text-white/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-[#9DA7B3] hover:text-[#7C5CFF] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full h-11 mt-4 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                            {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                        </motion.button>
                    </form>

                    <div className="mt-6 mb-6 flex items-center gap-4">
                        <div className="h-[1px] bg-white/5 flex-1" />
                        <span className="text-[10px] text-[#9DA7B3] font-medium uppercase tracking-widest">or</span>
                        <div className="h-[1px] bg-white/5 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="h-11 flex items-center justify-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] font-medium hover:bg-white/[0.1] transition-all"
                        >
                            <Chrome className="w-4 h-4" />
                            Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin('github')}
                            className="h-11 flex items-center justify-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[13px] font-medium hover:bg-white/[0.1] transition-all"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-[#9DA7B3]">
                        New to MindCare?{" "}
                        <Link href="/signup" className="text-white font-bold hover:text-[#7C5CFF] transition-colors underline underline-offset-4 decoration-[#7C5CFF]">
                            Create Account
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}


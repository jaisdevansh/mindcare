"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, ArrowRight, Github, Chrome, Mail, Lock, User, ChevronLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { authService } from "@/lib/services/auth.service";
import { useAppStore } from "@/lib/store";

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<"user" | "helper">("user");
    const router = useRouter();
    const { setUser } = useAppStore();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authService.signup({ name, email, password, role });
            if (response.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setUser(response.data.user);
                toast.success("Account created successfully!");
                router.push("/dashboard");
            }
        } catch (error: any) {
            toast.error(error.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
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
                    className="w-full bg-white/[0.03] border border-white/10 p-5 md:p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl"
                >
                    <div className="mb-6 text-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#7C5CFF]/20">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Create Account</h1>
                        <p className="text-[#9DA7B3] text-sm font-light">Start your wellness journey today.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-[#9DA7B3] ml-1 uppercase">Full Name</label>
                                <div className="relative flex items-center group">
                                    <User className="w-3.5 h-3.5 absolute left-3 text-[#9DA7B3]" />
                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full h-10 bg-white/[0.05] border border-white/10 rounded-lg px-9 text-white text-xs focus:ring-1 focus:ring-[#7C5CFF] transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-medium text-[#9DA7B3] ml-1 uppercase">Email</label>
                                <div className="relative flex items-center group">
                                    <Mail className="w-3.5 h-3.5 absolute left-3 text-[#9DA7B3]" />
                                    <input
                                        type="email"
                                        placeholder="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full h-10 bg-white/[0.05] border border-white/10 rounded-lg px-9 text-white text-xs focus:ring-1 focus:ring-[#7C5CFF] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-medium text-[#9DA7B3] ml-1 uppercase">Join As</label>
                            <div className="flex gap-2 p-1 bg-white/[0.05] border border-white/10 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setRole("user")}
                                    className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${role === "user" ? "bg-[#7C5CFF] text-white shadow-lg" : "text-[#9DA7B3] hover:text-white"}`}
                                >
                                    User / Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("helper")}
                                    className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${role === "helper" ? "bg-[#7C5CFF] text-white shadow-lg" : "text-[#9DA7B3] hover:text-white"}`}
                                >
                                    Wellness Helper
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-medium text-[#9DA7B3] ml-1 uppercase">Choose Password</label>
                            <div className="relative flex items-center group">
                                <Lock className="w-3.5 h-3.5 absolute left-3 text-[#9DA7B3]" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-10 bg-white/[0.05] border border-white/10 rounded-xl px-9 text-white text-xs focus:ring-1 focus:ring-[#7C5CFF] transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-[#9DA7B3] hover:text-[#7C5CFF] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                            <input type="checkbox" required className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#7C5CFF]" />
                            <label className="text-[10px] text-[#9DA7B3] font-light">I agree to the <Link href="#" className="underline">Terms</Link> and <Link href="#" className="underline">Privacy</Link></label>
                        </div>

                        <motion.button
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full h-11 mt-2 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#7C5CFF]/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? "Creating..." : "Create Account"}
                            {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                        </motion.button>
                    </form>

                    <div className="mt-5 mb-5 flex items-center gap-4">
                        <div className="h-[1px] bg-white/5 flex-1" />
                        <span className="text-[10px] text-[#9DA7B3] font-medium uppercase tracking-widest">or</span>
                        <div className="h-[1px] bg-white/5 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="h-10 flex items-center justify-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[11px] font-medium hover:bg-white/[0.1] transition-all outline-none">
                            <Chrome className="w-3.5 h-3.5" />
                            Google
                        </button>
                        <button className="h-10 flex items-center justify-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl text-white text-[11px] font-medium hover:bg-white/[0.1] transition-all outline-none">
                            <Github className="w-3.5 h-3.5" />
                            GitHub
                        </button>
                    </div>

                    <p className="mt-6 text-center text-xs text-[#9DA7B3]">
                        Already registered?{" "}
                        <Link href="/login" className="text-white font-bold hover:text-[#7C5CFF] transition-colors underline underline-offset-4 decoration-[#7C5CFF]">
                            Log In Securely
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}


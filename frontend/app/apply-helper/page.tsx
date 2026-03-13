"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight, ShieldCheck, Mail, User, ChevronLeft, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function ApplyHelperPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        age: '',
        experience: '',
        reason: ''
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            toast.success("Application submitted successfully!");
        }, 2000);
    };

    const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (success) {
        return (
            <div className="min-h-[80vh] w-full flex items-center justify-center p-4 relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl text-center"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Application Received</h2>
                    <p className="text-[#9DA7B3] font-light leading-relaxed mb-10">
                        Thank you for wanting to make a difference. Our team will review your application and contact you within 48 hours for the next steps in empathy training.
                    </p>
                    <Link href="/">
                        <button className="h-12 w-full bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold transition-all border border-white/10">
                            Return Home
                        </button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4 relative z-10 w-full pt-10">
            {/* Back Button */}
            <Link
                href="/talk-to-helper"
                className="fixed top-24 left-8 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md text-[#9DA7B3] hover:text-white hover:bg-white/[0.08] transition-all group text-[13px] shadow-xl"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
            </Link>

            <div className="w-full max-w-[500px]">
                {/* Progress Indicator */}
                <div className="flex gap-2 mb-8 justify-center">
                    <div className="h-1.5 w-12 rounded-full bg-[#7C5CFF]" />
                    <div className={`h-1.5 w-12 rounded-full transition-colors duration-500 ${step === 2 ? 'bg-[#7C5CFF]' : 'bg-white/10'}`} />
                </div>

                <motion.div
                    className="w-full bg-white/[0.03] border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden"
                >
                    {/* decorative glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFF]/10 rounded-full blur-[80px]" />

                    <div className="mb-8 text-center relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7C5CFF]/20">
                            <Heart className="w-6 h-6 text-white fill-white/20" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Become a Helper</h1>
                        <p className="text-[#9DA7B3] text-sm font-light">Join our community of empathetic listeners.</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleNext}
                                className="space-y-4 relative z-10"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Legal Name</label>
                                    <div className="relative flex items-center group">
                                        <User className="w-4 h-4 absolute left-4 text-[#9DA7B3] group-focus-within:text-[#7C5CFF]" />
                                        <input
                                            name="fullName" value={formData.fullName} onChange={updateForm}
                                            type="text" placeholder="Jane Doe" required
                                            className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-12 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative flex items-center group">
                                        <Mail className="w-4 h-4 absolute left-4 text-[#9DA7B3] group-focus-within:text-[#7C5CFF]" />
                                        <input
                                            name="email" value={formData.email} onChange={updateForm}
                                            type="email" placeholder="jane@example.com" required
                                            className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-12 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Age</label>
                                    <input
                                        name="age" value={formData.age} onChange={updateForm}
                                        type="number" min="18" placeholder="Must be 18+" required
                                        className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all"
                                    />
                                    <p className="text-[10px] text-[#9DA7B3] ml-1 mt-1">You must be legal age to become a verified helper.</p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-12 mt-6 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group"
                                >
                                    Next Step
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSubmit}
                                className="space-y-4 relative z-10"
                            >
                                <button type="button" onClick={() => setStep(1)} className="text-[11px] text-[#7C5CFF] hover:text-white flex items-center gap-1 mb-4 transition-colors">
                                    <ChevronLeft className="w-3 h-3" /> Go Back
                                </button>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Do you have prior counseling experience?</label>
                                    <select
                                        name="experience" required value={formData.experience} onChange={updateForm as any}
                                        className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled className="bg-[#0B0F2A]">Select an option</option>
                                        <option value="none" className="bg-[#0B0F2A]">No, but I am extremely empathetic</option>
                                        <option value="volunteer" className="bg-[#0B0F2A]">Yes, as a volunteer</option>
                                        <option value="professional" className="bg-[#0B0F2A]">Yes, I am a professional</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Why do you want to join MindCare?</label>
                                    <div className="relative group">
                                        <FileText className="w-4 h-4 absolute left-4 top-4 text-[#9DA7B3] group-focus-within:text-[#7C5CFF]" />
                                        <textarea
                                            name="reason" required value={formData.reason} onChange={updateForm}
                                            rows={4} placeholder="I want to help because..."
                                            className="w-full bg-white/[0.05] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex gap-3 mt-4">
                                    <ShieldCheck className="w-5 h-5 text-[#7C5CFF] shrink-0" />
                                    <p className="text-[11px] text-[#9DA7B3] leading-relaxed">
                                        By applying, you agree to undergo our mandatory background verification and 4-hour empathy compliance course. MindCare enforces a zero-tolerance policy for judgment or harassment.
                                    </p>
                                </div>

                                <motion.button
                                    disabled={loading}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full h-12 mt-6 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-[15px] font-bold shadow-lg shadow-[#7C5CFF]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {loading ? "Submitting Application..." : "Submit Application"}
                                    {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

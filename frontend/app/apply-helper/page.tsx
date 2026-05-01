"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight, ShieldCheck, Mail, User, ChevronLeft, CheckCircle2, ChevronRight, FileText, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

export default function ApplyHelperPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        phone: '',
        bio: '',
        motivation: '',
        experience: '',
        specializations: '',
        availability: '',
        hasTraining: false,
        trainingDetails: ''
    });

    const [myApplication, setMyApplication] = useState<any>(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    React.useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await apiFetch('/helpers/my-application');
                if (res.success) setMyApplication(res.data);
            } catch {}
            setCheckingStatus(false);
        };
        fetchStatus();
    }, []);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiFetch('/helpers/apply', {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
                }),
            });
            if (res.success) {
                setSuccess(true);
                toast.success("Application submitted successfully!");
            } else {
                toast.error(res.message || "Failed to submit application");
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
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
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Phone Number</label>
                                    <div className="relative flex items-center group">
                                        <Phone className="w-4 h-4 absolute left-4 text-[#9DA7B3] group-focus-within:text-[#7C5CFF]" />
                                        <input
                                            name="phone" value={formData.phone} onChange={updateForm}
                                            type="text" placeholder="+91 98765 43210" required
                                            className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-12 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Short Bio</label>
                                    <input
                                        name="bio" value={formData.bio} onChange={updateForm}
                                        type="text" placeholder="Tell us about yourself briefly" required
                                        className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Motivation</label>
                                    <textarea
                                        name="motivation" value={formData.motivation} onChange={updateForm}
                                        placeholder="Why do you want to help others?" required
                                        rows={3}
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all resize-none"
                                    />
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
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Relevant Experience</label>
                                    <textarea
                                        name="experience" required value={formData.experience} onChange={updateForm}
                                        rows={3} placeholder="Tell us about your background in support or counseling..."
                                        className="w-full bg-white/[0.05] border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Specializations (comma separated)</label>
                                    <input
                                        name="specializations" value={formData.specializations} onChange={updateForm}
                                        type="text" placeholder="e.g. Anxiety, Career, Relationships" required
                                        className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-medium text-[#9DA7B3] uppercase tracking-wider ml-1">Availability</label>
                                    <input
                                        name="availability" value={formData.availability} onChange={updateForm}
                                        type="text" placeholder="e.g. Weekends, Evenings (6-9 PM)" required
                                        className="w-full h-12 bg-white/[0.05] border border-white/10 rounded-xl px-4 text-white text-sm focus:ring-2 focus:ring-[#7C5CFF]/50 focus:border-[#7C5CFF] outline-none transition-all"
                                    />
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

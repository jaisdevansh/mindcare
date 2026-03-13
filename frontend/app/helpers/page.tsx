'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
    Users, Star, MessageCircle, Heart, X, ChevronRight, CheckCircle2,
    Clock, XCircle, Loader2, BadgeCheck, Search, Shield, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Helper { _id: string; name: string; bio: string; skills: string[]; rating: number; verified: boolean; }
interface ApplicationForm {
    phone: string; bio: string; motivation: string; experience: string;
    specializations: string; availability: string; hasTraining: boolean; trainingDetails: string;
}
interface MyApplication { status: 'pending' | 'approved' | 'rejected'; adminNote?: string; createdAt: string; }

const STATUS_CONFIG = {
    pending: { icon: Clock, label: 'Under Review', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    approved: { icon: CheckCircle2, label: 'Approved 🎉', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    rejected: { icon: XCircle, label: 'Not Approved', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
};

// ─── HELPER CARD ──────────────────────────────────────────────────────────────

const HelperCard = ({ helper, index }: { helper: Helper; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.07 }}
        className="bg-white/[0.03] border border-white/[0.08] hover:border-[#7C5CFF]/40 rounded-[1.5rem] p-5 flex flex-col items-center text-center gap-4 transition-all group hover:bg-white/[0.05]"
    >
        {/* Avatar */}
        <div className="relative mt-1">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C5CFF]/30 to-[#5B6CFF]/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-8 h-8 text-[#7C5CFF]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#080D1A] bg-emerald-400" />
        </div>

        {/* Info */}
        <div className="space-y-1.5 w-full">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                {helper.verified && <BadgeCheck className="w-4 h-4 text-[#7C5CFF] shrink-0" />}
                {helper.name}
            </h3>
            <p className="text-xs text-[#9DA7B3] line-clamp-2 leading-relaxed">{helper.bio || 'Verified MindCare Helper'}</p>
            {helper.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center pt-1">
                    {helper.skills.slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] bg-[#7C5CFF]/10 text-[#A78BFA] border border-[#7C5CFF]/20 px-2 py-0.5 rounded-full font-medium">
                            {s}
                        </span>
                    ))}
                </div>
            )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="text-sm font-bold text-white">{helper.rating?.toFixed(1) || '5.0'}</span>
        </div>

        {/* Action */}
        <button className="w-full h-9 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-[#7C5CFF]/20 hover:opacity-90 transition-all active:scale-[0.98]">
            <MessageCircle className="w-3.5 h-3.5" /> Start Chat
        </button>
    </motion.div>
);

// ─── APPLY MODAL ──────────────────────────────────────────────────────────────

const ApplyModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: (app: MyApplication) => void }) => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<ApplicationForm>({
        phone: '', bio: '', motivation: '', experience: '',
        specializations: '', availability: '', hasTraining: false, trainingDetails: '',
    });

    const update = (field: keyof ApplicationForm, value: any) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await apiFetch('/helpers/apply', {
                method: 'POST',
                body: JSON.stringify({
                    ...form,
                    specializations: form.specializations.split(',').map(s => s.trim()).filter(Boolean),
                }),
            });
            if (res.success) {
                toast.success("Application submitted! We'll review it soon.");
                onSuccess({ status: 'pending', createdAt: new Date().toISOString() });
            } else toast.error(res.message || 'Submission failed');
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#7C5CFF]/60 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/20 transition-all resize-none";
    const labelCls = "block text-[11px] font-bold text-[#9DA7B3] mb-1.5 uppercase tracking-widest";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full max-w-xl bg-[#080D1A] border border-white/[0.08] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: 'min(88vh, 660px)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="relative px-6 pt-6 pb-5 shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFF]/12 via-transparent to-transparent" />
                    <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#7C5CFF]/10 rounded-full blur-[50px]" />

                    <div className="relative flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shadow-lg shadow-[#7C5CFF]/25">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-white leading-tight">Apply to be a Helper</h2>
                                <p className="text-[#9DA7B3] text-xs font-medium">Join our verified community</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-white/10 text-[#9DA7B3] hover:text-white transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* ── Step Indicator (compact, centered) ── */}
                    <div className="flex items-center justify-center gap-3">
                        {/* Step 1 */}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all duration-300 ${step >= 1 ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white shadow-md shadow-[#7C5CFF]/30' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                            </div>
                            <span className={`text-xs font-bold hidden sm:block transition-colors ${step >= 1 ? 'text-white' : 'text-slate-600'}`}>Your Profile</span>
                        </div>

                        {/* Connector */}
                        <div className="w-16 h-[2px] rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] rounded-full"
                                animate={{ width: step > 1 ? '100%' : '0%' }}
                                transition={{ duration: 0.4 }}
                            />
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all duration-300 ${step >= 2 ? 'bg-[#7C5CFF] border-[#7C5CFF] text-white shadow-md shadow-[#7C5CFF]/30' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                2
                            </div>
                            <span className={`text-xs font-bold hidden sm:block transition-colors ${step >= 2 ? 'text-white' : 'text-slate-600'}`}>Experience</span>
                        </div>
                    </div>
                </div>

                {/* ── Form Body (scrollable) ── */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="s1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Phone <span className="text-[#7C5CFF] normal-case">*</span></label>
                                        <input className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Availability <span className="text-[#7C5CFF] normal-case">*</span></label>
                                        <input className={inputCls} placeholder="Weekdays 6–10PM" value={form.availability} onChange={e => update('availability', e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Your Bio <span className="text-[#7C5CFF] normal-case">*</span></label>
                                    <textarea className={inputCls} rows={3} placeholder="Tell us about yourself — who you are, what drives you…" value={form.bio} onChange={e => update('bio', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Why do you want to be a helper? <span className="text-[#7C5CFF] normal-case">*</span></label>
                                    <textarea className={inputCls} rows={3} placeholder="Share your motivation to support others in their wellness journey…" value={form.motivation} onChange={e => update('motivation', e.target.value)} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="s2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className={labelCls}>Relevant Experience <span className="text-[#7C5CFF] normal-case">*</span></label>
                                    <textarea className={inputCls} rows={3} placeholder="Counseling, peer support, volunteering, or any related experience…" value={form.experience} onChange={e => update('experience', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelCls}>Specializations <span className="text-slate-600 normal-case font-medium tracking-normal">(comma separated)</span></label>
                                    <input className={inputCls} placeholder="e.g., Anxiety, Depression, Stress, Grief" value={form.specializations} onChange={e => update('specializations', e.target.value)} />
                                </div>
                                <label className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl cursor-pointer hover:border-[#7C5CFF]/30 transition-all group/check">
                                    <div
                                        onClick={() => update('hasTraining', !form.hasTraining)}
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${form.hasTraining ? 'bg-[#7C5CFF] border-[#7C5CFF]' : 'border-white/20 group-hover/check:border-[#7C5CFF]/40'}`}
                                    >
                                        {form.hasTraining && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">I have formal mental health training</p>
                                        <p className="text-xs text-slate-500 mt-0.5">NLP, counseling diploma, psychology degree, etc.</p>
                                    </div>
                                </label>
                                <AnimatePresence>
                                    {form.hasTraining && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                            <label className={labelCls}>Training Details</label>
                                            <input className={inputCls} placeholder="e.g., Certificate in Counseling, NLP Practitioner…" value={form.trainingDetails} onChange={e => update('trainingDetails', e.target.value)} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t border-white/[0.06] shrink-0 flex items-center justify-between bg-black/10">
                    {step === 2 ? (
                        <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[#9DA7B3] hover:text-white text-sm font-semibold transition-colors">
                            <ChevronRight className="w-4 h-4 rotate-180" /> Back
                        </button>
                    ) : (
                        <p className="text-xs text-slate-600">Step 1 of 2</p>
                    )}

                    {step === 1 ? (
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                if (!form.phone || !form.bio || !form.motivation || !form.availability) {
                                    toast.error('Please fill all required fields');
                                    return;
                                }
                                setStep(2);
                            }}
                            className="h-10 px-6 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#7C5CFF]/20"
                        >
                            Next Step <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={handleSubmit}
                            disabled={submitting || !form.experience}
                            className="h-10 px-6 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#7C5CFF]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><CheckCircle2 className="w-4 h-4" /> Submit</>}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HelpersPage() {
    const { user } = useAppStore();
    const [showModal, setShowModal] = useState(false);
    const [myApplication, setMyApplication] = useState<MyApplication | null>(null);
    const [helpers, setHelpers] = useState<Helper[]>([]);
    const [loadingHelpers, setLoadingHelpers] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const helpersRes = await apiFetch('/helpers');
                if (helpersRes.success) setHelpers(helpersRes.data || []);
            } catch { }
            setLoadingHelpers(false);
            if (user.role === 'user') {
                try {
                    const appRes = await apiFetch('/helpers/my-application');
                    if (appRes.success) setMyApplication(appRes.data);
                } catch { }
            }
        };
        fetchData();
    }, [user.role]);

    const filtered = helpers.filter(h =>
        h.name?.toLowerCase().includes(search.toLowerCase()) ||
        h.bio?.toLowerCase().includes(search.toLowerCase()) ||
        h.skills?.some(s => s.toLowerCase().includes(search.toLowerCase()))
    );

    const statusConf = myApplication ? STATUS_CONFIG[myApplication.status] : null;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">

            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Shield className="w-3 h-3" /> Verified Helpers
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-1">Human Support Network</h1>
                    <p className="text-[#9DA7B3] text-sm font-medium">Connect with trained peers for empathetic, real support.</p>
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9DA7B3]" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search helpers…"
                            className="h-10 w-52 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/30 focus:border-[#7C5CFF]/40 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* ── Application Status Banner ── */}
            <AnimatePresence>
                {myApplication && statusConf && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border ${statusConf.bg}`}
                    >
                        <statusConf.icon className={`w-5 h-5 ${statusConf.color} shrink-0`} />
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm">
                                Helper Application: <span className={statusConf.color}>{statusConf.label}</span>
                            </p>
                            {myApplication.adminNote && <p className="text-[#9DA7B3] text-xs mt-0.5">{myApplication.adminNote}</p>}
                            <p className="text-slate-600 text-xs mt-0.5">Submitted {new Date(myApplication.createdAt).toLocaleDateString()}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Stats Bar ── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: Users, label: 'Active Helpers', value: helpers.length || '—', color: 'text-indigo-400' },
                    { icon: Star, label: 'Avg Rating', value: helpers.length ? (helpers.reduce((s, h) => s + (h.rating || 5), 0) / helpers.length).toFixed(1) : '—', color: 'text-amber-400' },
                    { icon: Sparkles, label: 'Verified', value: helpers.filter(h => h.verified).length || '—', color: 'text-emerald-400' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
                        <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                        <p className="text-xl font-black text-white">{value}</p>
                        <p className="text-[10px] text-[#9DA7B3] font-bold uppercase tracking-widest mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Helpers Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {loadingHelpers ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-white/[0.03] border border-white/[0.06] rounded-[1.5rem] animate-pulse" />
                    ))
                ) : filtered.length > 0 ? (
                    filtered.map((helper, i) => <HelperCard key={helper._id} helper={helper} index={i} />)
                ) : (
                    <div className="col-span-4 text-center py-12 text-[#9DA7B3] text-sm">
                        {search ? `No helpers match "${search}"` : 'No approved helpers yet.'}
                    </div>
                )}

                {/* ── Become a Helper CTA ── */}
                {user.role !== 'helper' && !myApplication && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setShowModal(true)}
                        className="min-h-[220px] bg-[#7C5CFF]/5 border-2 border-dashed border-[#7C5CFF]/25 hover:border-[#7C5CFF]/50 hover:bg-[#7C5CFF]/8 rounded-[1.5rem] transition-all flex flex-col items-center justify-center p-6 text-center group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#7C5CFF]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6 text-[#7C5CFF]" />
                        </div>
                        <h3 className="text-base font-bold text-white mb-1.5">Want to help?</h3>
                        <p className="text-xs text-[#9DA7B3] leading-relaxed mb-4 max-w-[160px]">
                            Join our verified helpers. Good listeners welcome.
                        </p>
                        <span className="bg-[#7C5CFF] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-[#7C5CFF]/20">
                            Apply Now
                        </span>
                    </motion.button>
                )}
            </div>

            {/* ── Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <ApplyModal
                        onClose={() => setShowModal(false)}
                        onSuccess={(app) => { setMyApplication(app); setShowModal(false); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

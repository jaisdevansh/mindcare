'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserCheck, Star, Clock, CheckCircle, XCircle, Eye, RefreshCw, X, ShieldCheck, ShieldX, TrendingUp, Users, Mail, Calendar } from "lucide-react";
import { adminService } from "@/lib/services/admin.service";
import toast from "react-hot-toast";

type App = { _id: string; name: string; email: string; createdAt: string; status: string; motivation: string; experience: number; specializations: string[]; };

const SKILLS_COLORS: Record<string, string> = {
    'Anxiety': 'bg-blue-500/10 text-blue-400 border-blue-400/20',
    'Depression': 'bg-purple-500/10 text-purple-400 border-purple-400/20',
    'Trauma': 'bg-orange-500/10 text-orange-400 border-orange-400/20',
    'Grief': 'bg-pink-500/10 text-pink-400 border-pink-400/20',
    'Stress': 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
};

export default function HelpersPage() {
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selected, setSelected] = useState<App | null>(null);
    const [note, setNote] = useState('');
    const [acting, setActing] = useState(false);

    useEffect(() => { fetchApps(); }, []);
    const fetchApps = async () => {
        setLoading(true);
        try { const res = await adminService.getApplications(); if (res.success) setApps(res.data); }
        finally { setLoading(false); }
    };

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setActing(true);
        try {
            const res = action === 'approve' ? await adminService.approveApplication(id, note) : await adminService.rejectApplication(id, note);
            if (res.success) {
                toast.success(res.message);
                const ns = action === 'approve' ? 'approved' : 'rejected';
                setApps(p => p.map(a => a._id === id ? { ...a, status: ns } : a));
                setSelected(p => p ? { ...p, status: ns } : null);
                setNote('');
            } else toast.error(res.message);
        } finally { setActing(false); }
    };

    const filtered = apps.filter(a => {
        const matchSearch = !search || a.name.toLowerCase().includes(search) || a.email.toLowerCase().includes(search);
        const matchFilter = filter === 'all' || a.status === filter;
        return matchSearch && matchFilter;
    });

    const counts = { all: apps.length, pending: apps.filter(a => a.status === 'pending').length, approved: apps.filter(a => a.status === 'approved').length, rejected: apps.filter(a => a.status === 'rejected').length };

    const statusBadge = (s: string) => s === 'pending' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : s === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-400';

    return (
        <div className="space-y-5 pb-10">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Applications', value: counts.all, color: '#A67C52', icon: Users },
                    { label: 'Pending Review', value: counts.pending, color: '#f97316', icon: Clock },
                    { label: 'Approved Helpers', value: counts.approved, color: '#4ade80', icon: CheckCircle },
                    { label: 'Rejected', value: counts.rejected, color: '#f87171', icon: XCircle },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                        <c.icon className="w-4 h-4 mb-3" style={{ color: c.color }} />
                        <p className="text-3xl font-black text-[#EDE0D4]">{loading ? '—' : c.value}</p>
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Search + filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 group">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C52]/40" />
                            <input value={search} onChange={e => setSearch(e.target.value.toLowerCase())} placeholder="Search helpers…"
                                className="w-full h-11 bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 rounded-2xl pl-10 pr-4 text-[#EDE0D4] text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]/40 placeholder:text-[#A67C52]/25" />
                        </div>
                        <div className="flex gap-1.5">
                            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`h-11 px-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-[#A67C52] text-white' : 'bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 text-[#A67C52]/50 hover:text-[#A67C52]'}`}>
                                    {f} {filter !== f && <span className="opacity-50">({counts[f]})</span>}
                                </button>
                            ))}
                            <button onClick={fetchApps} disabled={loading} className="h-11 w-11 rounded-2xl bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 flex items-center justify-center text-[#A67C52]/50 hover:text-[#A67C52] transition-all">
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-[2rem] bg-[#1A0F0E]/20 border border-[#3D2B1F]/40 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-20"><RefreshCw className="w-7 h-7 text-[#A67C52] animate-spin" /></div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center py-20 gap-3"><UserCheck className="w-10 h-10 text-[#3D2B1F]" /><p className="text-[#A67C52]/40 text-sm">No helpers in this category</p></div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1A0F0E]/60 border-b border-[#3D2B1F]/40">
                                        {['Helper', 'Experience', 'Specializations', 'Status', ''].map(h => (
                                            <th key={h} className="px-5 py-4 text-[#A67C52] font-black text-[10px] uppercase tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#3D2B1F]/20">
                                    <AnimatePresence>
                                        {filtered.map((app, i) => (
                                            <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                                onClick={() => { setSelected(app); setNote(''); }}
                                                className={`cursor-pointer hover:bg-[#A67C52]/5 transition-colors ${selected?._id === app._id ? 'bg-[#A67C52]/8' : ''}`}>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A67C52]/30 to-[#7F5539]/20 border border-[#A67C52]/20 flex items-center justify-center font-black text-[#A67C52] text-sm shrink-0">
                                                            {app.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#EDE0D4] text-sm">{app.name}</p>
                                                            <p className="text-[10px] text-[#A67C52]/50 flex items-center gap-1"><Mail className="w-3 h-3" />{app.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4"><span className="text-sm font-bold text-[#EDE0D4]">{app.experience}y</span></td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {app.specializations?.slice(0, 2).map(s => (
                                                            <span key={s} className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${SKILLS_COLORS[s] || 'bg-[#A67C52]/10 text-[#A67C52] border-[#A67C52]/20'}`}>{s}</span>
                                                        ))}
                                                        {app.specializations?.length > 2 && <span className="text-[9px] text-[#A67C52]/40">+{app.specializations.length - 2}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadge(app.status)}`}>{app.status}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <button onClick={e => { e.stopPropagation(); setSelected(app); setNote(''); }} className="p-2 rounded-xl bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52]"><Eye className="w-3.5 h-3.5" /></button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Detail panel */}
                <div>
                    <AnimatePresence mode="wait">
                        {selected ? (
                            <motion.div key={selected._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="p-7 rounded-[2rem] bg-[#1A0F0E]/60 border border-[#3D2B1F]/40 sticky top-6 space-y-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A67C52] to-[#7F5539] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#A67C52]/20">
                                            {selected.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-[#EDE0D4]">{selected.name}</h3>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusBadge(selected.status)}`}>{selected.status}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-white/5 text-[#A67C52]/40"><X className="w-4 h-4" /></button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Experience', value: `${selected.experience} years`, icon: Clock },
                                        { label: 'Applied', value: new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), icon: Calendar },
                                    ].map(f => (
                                        <div key={f.label} className="p-3 rounded-2xl bg-[#0F0A08]/60 border border-[#3D2B1F]/40">
                                            <p className="text-[9px] text-[#A67C52]/40 font-black uppercase tracking-widest mb-1">{f.label}</p>
                                            <p className="font-bold text-[#EDE0D4] text-sm">{f.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {selected.specializations?.length > 0 && (
                                    <div>
                                        <p className="text-[9px] text-[#A67C52]/40 font-black uppercase tracking-widest mb-2">Specializations</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selected.specializations.map(s => (
                                                <span key={s} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${SKILLS_COLORS[s] || 'bg-[#A67C52]/10 text-[#A67C52] border-[#A67C52]/20'}`}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 rounded-2xl bg-[#0F0A08]/60 border border-[#3D2B1F]/40">
                                    <p className="text-[9px] text-[#A67C52]/40 font-black uppercase tracking-widest mb-2">Motivation</p>
                                    <p className="text-xs text-[#EDE0D4]/60 italic leading-relaxed">"{selected.motivation}"</p>
                                </div>

                                <div>
                                    <label className="text-[9px] text-[#A67C52]/40 font-black uppercase tracking-widest mb-1.5 block">Decision Note</label>
                                    <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Add note for applicant (optional)…"
                                        className="w-full bg-[#0F0A08] border border-[#3D2B1F]/60 rounded-2xl p-3 text-[#EDE0D4] text-xs resize-none outline-none focus:ring-1 focus:ring-[#A67C52]/40 placeholder:text-[#A67C52]/25" />
                                </div>

                                {selected.status === 'pending' ? (
                                    <div className="flex gap-3">
                                        <button onClick={() => handleAction(selected._id, 'reject')} disabled={acting}
                                            className="flex-1 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                                            {acting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Reject
                                        </button>
                                        <button onClick={() => handleAction(selected._id, 'approve')} disabled={acting}
                                            className="flex-1 h-10 rounded-2xl bg-gradient-to-r from-[#A67C52] to-[#7F5539] text-white text-sm font-bold shadow-lg shadow-[#A67C52]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5">
                                            {acting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Approve
                                        </button>
                                    </div>
                                ) : (
                                    <div className={`p-3 rounded-2xl border text-center text-sm font-bold ${statusBadge(selected.status)}`}>
                                        Application {selected.status}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[320px] border border-dashed border-[#3D2B1F]/40 rounded-[2rem] gap-3 text-center p-8 bg-[#1A0F0E]/10">
                                <UserCheck className="w-10 h-10 text-[#3D2B1F]" />
                                <p className="text-[#A67C52]/30 font-bold">Select an application</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Calendar, CheckCircle, XCircle, FileText, Info, Activity, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { adminService } from "@/lib/services/admin.service";
import toast from "react-hot-toast";

export default function ApplicationReview() {
    const [apps, setApps] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [adminNote, setAdminNote] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const [appRes, statsRes] = await Promise.all([
                adminService.getApplications(),
                adminService.getDashboardStats()
            ]);
            if (appRes.success) setApps(appRes.data);
            if (statsRes.success) setStats(statsRes.data);
        } catch {
            toast.error("Could not connect to server");
        } finally {
            setLoading(false);
        }
    };

    const fetchApps = fetchAll;

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            setActionLoading(true);
            const res = action === 'approve'
                ? await adminService.approveApplication(id, adminNote)
                : await adminService.rejectApplication(id, adminNote);

            if (res.success) {
                toast.success(res.message);
                const newStatus = action === 'approve' ? 'approved' : 'rejected';
                setApps(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
                setSelectedApp((prev: any) => prev ? { ...prev, status: newStatus } : null);
                setAdminNote("");
                // Refresh stats
                adminService.getDashboardStats().then(r => r.success && setStats(r.data));
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error(`Failed to ${action} application`);
        } finally {
            setActionLoading(false);
        }
    };

    const appCounts = React.useMemo(() => ({
        all: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
        approved: apps.filter(a => a.status === 'approved').length,
        rejected: apps.filter(a => a.status === 'rejected').length
    }), [apps]);

    const filtered = React.useMemo(() => 
        apps.filter(a => filter === 'all' || a.status === filter)
    , [apps, filter]);

    const statusColors: Record<string, string> = {
        pending: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        approved: 'bg-green-500/10 border-green-500/20 text-green-500',
        rejected: 'bg-red-500/10 border-red-500/20 text-red-400',
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats?.totalUsers ?? '—', color: '#A67C52', icon: Activity },
                    { label: 'Active Helpers', value: stats?.totalHelpers ?? '—', color: '#4ade80', icon: CheckCircle },
                    { label: 'Pending Review', value: appCounts.pending, color: '#f97316', icon: Clock },
                    { label: 'Rejected', value: appCounts.rejected, color: '#f87171', icon: AlertTriangle },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 backdrop-blur-md">
                        <c.icon className="w-4 h-4 mb-3" style={{ color: c.color }} />
                        <p className="text-3xl font-black text-[#EDE0D4]">{loading ? '—' : c.value}</p>
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Applications list */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black text-[#EDE0D4] flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#A67C52]" />
                                Helper Requests
                            </h2>
                            <div className="flex gap-1.5 ml-4">
                                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-[#A67C52] text-white' : 'bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 text-[#A67C52]/50 hover:text-[#A67C52]'}`}>
                                        {f} {filter !== f && <span className="opacity-50">({appCounts[f]})</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={fetchApps}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-[#1A0F0E]/60 border border-[#3D2B1F]/50 text-[#A67C52] text-xs font-bold hover:bg-[#A67C52]/10 transition-all"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* List */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <RefreshCw className="w-8 h-8 text-[#A67C52] animate-spin" />
                            <p className="text-[#A67C52]/50 text-sm">Loading applications…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3 border border-dashed border-[#3D2B1F]/40 rounded-[2rem] bg-[#1A0F0E]/10">
                            <FileText className="w-12 h-12 text-[#3D2B1F]" />
                            <p className="text-[#A67C52]/40 text-sm font-medium">No {filter !== 'all' ? filter : ''} applications found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <AnimatePresence>
                                {filtered.map((app, i) => (
                                    <motion.button
                                        key={app._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => { setSelectedApp(app); setAdminNote(""); }}
                                        className={`w-full p-5 rounded-[1.5rem] border flex items-center justify-between transition-all group text-left ${selectedApp?._id === app._id
                                            ? 'bg-[#A67C52]/10 border-[#A67C52]/50 ring-2 ring-[#A67C52]/20'
                                            : 'bg-[#1A0F0E]/40 border-[#3D2B1F]/40 hover:border-[#A67C52]/30 hover:bg-[#3D2B1F]/20'
                                            }`}
                                    >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#A67C52]/20 to-[#7F5539]/10 flex items-center justify-center font-black text-[#A67C52] border border-[#A67C52]/20 group-hover:scale-110 transition-transform shrink-0">
                                            {app.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#EDE0D4] text-sm">{app.name}</p>
                                            <div className="flex items-center gap-3 mt-0.5">
                                                <span className="text-[11px] text-[#A67C52]/60 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {app.email}
                                                </span>
                                                <span className="text-[11px] text-[#A67C52]/50 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${statusColors[app.status] || statusColors.pending}`}>
                                        {app.status}
                                    </span>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Details pane */}
            <div className="lg:col-span-1">
                <AnimatePresence mode="wait">
                    {selectedApp ? (
                        <motion.div
                            key={selectedApp._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="p-7 rounded-[2rem] bg-[#1A0F0E]/60 border border-[#3D2B1F]/40 backdrop-blur-2xl sticky top-6 space-y-5"
                        >
                            {/* Candidate Header */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A67C52] to-[#7F5539] flex items-center justify-center shadow-lg shadow-[#A67C52]/20 text-white font-black text-lg">
                                    {selectedApp.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-black text-[#EDE0D4] text-base leading-tight">{selectedApp.name}</h3>
                                    <p className="text-[10px] text-[#A67C52]/60 font-medium uppercase tracking-widest">Applicant</p>
                                </div>
                                <span className={`ml-auto px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[selectedApp.status] || statusColors.pending}`}>
                                    {selectedApp.status}
                                </span>
                            </div>

                            {/* Motivation */}
                            <div className="p-4 rounded-2xl bg-[#0F0A08]/60 border border-[#3D2B1F]/40">
                                <p className="text-[9px] text-[#A67C52] uppercase font-black tracking-widest mb-2">Motivation</p>
                                <p className="text-[#EDE0D4]/70 text-xs leading-relaxed italic">"{selectedApp.motivation}"</p>
                            </div>

                            {/* Experience + Specializations */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-[#0F0A08]/60 border border-[#3D2B1F]/40">
                                    <p className="text-[9px] text-[#A67C52] uppercase font-black tracking-widest mb-1">Experience</p>
                                    <p className="text-[#EDE0D4] font-black text-lg">{selectedApp.experience}<span className="text-xs font-medium text-[#A67C52]/60 ml-1">yrs</span></p>
                                </div>
                                <div className="p-4 rounded-2xl bg-[#0F0A08]/60 border border-[#3D2B1F]/40">
                                    <p className="text-[9px] text-[#A67C52] uppercase font-black tracking-widest mb-2">Contact</p>
                                    <p className="text-[#EDE0D4]/70 text-[10px] break-all">{selectedApp.email}</p>
                                </div>
                            </div>

                            {selectedApp.specializations?.length > 0 && (
                                <div>
                                    <p className="text-[9px] text-[#A67C52] uppercase font-black tracking-widest mb-2">Specializations</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedApp.specializations.map((s: string) => (
                                            <span key={s} className="px-2.5 py-1 rounded-lg bg-[#A67C52]/10 border border-[#A67C52]/20 text-[10px] font-bold text-[#EDE0D4]">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Admin Note */}
                            <div>
                                <label className="text-[9px] text-[#A67C52] uppercase font-black tracking-widest mb-2 block">Decision Note</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add a note for the applicant (optional)…"
                                    rows={3}
                                    className="w-full bg-[#0F0A08] border border-[#3D2B1F]/60 rounded-2xl p-4 text-[#EDE0D4] text-xs outline-none focus:ring-1 focus:ring-[#A67C52] resize-none placeholder:text-[#A67C52]/30 transition-all"
                                />
                            </div>

                            {/* Action buttons - only if pending */}
                            {selectedApp.status === 'pending' ? (
                                <div className="flex gap-3 pt-1">
                                    <button
                                        onClick={() => handleAction(selectedApp._id, 'reject')}
                                        disabled={actionLoading}
                                        className="flex-1 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(selectedApp._id, 'approve')}
                                        disabled={actionLoading}
                                        className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#A67C52] to-[#7F5539] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#A67C52]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Approve
                                    </button>
                                </div>
                            ) : (
                                <div className={`p-4 rounded-2xl border text-sm font-bold text-center ${statusColors[selectedApp.status]}`}>
                                    Application has been {selectedApp.status}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[400px] border border-dashed border-[#3D2B1F]/40 rounded-[2rem] gap-3 p-8 text-center bg-[#1A0F0E]/10"
                        >
                            <Info className="w-10 h-10 text-[#3D2B1F]" />
                            <p className="font-bold text-[#A67C52]/30 tracking-tight">Select an application</p>
                            <p className="text-xs text-[#A67C52]/20 font-light">Click any applicant to review their details</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            </div>
        </div>
    );
}

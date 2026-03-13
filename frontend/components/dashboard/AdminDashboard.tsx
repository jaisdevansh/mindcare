'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, UserCheck, CheckCircle2, AlertTriangle, Clock, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '@/lib/api';
import toast from 'react-hot-toast';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Application {
    _id: string;
    name: string;
    email: string;
    phone: string;
    bio: string;
    motivation: string;
    experience: string;
    specializations: string[];
    availability: string;
    hasTraining: boolean;
    trainingDetails: string;
    status: 'pending' | 'approved' | 'rejected';
    adminNote: string;
    createdAt: string;
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
    const map: Record<string, { icon: any; color: string; bg: string }> = {
        pending: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        approved: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        rejected: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    };
    const { icon: Icon, color, bg } = map[status] || map.pending;
    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-widest ${bg} ${color}`}>
            <Icon className="w-3 h-3" /> {status}
        </span>
    );
};

// ─── APPLICATION ROW ─────────────────────────────────────────────────────────

const ApplicationRow = ({ app, onApprove, onReject }: {
    app: Application;
    onApprove: (id: string, note: string) => void;
    onReject: (id: string, note: string) => void;
}) => {
    const [expanded, setExpanded] = useState(false);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handle = async (action: 'approve' | 'reject') => {
        setLoading(true);
        try {
            if (action === 'approve') await onApprove(app._id, note);
            else await onReject(app._id, note);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div layout className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-300 text-sm">
                        {app.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-bold">{app.name}</p>
                        <p className="text-slate-500 text-xs">{app.email} · Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-6 border-t border-white/5 pt-5 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Bio</p>
                                    <p className="text-slate-300">{app.bio}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Motivation</p>
                                    <p className="text-slate-300">{app.motivation}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Experience</p>
                                    <p className="text-slate-300">{app.experience}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Availability</p>
                                    <p className="text-slate-300">{app.availability}</p>
                                </div>
                                {app.specializations?.length > 0 && (
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">Specializations</p>
                                        <div className="flex flex-wrap gap-1">
                                            {app.specializations.map(s => (
                                                <span key={s} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-1">Training</p>
                                    <p className="text-slate-300">{app.hasTraining ? app.trainingDetails || 'Yes (details not specified)' : 'No formal training'}</p>
                                </div>
                            </div>

                            {app.status === 'pending' && (
                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Admin Note (optional)</label>
                                        <input
                                            value={note}
                                            onChange={e => setNote(e.target.value)}
                                            placeholder="Add a message for the applicant..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            onClick={() => handle('approve')}
                                            disabled={loading}
                                            className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handle('reject')}
                                            disabled={loading}
                                            className="flex-1 h-11 bg-rose-600 hover:bg-rose-500 rounded-xl font-bold flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {app.status !== 'pending' && app.adminNote && (
                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Admin Note</p>
                                    <p className="text-slate-300 text-sm">{app.adminNote}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────

export const AdminDashboard = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [loading, setLoading] = useState(true);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`/admin/applications${filter !== 'all' ? `?status=${filter}` : ''}`);
            if (res.success) setApplications(res.data);
        } catch {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const handleApprove = async (id: string, note: string) => {
        const res = await apiFetch(`/admin/applications/${id}/approve`, { method: 'PUT', body: JSON.stringify({ adminNote: note }) });
        if (res.success) {
            toast.success('Application approved! User is now a helper.');
            fetchApplications();
        } else toast.error(res.message || 'Failed to approve');
    };

    const handleReject = async (id: string, note: string) => {
        const res = await apiFetch(`/admin/applications/${id}/reject`, { method: 'PUT', body: JSON.stringify({ adminNote: note }) });
        if (res.success) {
            toast.success('Application rejected.');
            fetchApplications();
        } else toast.error(res.message || 'Failed to reject');
    };

    const counts = {
        pending: applications.filter(a => a.status === 'pending').length,
        approved: applications.filter(a => a.status === 'approved').length,
        rejected: applications.filter(a => a.status === 'rejected').length,
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <h2 className="text-2xl font-bold text-white mb-2">Platform Administration</h2>
                <p className="text-slate-300">Manage helper applications and platform moderation.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: '—', icon: Users, color: 'text-blue-400' },
                    { label: 'Active Helpers', value: counts.approved, icon: UserCheck, color: 'text-emerald-400' },
                    { label: 'Pending Review', value: counts.pending, icon: Clock, color: 'text-amber-400' },
                    { label: 'Rejected', value: counts.rejected, icon: AlertTriangle, color: 'text-rose-400' },
                ].map(s => (
                    <Card key={s.label} className="bg-white/5 border-white/10 rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
                            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</CardTitle>
                            <s.icon className={`w-4 h-4 ${s.color}`} />
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                            <div className="text-3xl font-black text-white">{s.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Applications Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-white">Helper Applications</h3>
                    <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                        {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${filter === f ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No {filter !== 'all' ? filter : ''} applications found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {applications.map(app => (
                            <ApplicationRow key={app._id} app={app} onApprove={handleApprove} onReject={handleReject} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

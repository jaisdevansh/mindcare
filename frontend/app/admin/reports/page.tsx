'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, AlertTriangle, UserX, Trash2, CheckCircle, ShieldX, X, Eye, Bell } from "lucide-react";
import toast from "react-hot-toast";

type Report = {
    _id: string;
    reportedBy: string;
    targetUser: string;
    type: 'harassment' | 'hate_speech' | 'sensitive_content' | 'spam';
    content: string;
    date: string;
    status: 'open' | 'resolved' | 'dismissed';
};

const TYPES: Record<string, { label: string; color: string }> = {
    harassment: { label: 'Harassment', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
    hate_speech: { label: 'Hate Speech', color: 'bg-pink-500/10 border-pink-500/20 text-pink-400' },
    sensitive_content: { label: 'Sensitive Content', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
    spam: { label: 'Spam', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
};

const MOCK_REPORTS: Report[] = [
    { _id: 'r1', reportedBy: 'Priya Sharma', targetUser: 'User_Anonymous_X', type: 'harassment', content: 'Repeated hostile messages in community chat directed at vulnerable users.', date: new Date(Date.now() - 3600000).toISOString(), status: 'open' },
    { _id: 'r2', reportedBy: 'Rahul Mehta', targetUser: 'User_TrollFace', type: 'hate_speech', content: 'Posted discriminatory content targeting mental illness sufferers.', date: new Date(Date.now() - 86400000).toISOString(), status: 'open' },
    { _id: 'r3', reportedBy: 'Ananya Gupta', targetUser: 'User_Spammer99', type: 'spam', content: 'Flooding the community feed with unrelated promotional content.', date: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'open' },
    { _id: 'r4', reportedBy: 'Dev Patel', targetUser: 'User_Negative01', type: 'sensitive_content', content: 'Sharing graphic self-harm related content without content warning.', date: new Date(Date.now() - 3 * 86400000).toISOString(), status: 'resolved' },
    { _id: 'r5', reportedBy: 'Sneha Roy', targetUser: 'User_Impersonator', type: 'harassment', content: 'Impersonating a licensed therapist and giving harmful advice.', date: new Date(Date.now() - 4 * 86400000).toISOString(), status: 'dismissed' },
];

const statusBadge = (s: string) => s === 'open' ? 'bg-red-500/10 border-red-500/20 text-red-400' : s === 'resolved' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-[#3D2B1F]/40 border-[#3D2B1F] text-[#A67C52]/50';

const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
    const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'dismissed'>('all');
    const [selected, setSelected] = useState<Report | null>(null);

    const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);
    const counts = { all: reports.length, open: reports.filter(r => r.status === 'open').length, resolved: reports.filter(r => r.status === 'resolved').length, dismissed: reports.filter(r => r.status === 'dismissed').length };

    const resolve = (id: string) => { setReports(p => p.map(r => r._id === id ? { ...r, status: 'resolved' as const } : r)); toast.success('Report resolved'); setSelected(null); };
    const dismiss = (id: string) => { setReports(p => p.map(r => r._id === id ? { ...r, status: 'dismissed' as const } : r)); toast('Report dismissed', { icon: '📁' }); setSelected(null); };
    const removeContent = (id: string) => { setReports(p => p.filter(r => r._id !== id)); toast.success('Content removed + report closed'); setSelected(null); };

    return (
        <div className="space-y-5 pb-10">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Reports', value: counts.all, color: '#A67C52', icon: Flag },
                    { label: 'Open', value: counts.open, color: '#f87171', icon: AlertTriangle },
                    { label: 'Resolved', value: counts.resolved, color: '#4ade80', icon: CheckCircle },
                    { label: 'Dismissed', value: counts.dismissed, color: '#A67C52', icon: X },
                ].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="p-5 rounded-[1.5rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                        <c.icon className="w-4 h-4 mb-3" style={{ color: c.color }} />
                        <p className="text-3xl font-black text-[#EDE0D4]">{c.value}</p>
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{c.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {(['all', 'open', 'resolved', 'dismissed'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`h-10 px-5 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-[#A67C52] text-white' : 'bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 text-[#A67C52]/50 hover:text-[#A67C52]'}`}>
                        {f} ({counts[f]})
                    </button>
                ))}
            </div>

            {/* Reports Table */}
            <div className="rounded-[2rem] bg-[#1A0F0E]/20 border border-[#3D2B1F]/40 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#1A0F0E]/60 border-b border-[#3D2B1F]/40">
                            {['Reported By', 'Against', 'Type', 'When', 'Status', 'Actions'].map(h => (
                                <th key={h} className="px-5 py-4 text-[#A67C52] font-black text-[10px] uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3D2B1F]/20">
                        <AnimatePresence>
                            {filtered.map((r, i) => (
                                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}
                                    onClick={() => setSelected(r)}
                                    className="hover:bg-[#A67C52]/5 transition-colors cursor-pointer">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-[#A67C52]/15 border border-[#A67C52]/20 flex items-center justify-center text-[#A67C52] font-black text-xs shrink-0">
                                                {r.reportedBy.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-[#EDE0D4]">{r.reportedBy}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4"><span className="text-sm text-[#EDE0D4]/60 font-medium">{r.targetUser}</span></td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${TYPES[r.type].color}`}>
                                            {TYPES[r.type].label}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4"><span className="text-xs text-[#A67C52]/40 font-medium">{timeAgo(r.date)}</span></td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusBadge(r.status)}`}>{r.status}</span>
                                    </td>
                                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                        <div className="flex gap-1.5">
                                            <button onClick={() => setSelected(r)} className="p-2 rounded-xl bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52] hover:bg-[#A67C52]/20 transition-all" title="View">
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            {r.status === 'open' && (
                                                <>
                                                    <button onClick={() => resolve(r._id)} className="p-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 transition-all" title="Resolve">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => dismiss(r._id)} className="p-2 rounded-xl bg-[#3D2B1F]/40 border border-[#3D2B1F] text-[#A67C52]/40 hover:text-[#A67C52] transition-all" title="Dismiss">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Detail modal */}
            <AnimatePresence>
                {selected && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-lg bg-[#150D0B] border border-[#3D2B1F] rounded-[2rem] p-8 shadow-2xl">
                            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-white/5 text-[#A67C52]/40"><X className="w-4 h-4" /></button>
                            <h3 className="text-lg font-black text-[#EDE0D4] mb-5 flex items-center gap-2"><Flag className="w-5 h-5 text-[#A67C52]" /> Report Detail</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { l: 'Reported By', v: selected.reportedBy },
                                        { l: 'Against', v: selected.targetUser },
                                    ].map(f => (
                                        <div key={f.l} className="p-3 rounded-2xl bg-[#0F0A08] border border-[#3D2B1F]/60">
                                            <p className="text-[9px] text-[#A67C52]/40 font-black uppercase tracking-widest mb-1">{f.l}</p>
                                            <p className="text-sm font-bold text-[#EDE0D4]">{f.v}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 rounded-2xl bg-[#0F0A08] border border-[#3D2B1F]/60 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${TYPES[selected.type].color}`}>{TYPES[selected.type].label}</span>
                                        <span className="text-[10px] text-[#A67C52]/40">{timeAgo(selected.date)}</span>
                                    </div>
                                    <p className="text-sm text-[#EDE0D4]/60 italic leading-relaxed">"{selected.content}"</p>
                                </div>
                                {selected.status === 'open' && (
                                    <div className="flex gap-3">
                                        <button onClick={() => removeContent(selected._id)} className="flex-1 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Remove Content</button>
                                        <button onClick={() => { toast('Warning sent (mock)', { icon: '⚠️' }); }} className="flex-1 h-11 rounded-2xl bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52] text-sm font-bold hover:bg-[#A67C52]/20 transition-all flex items-center justify-center gap-2"><Bell className="w-3.5 h-3.5" /> Warn User</button>
                                        <button onClick={() => dismiss(selected._id)} className="flex-1 h-11 rounded-2xl border border-[#3D2B1F] text-[#A67C52]/50 text-sm font-bold hover:text-[#A67C52] transition-all flex items-center justify-center gap-2"><CheckCircle className="w-3.5 h-3.5" /> Dismiss</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

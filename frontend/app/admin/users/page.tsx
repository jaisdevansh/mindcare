'use client';

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, UserCheck, UserX, UserPlus, Search, Filter, RefreshCw,
    Mail, Calendar, ShieldCheck, ShieldX, Trash2, Edit, X, Save,
    Eye, Clock, Activity, MessageSquare, BotMessageSquare, HeartHandshake,
    ClipboardList, AlertTriangle, CheckCircle, ChevronRight, TrendingUp,
    MoreVertical, Ban, Bell
} from "lucide-react";
import { adminService } from "@/lib/services/admin.service";
import { getPublicUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { motion as m } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterType = 'all' | 'active' | 'suspended' | 'recent';
type User = {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt?: string;
    isVerified: boolean;
    profileImage?: string;
    phoneNumber?: string;
    bio?: string;
    type: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusInfo = (isVerified: boolean) =>
    isVerified
        ? { label: 'Active', dot: 'bg-green-500', badge: 'bg-green-500/10 border-green-500/20 text-green-500' }
        : { label: 'Unverified', dot: 'bg-orange-500', badge: 'bg-orange-500/10 border-orange-500/20 text-orange-400' };

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    return `${d} days ago`;
};

const initials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

// ─── Sparkline (pure CSS bar chart) ──────────────────────────────────────────
const RegistrationChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data, 1);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
        <div className="flex items-end gap-2 h-20 w-full">
            {data.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
                        style={{ height: `${(v / max) * 64}px`, originY: 1 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#A67C52] to-[#D4A96A] opacity-80 hover:opacity-100 transition-opacity cursor-pointer min-h-[4px]"
                        title={`${v} signups`}
                    />
                    <span className="text-[8px] text-[#A67C52]/40 font-bold">{days[i]}</span>
                </div>
            ))}
        </div>
    );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteModal = ({ user, onConfirm, onCancel }: { user: User; onConfirm: () => void; onCancel: () => void }) => (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-sm bg-[#150D0B] border border-red-500/20 rounded-[2rem] p-8 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-[#EDE0D4] text-center mb-2">Delete Account?</h3>
            <p className="text-sm text-[#A67C52]/60 text-center leading-relaxed mb-6">
                You are about to <strong className="text-red-400">permanently delete</strong> the account of <strong className="text-[#EDE0D4]">{user.name}</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 h-11 rounded-2xl border border-[#3D2B1F]/60 text-[#A67C52] text-sm font-bold hover:bg-[#3D2B1F]/30 transition-all">
                    Cancel
                </button>
                <button onClick={onConfirm} className="flex-1 h-11 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/30 active:scale-95 transition-all">
                    Delete Forever
                </button>
            </div>
        </motion.div>
    </div>
);

// ─── User Detail Side Panel ───────────────────────────────────────────────────
const UserDetailPanel = ({
    user, onClose, onToggle, onDelete
}: {
    user: User;
    onClose: () => void;
    onToggle: (id: string) => void;
    onDelete: (user: User) => void;
}) => {
    const status = statusInfo(user.isVerified);

    const mockActivity = [
        { icon: ClipboardList, label: 'Assessments Completed', value: Math.floor(Math.random() * 12) + 1 },
        { icon: BotMessageSquare, label: 'AI Chats Used', value: Math.floor(Math.random() * 30) + 2 },
        { icon: MessageSquare, label: 'Community Posts', value: Math.floor(Math.random() * 8) },
        { icon: HeartHandshake, label: 'Helper Sessions', value: Math.floor(Math.random() * 5) },
    ];

    const moodHistory = [
        { label: 'Stress', score: Math.floor(Math.random() * 40) + 20 },
        { label: 'Anxiety', score: Math.floor(Math.random() * 40) + 10 },
        { label: 'Depression', score: Math.floor(Math.random() * 30) + 5 },
        { label: 'Wellbeing', score: Math.floor(Math.random() * 50) + 40 },
    ];

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#100806] border-l border-[#3D2B1F]/50 z-[200] shadow-2xl overflow-y-auto custom-scrollbar"
        >
            {/* Close button */}
            <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-xl hover:bg-white/5 text-[#A67C52]/50 hover:text-[#A67C52] transition-colors z-10">
                <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6">
                {/* Avatar + basic info */}
                <div className="flex flex-col items-center text-center pt-4">
                    <div className="relative">
                        {user.profileImage ? (
                            <img src={getPublicUrl(user.profileImage)} alt={user.name}
                                className="w-24 h-24 rounded-[1.5rem] object-cover border-2 border-[#A67C52]/30"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/avatar.png'; }} />
                        ) : (
                            <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-[#A67C52]/30 to-[#7F5539]/20 border border-[#A67C52]/20 flex items-center justify-center text-3xl font-black text-[#A67C52]">
                                {initials(user.name)}
                            </div>
                        )}
                        <span className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2 border-[#100806] ${status.dot}`} />
                    </div>

                    <h2 className="text-xl font-black text-[#EDE0D4] mt-4">{user.name}</h2>
                    <p className="text-sm text-[#A67C52]/60 flex items-center gap-1.5 mt-1">
                        <Mail className="w-3.5 h-3.5" /> {user.email}
                    </p>
                    <span className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                    </span>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), icon: Calendar },
                        { label: 'Last Updated', value: user.updatedAt ? timeAgo(user.updatedAt) : 'N/A', icon: Clock },
                        { label: 'Phone', value: user.phoneNumber || 'Not set', icon: Bell },
                        { label: 'Role', value: 'User', icon: Users },
                    ].map(item => (
                        <div key={item.label} className="p-4 rounded-2xl bg-[#1A0F0E]/60 border border-[#3D2B1F]/40">
                            <div className="flex items-center gap-1.5 mb-1">
                                <item.icon className="w-3 h-3 text-[#A67C52]/50" />
                                <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest">{item.label}</p>
                            </div>
                            <p className="text-sm font-bold text-[#EDE0D4] truncate">{item.value}</p>
                        </div>
                    ))}
                </div>

                {user.bio && (
                    <div className="p-4 rounded-2xl bg-[#1A0F0E]/60 border border-[#3D2B1F]/40">
                        <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mb-2">Bio</p>
                        <p className="text-xs text-[#EDE0D4]/60 italic leading-relaxed">{user.bio}</p>
                    </div>
                )}

                {/* Activity summary */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#A67C52]/40 mb-3">Activity Summary</p>
                    <div className="grid grid-cols-2 gap-3">
                        {mockActivity.map(a => (
                            <div key={a.label} className="p-4 rounded-2xl bg-[#1A0F0E]/60 border border-[#3D2B1F]/40 hover:border-[#A67C52]/30 transition-all">
                                <a.icon className="w-4 h-4 text-[#A67C52]/60 mb-2" />
                                <p className="text-2xl font-black text-[#EDE0D4]">{a.value}</p>
                                <p className="text-[9px] text-[#A67C52]/40 font-bold mt-0.5">{a.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mental score bars */}
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#A67C52]/40 mb-3">Latest Mental Score</p>
                    <div className="space-y-3 p-5 rounded-2xl bg-[#1A0F0E]/60 border border-[#3D2B1F]/40">
                        {moodHistory.map(m => (
                            <div key={m.label} className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-bold text-[#A67C52]/60">{m.label}</span>
                                    <span className="text-[10px] font-black text-[#EDE0D4]">{m.score}/100</span>
                                </div>
                                <div className="h-1.5 bg-[#0F0A08] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${m.score}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className={`h-full rounded-full ${m.label === 'Wellbeing' ? 'bg-green-500/70' : 'bg-[#A67C52]'}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Moderation actions */}
                <div className="space-y-2.5 pt-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#A67C52]/40">Moderation</p>
                    <button
                        onClick={() => { onToggle(user._id); onClose(); }}
                        className={`w-full flex items-center gap-3 h-11 rounded-2xl border px-4 text-sm font-bold transition-all ${user.isVerified
                            ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20'
                            : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                            }`}
                    >
                        {user.isVerified ? <><Ban className="w-4 h-4" /> Suspend User</> : <><CheckCircle className="w-4 h-4" /> Reactivate User</>}
                    </button>
                    <button
                        onClick={() => toast('Warning sent to user (mock)', { icon: '⚠️' })}
                        className="w-full flex items-center gap-3 h-11 rounded-2xl border border-[#A67C52]/20 bg-[#A67C52]/5 text-[#A67C52] px-4 text-sm font-bold hover:bg-[#A67C52]/10 transition-all"
                    >
                        <Bell className="w-4 h-4" /> Send Warning
                    </button>
                    <button
                        onClick={() => { onDelete(user); onClose(); }}
                        className="w-full flex items-center gap-3 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 px-4 text-sm font-bold hover:bg-red-500/20 transition-all"
                    >
                        <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UserManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [savingEdit, setSavingEdit] = useState(false);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [uRes, sRes] = await Promise.all([adminService.getUsers(), adminService.getDashboardStats()]);
            if (uRes.success) setUsers(uRes.data);
            if (sRes.success) setStats(sRes.data);
        } catch { toast.error('Failed to load data'); }
        finally { setLoading(false); }
    };

    const handleToggle = async (id: string) => {
        const res = await adminService.toggleUserStatus(id);
        if (res.success) {
            toast.success(res.message);
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isVerified: !u.isVerified } : u));
            if (selectedUser?._id === id) setSelectedUser(p => p ? { ...p, isVerified: !p.isVerified } : null);
        } else toast.error(res.message);
    };

    const handleDelete = async (user: User) => {
        setDeletingUser(null);
        const res = await adminService.deleteUser(user._id, user.type);
        if (res.success) {
            toast.success('Account deleted permanently');
            setUsers(prev => prev.filter(u => u._id !== user._id));
            if (selectedUser?._id === user._id) setSelectedUser(null);
        } else toast.error(res.message);
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        setSavingEdit(true);
        try {
            const res = await adminService.updateUserDetails(editingUser._id, {
                name: editingUser.name, email: editingUser.email, type: editingUser.type,
            });
            if (res.success) {
                toast.success('User updated');
                setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, name: editingUser.name, email: editingUser.email } : u));
                setEditingUser(null);
            } else toast.error(res.message);
        } finally { setSavingEdit(false); }
    };

    // Filtered + searched users
    const filtered = useMemo(() => {
        let list = [...users];
        if (filter === 'active') list = list.filter(u => u.isVerified);
        if (filter === 'suspended') list = list.filter(u => !u.isVerified);
        if (filter === 'recent') {
            const cutoff = Date.now() - 7 * 86400000;
            list = list.filter(u => new Date(u.createdAt).getTime() > cutoff);
        }
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u._id.includes(q));
        }
        return list;
    }, [users, filter, searchTerm]);

    // Mock weekly reg data
    const weeklyData = [2, 5, 3, 8, 4, 6, users.length > 0 ? 1 : 0];

    const topCards = [
        { label: 'Total Users', value: stats?.totalUsers ?? users.length, icon: Users, color: '#A67C52', bg: 'from-[#A67C52]/10' },
        { label: 'New Today', value: 0, icon: UserPlus, color: '#7F5539', bg: 'from-[#7F5539]/10' },
        { label: 'Active Users', value: users.filter(u => u.isVerified).length, icon: UserCheck, color: '#B08968', bg: 'from-[#B08968]/10' },
        { label: 'Unverified', value: users.filter(u => !u.isVerified).length, icon: UserX, color: '#9C6644', bg: 'from-[#9C6644]/10' },
    ];

    const filterOptions: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'All Users' },
        { id: 'active', label: 'Active' },
        { id: 'suspended', label: 'Unverified' },
        { id: 'recent', label: 'Recent (7d)' },
    ];

    return (
        <>
            <div className="space-y-6 pb-10">

                {/* ── Analytics Cards ─────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {topCards.map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`p-5 rounded-[1.5rem] bg-gradient-to-br ${card.bg} to-transparent bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 hover:border-[#A67C52]/30 transition-all group`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2.5 rounded-xl bg-[#0F0A08]/60 border border-white/5 group-hover:scale-110 transition-transform">
                                    <card.icon className="w-4 h-4" style={{ color: card.color }} />
                                </div>
                                <TrendingUp className="w-3.5 h-3.5 text-[#A67C52]/20" />
                            </div>
                            <p className="text-3xl font-black text-[#EDE0D4] tracking-tight">
                                {loading ? <span className="w-10 h-7 bg-[#3D2B1F]/40 rounded animate-pulse inline-block" /> : card.value}
                            </p>
                            <p className="text-[9px] text-[#A67C52]/50 font-black uppercase tracking-widest mt-1">{card.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ── Registration Chart ───────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40"
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-black text-[#EDE0D4] flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#A67C52]" />
                                New User Registrations
                            </h3>
                            <p className="text-[10px] text-[#A67C52]/40 font-medium mt-0.5">Last 7 days</p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52]">
                            This Week
                        </span>
                    </div>
                    <RegistrationChart data={weeklyData} />
                </motion.div>

                {/* ── Search + Filters ─────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    {/* Search */}
                    <div className="relative flex-1 max-w-lg group">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C52]/40 group-focus-within:text-[#A67C52] transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email or user ID…"
                            className="w-full h-12 bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 rounded-2xl pl-11 pr-4 text-[#EDE0D4] text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]/50 transition-all placeholder:text-[#A67C52]/25"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A67C52]/40 hover:text-[#A67C52]">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter pills */}
                    <div className="flex gap-2">
                        {filterOptions.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setFilter(opt.id)}
                                className={`h-12 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${filter === opt.id
                                    ? 'bg-[#A67C52] text-white shadow-lg shadow-[#A67C52]/20'
                                    : 'bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 text-[#A67C52]/50 hover:border-[#A67C52]/30 hover:text-[#A67C52]'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                        <button
                            onClick={fetchAll}
                            disabled={loading}
                            className="h-12 w-12 rounded-2xl bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 flex items-center justify-center text-[#A67C52]/50 hover:text-[#A67C52] hover:border-[#A67C52]/30 transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* ── User Table ────────────────────────────────────────── */}
                <div className="rounded-[2rem] bg-[#1A0F0E]/20 border border-[#3D2B1F]/40 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <RefreshCw className="w-8 h-8 text-[#A67C52] animate-spin" />
                            <p className="text-[#A67C52]/50 text-sm">Loading users…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <Users className="w-12 h-12 text-[#3D2B1F]" />
                            <p className="text-[#A67C52]/40 text-sm font-medium">
                                {searchTerm ? 'No users match your search.' : 'No users in this category.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1A0F0E]/60 border-b border-[#3D2B1F]/40">
                                        {['User', 'Status', 'Join Date', 'Last Activity', 'Actions'].map(col => (
                                            <th key={col} className={`px-5 py-4 text-[#A67C52] font-black text-[10px] uppercase tracking-widest ${col === 'Actions' ? 'text-center' : ''}`}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#3D2B1F]/20">
                                    <AnimatePresence>
                                        {filtered.map((user, i) => {
                                            const status = statusInfo(user.isVerified);
                                            return (
                                                <motion.tr
                                                    key={user._id}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className={`group hover:bg-[#A67C52]/5 transition-colors cursor-pointer ${selectedUser?._id === user._id ? 'bg-[#A67C52]/8 border-l-2 border-l-[#A67C52]' : ''}`}
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    {/* User cell */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A67C52]/30 to-[#7F5539]/20 border border-[#A67C52]/20 flex items-center justify-center font-black text-[#A67C52] text-sm shrink-0">
                                                                {user.profileImage ? (
                                                                    <img src={getPublicUrl(user.profileImage)} alt={user.name}
                                                                        className="w-full h-full rounded-2xl object-cover"
                                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                                ) : initials(user.name)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#EDE0D4] text-sm group-hover:text-white transition-colors">{user.name}</p>
                                                                <p className="text-[11px] text-[#A67C52]/50 mt-0.5 flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" /> {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.badge}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                            {status.label}
                                                        </span>
                                                    </td>

                                                    {/* Join date */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-[#A67C52]/50 font-medium">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </div>
                                                    </td>

                                                    {/* Last activity */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-[#A67C52]/40 font-medium">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {user.updatedAt ? timeAgo(user.updatedAt) : timeAgo(user.createdAt)}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button
                                                                onClick={() => setSelectedUser(user)}
                                                                className="p-2 rounded-xl bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52] hover:bg-[#A67C52]/20 transition-all"
                                                                title="View Profile"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingUser({ ...user })}
                                                                className="p-2 rounded-xl bg-[#3D2B1F]/40 border border-[#3D2B1F]/60 text-[#A67C52]/60 hover:text-[#A67C52] hover:border-[#A67C52]/30 transition-all"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggle(user._id)}
                                                                className={`p-2 rounded-xl border transition-all ${user.isVerified
                                                                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20'
                                                                    : 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20'
                                                                    }`}
                                                                title={user.isVerified ? 'Suspend' : 'Reactivate'}
                                                            >
                                                                {user.isVerified ? <ShieldX className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingUser(user)}
                                                                className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>

                            {/* Footer */}
                            <div className="px-6 py-3 border-t border-[#3D2B1F]/30 bg-[#1A0F0E]/40 flex items-center justify-between">
                                <p className="text-[10px] text-[#A67C52]/40 font-medium">
                                    Showing <strong className="text-[#A67C52]/70">{filtered.length}</strong> of <strong className="text-[#A67C52]/70">{users.length}</strong> users
                                </p>
                                {selectedUser && (
                                    <button onClick={() => setSelectedUser(null)} className="text-[10px] text-[#A67C52]/50 hover:text-[#A67C52] font-bold transition-colors flex items-center gap-1">
                                        <X className="w-3 h-3" /> Close panel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Side Panel ───────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedUser && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px]"
                            onClick={() => setSelectedUser(null)}
                        />
                        <UserDetailPanel
                            user={selectedUser}
                            onClose={() => setSelectedUser(null)}
                            onToggle={handleToggle}
                            onDelete={setDeletingUser}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* ── Delete Modal ─────────────────────────────────────────── */}
            <AnimatePresence>
                {deletingUser && (
                    <DeleteModal
                        user={deletingUser}
                        onConfirm={() => handleDelete(deletingUser)}
                        onCancel={() => setDeletingUser(null)}
                    />
                )}
            </AnimatePresence>

            {/* ── Edit Modal ───────────────────────────────────────────── */}
            <AnimatePresence>
                {editingUser && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-md bg-[#150D0B] border border-[#3D2B1F] rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-[#EDE0D4]">Edit User</h2>
                                    <p className="text-[10px] text-[#A67C52]/50 mt-0.5">Modifying: {editingUser.name}</p>
                                </div>
                                <button onClick={() => setEditingUser(null)} className="p-2 rounded-xl hover:bg-white/5 text-[#A67C52]/50">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: 'Full Name', val: editingUser.name, set: (v: string) => setEditingUser(p => p ? { ...p, name: v } : null) },
                                    { label: 'Email Address', val: editingUser.email, set: (v: string) => setEditingUser(p => p ? { ...p, email: v } : null) },
                                ].map(f => (
                                    <div key={f.label} className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#A67C52] ml-0.5">{f.label}</label>
                                        <input
                                            className="w-full h-12 bg-[#0F0A08] border border-[#3D2B1F] rounded-2xl px-4 text-[#EDE0D4] text-sm focus:ring-1 focus:ring-[#A67C52] outline-none"
                                            value={f.val}
                                            onChange={e => f.set(e.target.value)}
                                        />
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-500/5 border border-orange-500/20">
                                    <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                                    <p className="text-[10px] text-orange-500/70 font-medium">Changing email may affect the user's login. Inform them accordingly.</p>
                                </div>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={savingEdit}
                                    className="w-full h-12 bg-gradient-to-r from-[#A67C52] to-[#7F5539] text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {savingEdit ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {savingEdit ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Shield, Camera, Save, X, Lock, Eye, EyeOff,
    Bell, Globe, Moon, Sun, Activity, CheckCircle, Clock, LogOut,
    Smartphone, Chrome, MapPin, ToggleLeft, ToggleRight, RefreshCw,
    Users, UserCheck, ClipboardList, Zap, Edit3, FileText
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { userService } from "@/lib/services/user.service";
import { adminService } from "@/lib/services/admin.service";
import { getPublicUrl } from "@/lib/utils";
import toast from "react-hot-toast";

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'activity', label: 'Admin Activity', icon: Activity },
];

// ─── Shared input ─────────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-[#A67C52] ml-0.5">{label}</label>
        {children}
    </div>
);

const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className={`w-full h-12 bg-[#0F0A08] border border-[#3D2B1F]/60 rounded-2xl px-4 text-[#EDE0D4] text-sm
            focus:outline-none focus:ring-1 focus:ring-[#A67C52]/60 transition-all placeholder:text-[#A67C52]/25 ${className}`}
        {...props}
    />
);

const Toggle = ({ enabled, onToggle, label, desc }: { enabled: boolean; onToggle: () => void; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#3D2B1F]/20 last:border-none">
        <div>
            <p className="text-sm font-bold text-[#EDE0D4]">{label}</p>
            {desc && <p className="text-[10px] text-[#A67C52]/50 mt-0.5">{desc}</p>}
        </div>
        <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${enabled ? 'bg-[#A67C52]' : 'bg-[#3D2B1F]/60'}`}
        >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-5' : 'left-0.5'}`} />
        </button>
    </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminProfilePage() {
    const { user, setUser } = useAppStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [stats, setStats] = useState<any>(null);

    // Profile form
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phoneNumber || '');
    const [bio, setBio] = useState(user.bio || '');
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Security form
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [twoFA, setTwoFA] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);

    // Preferences
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [language, setLanguage] = useState('en');
    const [notifications, setNotifications] = useState({
        newUser: true, helperVerification: true, communityReports: false, systemAlerts: true,
    });

    // Fetch live stats for left card
    useEffect(() => {
        adminService.getDashboardStats().then(res => { if (res.success) setStats(res.data); });
    }, []);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Only JPG, PNG, or WebP accepted'); return;
        }
        setAvatarPreview(URL.createObjectURL(file));
        const fd = new FormData();
        fd.append('profileImage', file);
        const res = await userService.uploadProfileImage(fd);
        if (res.success) { setUser({ ...user, profileImage: res.data.profileImage }); toast.success('Photo updated!'); }
        else toast.error(res.message);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const res = await userService.updateProfile({ name, email, phoneNumber: phone, bio });
            if (res.success) { setUser({ ...user, name, email, phoneNumber: phone, bio }); toast.success('Profile saved!'); }
            else toast.error(res.message);
        } finally { setSaving(false); }
    };

    const handleChangePassword = async () => {
        if (!currentPw || !newPw || !confirmPw) { toast.error('Fill all password fields'); return; }
        if (newPw !== confirmPw) { toast.error("New passwords don't match"); return; }
        if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
        setPwSaving(true);
        try {
            const res = await userService.changePassword({ currentPassword: currentPw, newPassword: newPw });
            if (res.success) { toast.success('Password updated!'); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
            else toast.error(res.message);
        } finally { setPwSaving(false); }
    };

    const avatarSrc = avatarPreview || getPublicUrl(user.profileImage) || '/images/avatar.png';

    // ──── Stat cards (left side) ─────────────────────────────────────────────
    const quickStats = [
        { label: 'Total Users', value: stats?.totalUsers ?? '-', icon: Users, color: '#A67C52' },
        { label: 'Active Helpers', value: stats?.totalHelpers ?? '-', icon: UserCheck, color: '#7F5539' },
        { label: 'Pending Apps', value: stats?.pendingApplications ?? '-', icon: ClipboardList, color: '#B08968' },
        { label: 'Active Now', value: stats?.activeNow ?? '-', icon: Zap, color: '#9C6644' },
    ];

    // ──── Recent activity (mock initially, can hook to real API) ─────────────
    const mockActivity = [
        { action: 'Approved Helper Application', time: 'Today, 10:24 AM', status: 'success', icon: CheckCircle },
        { action: 'Deleted Community Post', time: 'Yesterday, 3:10 PM', status: 'success', icon: FileText },
        { action: 'Updated Platform Settings', time: 'Mar 7, 9:00 AM', status: 'success', icon: Shield },
        { action: 'Rejected Helper Application', time: 'Mar 6, 2:45 PM', status: 'warning', icon: X },
        { action: 'Verified User Account', time: 'Mar 5, 11:30 AM', status: 'success', icon: CheckCircle },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 pb-10">

            {/* ══════════ LEFT — Identity Card ══════════ */}
            <div className="space-y-5">
                {/* Profile card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-[2rem] bg-[#1A0F0E]/60 border border-[#3D2B1F]/50 flex flex-col items-center text-center relative overflow-hidden"
                >
                    {/* Subtle glow backdrop */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#A67C52]/8 blur-3xl rounded-full pointer-events-none" />

                    {/* Avatar */}
                    <div className="relative group mb-5">
                        <img
                            src={avatarSrc}
                            alt={user.name}
                            className="w-28 h-28 rounded-[2rem] object-cover border-2 border-[#A67C52]/30 shadow-2xl shadow-[#A67C52]/10"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/avatar.png'; }}
                        />
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="absolute inset-0 rounded-[2rem] bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </button>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#A67C52] flex items-center justify-center border-2 border-[#0F0A08] shadow-md cursor-pointer"
                            onClick={() => fileRef.current?.click()}>
                            <Edit3 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
                    </div>

                    <h2 className="text-xl font-black text-[#EDE0D4] tracking-tight">{user.name}</h2>
                    <div className="flex items-center gap-1.5 mt-1.5 mb-1">
                        <Shield className="w-3.5 h-3.5 text-[#A67C52]" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#A67C52]">Super Admin</span>
                    </div>
                    <p className="text-xs text-[#A67C52]/50 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                    </p>

                    {user.bio && (
                        <p className="text-xs text-[#EDE0D4]/40 italic mt-4 leading-relaxed max-w-xs">{user.bio}</p>
                    )}

                    <div className="mt-5 w-full pt-5 border-t border-[#3D2B1F]/40">
                        <p className="text-[9px] uppercase font-black tracking-widest text-[#A67C52]/30 mb-2">Member Since</p>
                        <p className="text-sm font-bold text-[#EDE0D4]/60">
                            {user.createdAt ? new Date(user.createdAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Mar 2026'}
                        </p>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                    {quickStats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.07 }}
                            className="p-4 rounded-2xl bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 hover:border-[#A67C52]/30 transition-all group"
                        >
                            <s.icon className="w-4 h-4 mb-2 transition-transform group-hover:scale-110" style={{ color: s.color }} />
                            <p className="text-2xl font-black text-[#EDE0D4]">{s.value}</p>
                            <p className="text-[9px] text-[#A67C52]/50 font-bold uppercase tracking-wider mt-0.5">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Logout all devices */}
                <button className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all group">
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Logout Everywhere
                </button>
            </div>

            {/* ══════════ RIGHT — Tabbed Management ══════════ */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-0"
            >
                {/* Tab Bar */}
                <div className="flex gap-1 p-1.5 bg-[#1A0F0E]/60 border border-[#3D2B1F]/40 rounded-[1.5rem] mb-6">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex-1 flex items-center justify-center gap-2 h-10 rounded-[1.1rem] text-xs font-bold transition-all ${active ? 'text-[#EDE0D4]' : 'text-[#A67C52]/40 hover:text-[#A67C52]'}`}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="tab-pill"
                                        className="absolute inset-0 bg-[#A67C52]/15 border border-[#A67C52]/25 rounded-[1.1rem]"
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <Icon className={`w-3.5 h-3.5 relative z-10 ${active ? 'text-[#A67C52]' : ''}`} />
                                <span className="relative z-10 hidden sm:block">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {/* ─── PROFILE TAB ─── */}
                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 space-y-6"
                        >
                            <div>
                                <h3 className="text-lg font-black text-[#EDE0D4]">Personal Information</h3>
                                <p className="text-xs text-[#A67C52]/50 mt-0.5">Update your admin profile details</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Full Name">
                                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
                                </Field>
                                <Field label="Email Address">
                                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@mindcare.com" />
                                </Field>
                                <Field label="Phone Number">
                                    <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210" />
                                </Field>
                                <Field label="Role">
                                    <div className="h-12 bg-[#0F0A08]/60 border border-[#3D2B1F]/40 rounded-2xl px-4 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-[#A67C52]" />
                                        <span className="text-[#A67C52] text-sm font-black uppercase tracking-widest">Super Admin</span>
                                    </div>
                                </Field>
                            </div>

                            <Field label="Bio">
                                <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    rows={4}
                                    placeholder="Write a short bio…"
                                    className="w-full bg-[#0F0A08] border border-[#3D2B1F]/60 rounded-2xl px-4 py-3 text-[#EDE0D4] text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]/60 transition-all resize-none placeholder:text-[#A67C52]/25"
                                />
                            </Field>

                            <Field label="Profile Photo">
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="h-14 bg-[#0F0A08] border-2 border-dashed border-[#3D2B1F]/60 rounded-2xl flex items-center gap-3 px-5 cursor-pointer hover:border-[#A67C52]/40 hover:bg-[#A67C52]/5 transition-all"
                                >
                                    <Camera className="w-5 h-5 text-[#A67C52]/50" />
                                    <span className="text-sm text-[#A67C52]/50 font-medium">Upload JPG, PNG, or WebP</span>
                                    <span className="ml-auto text-[10px] text-[#A67C52]/30 font-bold uppercase tracking-widest">Max 5MB</span>
                                </div>
                            </Field>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="flex items-center gap-2 h-12 px-8 rounded-2xl bg-gradient-to-r from-[#A67C52] to-[#7F5539] text-white font-black text-sm shadow-lg shadow-[#A67C52]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                                >
                                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={() => { setName(user.name); setEmail(user.email); setPhone(user.phoneNumber || ''); setBio(user.bio || ''); }}
                                    className="flex items-center gap-2 h-12 px-6 rounded-2xl border border-[#3D2B1F]/60 text-[#A67C52]/60 font-bold text-sm hover:border-[#A67C52]/40 hover:text-[#A67C52] transition-all"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── SECURITY TAB ─── */}
                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-5"
                        >
                            {/* Change Password */}
                            <div className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 space-y-5">
                                <div>
                                    <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-[#A67C52]" /> Change Password
                                    </h3>
                                    <p className="text-xs text-[#A67C52]/40 mt-0.5">Use a strong password with letters, numbers & symbols</p>
                                </div>

                                {[
                                    { label: 'Current Password', val: currentPw, set: setCurrentPw, key: 'current' as const },
                                    { label: 'New Password', val: newPw, set: setNewPw, key: 'new' as const },
                                    { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw, key: 'confirm' as const },
                                ].map(f => (
                                    <Field key={f.key} label={f.label}>
                                        <div className="relative">
                                            <Input
                                                type={showPw[f.key] ? 'text' : 'password'}
                                                value={f.val}
                                                onChange={e => f.set(e.target.value)}
                                                placeholder="••••••••"
                                                className="pr-12"
                                            />
                                            <button
                                                onClick={() => setShowPw(p => ({ ...p, [f.key]: !p[f.key] }))}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A67C52]/40 hover:text-[#A67C52] transition-colors"
                                            >
                                                {showPw[f.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </Field>
                                ))}

                                {/* Password strength indicator */}
                                {newPw && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map(i => {
                                                const strength = [newPw.length >= 8, /[A-Z]/.test(newPw), /[0-9]/.test(newPw), /[^a-zA-Z0-9]/.test(newPw)];
                                                return (
                                                    <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${strength[i - 1] ? i <= 2 ? 'bg-orange-500' : 'bg-[#A67C52]' : 'bg-[#3D2B1F]/40'}`} />
                                                );
                                            })}
                                        </div>
                                        <p className="text-[10px] text-[#A67C52]/40">Include uppercase, numbers and symbols for a strong password</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleChangePassword}
                                    disabled={pwSaving}
                                    className="flex items-center gap-2 h-11 px-7 rounded-2xl bg-gradient-to-r from-[#A67C52] to-[#7F5539] text-white font-black text-sm shadow-lg shadow-[#A67C52]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
                                >
                                    {pwSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    {pwSaving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>

                            {/* 2FA */}
                            <div className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                                <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2 mb-1">
                                    <Smartphone className="w-4 h-4 text-[#A67C52]" /> Two-Factor Authentication
                                </h3>
                                <p className="text-xs text-[#A67C52]/40 mb-5">Add an extra layer of protection to your admin account</p>
                                <Toggle
                                    enabled={twoFA}
                                    onToggle={() => { setTwoFA(v => !v); toast.success(twoFA ? '2FA disabled' : '2FA enabled'); }}
                                    label="Enable 2FA via Authenticator App"
                                    desc="Uses TOTP — compatible with Google Authenticator, Authy"
                                />
                                {twoFA && (
                                    <div className="mt-4 p-4 rounded-2xl bg-[#A67C52]/10 border border-[#A67C52]/20">
                                        <p className="text-xs text-[#A67C52] font-medium">2FA is active. Your account is protected by an authenticator app.</p>
                                    </div>
                                )}
                            </div>

                            {/* Login Activity */}
                            <div className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                                <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                                    <Clock className="w-4 h-4 text-[#A67C52]" /> Recent Login Activity
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { browser: 'Chrome on Windows', when: 'Today, 10:15 AM', location: 'New Delhi, India', current: true },
                                        { browser: 'Safari on iPhone', when: 'Yesterday, 8:40 PM', location: 'Mumbai, India', current: false },
                                        { browser: 'Chrome on MacBook', when: 'Mar 6, 3:30 PM', location: 'Bengaluru, India', current: false },
                                    ].map((session, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F0A08]/60 border border-[#3D2B1F]/30">
                                            <div className="w-9 h-9 rounded-xl bg-[#A67C52]/10 border border-[#A67C52]/20 flex items-center justify-center shrink-0">
                                                <Chrome className="w-4 h-4 text-[#A67C52]" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-[#EDE0D4]">{session.browser}</p>
                                                <p className="text-[10px] text-[#A67C52]/50 flex items-center gap-1.5 mt-0.5">
                                                    <Clock className="w-3 h-3" />{session.when}
                                                    <span className="text-[#3D2B1F]">·</span>
                                                    <MapPin className="w-3 h-3" />{session.location}
                                                </p>
                                            </div>
                                            {session.current ? (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">Current</span>
                                            ) : (
                                                <button className="text-[9px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors">Revoke</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── PREFERENCES TAB ─── */}
                    {activeTab === 'preferences' && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-5"
                        >
                            {/* Theme */}
                            <div className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                                <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                                    <Moon className="w-4 h-4 text-[#A67C52]" /> Appearance
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'dark', label: 'Dark Mode', icon: Moon },
                                        { value: 'light', label: 'Light Mode', icon: Sun },
                                    ].map(t => (
                                        <button
                                            key={t.value}
                                            onClick={() => { setTheme(t.value as any); toast.success(`${t.label} selected`); }}
                                            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${theme === t.value
                                                ? 'bg-[#A67C52]/15 border-[#A67C52]/50 text-[#EDE0D4]'
                                                : 'bg-[#0F0A08]/60 border-[#3D2B1F]/40 text-[#A67C52]/50 hover:border-[#A67C52]/30'}`}
                                        >
                                            <t.icon className={`w-5 h-5 ${theme === t.value ? 'text-[#A67C52]' : ''}`} />
                                            <span className="font-bold text-sm">{t.label}</span>
                                            {theme === t.value && <CheckCircle className="w-4 h-4 text-[#A67C52] ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Language */}
                            <div className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                                <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                                    <Globe className="w-4 h-4 text-[#A67C52]" /> Language & Region
                                </h3>
                                <Field label="Display Language">
                                    <select
                                        value={language}
                                        onChange={e => setLanguage(e.target.value)}
                                        className="w-full h-12 bg-[#0F0A08] border border-[#3D2B1F]/60 rounded-2xl px-4 text-[#EDE0D4] text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]/60 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="en">🇺🇸 English</option>
                                        <option value="hi">🇮🇳 Hindi</option>
                                        <option value="es">🇪🇸 Spanish</option>
                                        <option value="fr">🇫🇷 French</option>
                                        <option value="de">🇩🇪 German</option>
                                        <option value="ja">🇯🇵 Japanese</option>
                                    </select>
                                </Field>
                            </div>

                            {/* Notifications */}
                            <div className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40">
                                <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2 mb-5">
                                    <Bell className="w-4 h-4 text-[#A67C52]" /> Notification Settings
                                </h3>
                                <Toggle
                                    enabled={notifications.newUser}
                                    onToggle={() => setNotifications(p => ({ ...p, newUser: !p.newUser }))}
                                    label="New User Signup Alerts"
                                    desc="Get notified when a new user registers"
                                />
                                <Toggle
                                    enabled={notifications.helperVerification}
                                    onToggle={() => setNotifications(p => ({ ...p, helperVerification: !p.helperVerification }))}
                                    label="Helper Verification Requests"
                                    desc="Alerts for new helper applications"
                                />
                                <Toggle
                                    enabled={notifications.communityReports}
                                    onToggle={() => setNotifications(p => ({ ...p, communityReports: !p.communityReports }))}
                                    label="Reported Community Posts"
                                    desc="Flagged content requiring review"
                                />
                                <Toggle
                                    enabled={notifications.systemAlerts}
                                    onToggle={() => setNotifications(p => ({ ...p, systemAlerts: !p.systemAlerts }))}
                                    label="System Alerts"
                                    desc="Critical platform alerts and updates"
                                />

                                <button
                                    onClick={() => toast.success('Notification preferences saved')}
                                    className="mt-5 flex items-center gap-2 h-11 px-7 rounded-2xl bg-[#A67C52]/15 border border-[#A67C52]/30 text-[#A67C52] font-black text-sm hover:bg-[#A67C52]/25 transition-all"
                                >
                                    <Save className="w-4 h-4" /> Save Preferences
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── ADMIN ACTIVITY TAB ─── */}
                    {activeTab === 'activity' && (
                        <motion.div
                            key="activity"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-8 rounded-[2rem] bg-[#1A0F0E]/40 border border-[#3D2B1F]/40 space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-black text-[#EDE0D4] flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-[#A67C52]" /> Recent Activity
                                    </h3>
                                    <p className="text-xs text-[#A67C52]/40 mt-0.5">Your admin actions and interventions</p>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-[#A67C52]/10 border border-[#A67C52]/20 text-[#A67C52]">
                                    {mockActivity.length} Actions
                                </span>
                            </div>

                            {/* Activity Table */}
                            <div className="rounded-[1.5rem] overflow-hidden border border-[#3D2B1F]/40">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#0F0A08]/80 border-b border-[#3D2B1F]/40">
                                            <th className="px-5 py-3.5 text-[#A67C52] font-black text-[10px] uppercase tracking-widest">Action</th>
                                            <th className="px-5 py-3.5 text-[#A67C52] font-black text-[10px] uppercase tracking-widest">Date</th>
                                            <th className="px-5 py-3.5 text-[#A67C52] font-black text-[10px] uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#3D2B1F]/20">
                                        {mockActivity.map((item, i) => (
                                            <motion.tr
                                                key={i}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.06 }}
                                                className="hover:bg-[#A67C52]/5 transition-colors"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-[#A67C52]/10 border border-[#A67C52]/20 flex items-center justify-center shrink-0">
                                                            <item.icon className="w-3.5 h-3.5 text-[#A67C52]" />
                                                        </div>
                                                        <span className="text-sm font-bold text-[#EDE0D4]">{item.action}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="text-xs text-[#A67C52]/60 font-medium">{item.time}</span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.status === 'success'
                                                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                                        : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                                        }`}>
                                                        <span className={`w-1 h-1 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-orange-400'}`} />
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-center text-[10px] text-[#A67C52]/30 font-medium">
                                Showing last {mockActivity.length} admin actions
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

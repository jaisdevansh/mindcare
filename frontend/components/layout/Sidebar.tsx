'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import {
    LayoutDashboard, Users, UserCheck, MessageSquareHeart,
    ClipboardList, BotMessageSquare, BarChart3, Flag,
    TrendingUp, Settings, Shield, User, HeartPlus,
    CalendarHeart, History, BotMessageSquare as AI,
    LogOut, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const NAV_LINKS = {
    user: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'New Assessment', href: '/assessment', icon: ClipboardList },
        { name: 'History', href: '/history', icon: History },
        { name: 'AI Listener', href: '/ai-chat', icon: BotMessageSquare },
        { name: 'Helpers', href: '/helpers', icon: HeartPlus },
        { name: 'Community', href: '/community', icon: MessageSquareHeart },
        { name: 'Profile', href: '/profile', icon: User },
    ],
    helper: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Sessions', href: '/helper-session', icon: CalendarHeart },
        { name: 'Community', href: '/community', icon: MessageSquareHeart },
        { name: 'Profile', href: '/profile', icon: User },
    ],
    admin: [
        {
            group: 'Overview',
            items: [
                { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            ]
        },
        {
            group: 'Management',
            items: [
                { name: 'Users', href: '/admin/users', icon: Users },
                { name: 'Helpers', href: '/admin/helpers', icon: UserCheck },
                { name: 'Community', href: '/admin/community', icon: MessageSquareHeart },
            ]
        },
        {
            group: 'Analytics',
            items: [
                { name: 'Assessments', href: '/admin/assessments', icon: ClipboardList },
                { name: 'AI Analytics', href: '/admin/ai-analytics', icon: BotMessageSquare },
                { name: 'Platform Growth', href: '/admin/analytics', icon: TrendingUp },
            ]
        },
        {
            group: 'Moderation',
            items: [
                { name: 'Reports', href: '/admin/reports', icon: Flag },
            ]
        },
        {
            group: 'System',
            items: [
                { name: 'Settings', href: '/admin/settings', icon: Settings },
                { name: 'Admin Profile', href: '/admin/profile', icon: User },
            ]
        }
    ],
};

export const Sidebar = ({ className }: { className?: string }) => {
    const pathname = usePathname();
    const { viewingRole, logout } = useAppStore();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const isAdmin = viewingRole === 'admin';
    const links = isAdmin ? null : (NAV_LINKS[viewingRole] as any[]) || NAV_LINKS.user;

    const handleLogout = () => { logout(); router.push('/login'); };

    const theme = isAdmin
        ? {
            aside: 'bg-[#0C0705] border-[#3D2B1F]/50',
            logo: 'from-[#A67C52] to-[#7F5539] shadow-[#A67C52]/30',
            logoText: 'from-[#EDE0D4] to-[#A67C52]',
            groupLabel: 'text-[#A67C52]/25',
            activeHighlight: 'bg-[#A67C52]/12 border border-[#A67C52]/25',
            activeIcon: 'text-[#A67C52]',
            activeText: 'text-[#EDE0D4]',
            inactiveText: 'text-[#A67C52]/40 hover:text-[#EDE0D4] hover:bg-[#A67C52]/8',
            divider: 'border-[#3D2B1F]/30',
            emergencyBg: 'bg-[#1A0F0E]/60 border-[#3D2B1F]/40',
        }
        : {
            aside: 'bg-black/20 border-white/10',
            logo: 'from-indigo-500 to-purple-600 shadow-indigo-500/30',
            logoText: 'from-indigo-200 to-white',
            groupLabel: 'text-slate-600',
            activeHighlight: 'bg-indigo-500/20 border border-indigo-500/30',
            activeIcon: 'text-indigo-400',
            activeText: 'text-white',
            inactiveText: 'text-slate-400 hover:text-white hover:bg-white/5',
            divider: 'border-white/5',
            emergencyBg: 'bg-white/5 border-white/10',
        };

    return (
        <aside className={cn(
            `${collapsed ? 'w-[72px]' : 'w-60'} h-screen max-h-screen sticky top-0 backdrop-blur-xl border-r flex flex-col pb-4 shadow-2xl z-20 transition-all duration-300`,
            theme.aside, className
        )}>
            {/* Logo Row */}
            <div className={cn("flex items-center pt-5 pb-4 px-4 shrink-0 border-b", theme.divider, collapsed ? 'justify-center' : 'justify-between')}>
                {!collapsed && (
                    <div className="flex items-center gap-2.5">
                        <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg shrink-0", theme.logo)}>
                            {isAdmin ? <Shield className="text-white w-4 h-4" /> : <HeartPlus className="text-white w-4 h-4" />}
                        </div>
                        <span className={cn("text-base font-black bg-clip-text text-transparent bg-gradient-to-r", theme.logoText)}>
                            MindCare
                        </span>
                    </div>
                )}
                {collapsed && (
                    <div className={cn("w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg", theme.logo)}>
                        {isAdmin ? <Shield className="text-white w-4 h-4" /> : <HeartPlus className="text-white w-4 h-4" />}
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(v => !v)}
                    className={cn("p-1.5 rounded-lg transition-colors hidden md:flex", isAdmin ? 'text-[#A67C52]/30 hover:text-[#A67C52] hover:bg-[#A67C52]/10' : 'text-slate-600 hover:text-slate-300 hover:bg-white/5')}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar px-2.5 py-3 space-y-0.5">
                {isAdmin ? (
                    // Admin grouped nav
                    (NAV_LINKS.admin as any[]).map((group, gi) => (
                        <div key={gi} className="mb-3">
                            {!collapsed && (
                                <p className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1.5", theme.groupLabel)}>
                                    {group.group}
                                </p>
                            )}
                            {group.items.map((link: any) => {
                                const isActive = link.href === '/admin'
                                    ? pathname === '/admin'
                                    : pathname.startsWith(link.href);
                                const Icon = link.icon;
                                return (
                                    <Link key={link.name} href={link.href} title={collapsed ? link.name : undefined}>
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                'relative flex items-center rounded-xl transition-all duration-150 mb-0.5',
                                                collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5',
                                                isActive ? theme.activeText : theme.inactiveText
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div layoutId="admin-active-pill"
                                                    className={cn("absolute inset-0 rounded-xl", theme.activeHighlight)}
                                                    transition={{ type: 'spring', stiffness: 350, damping: 32 }} />
                                            )}
                                            <Icon className={cn("w-4 h-4 relative z-10 shrink-0", isActive ? theme.activeIcon : '')} />
                                            {!collapsed && <span className="relative z-10 font-semibold text-[13px]">{link.name}</span>}
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    // Regular nav
                    <>
                        {!collapsed && (
                            <p className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-1.5 mb-1", theme.groupLabel)}>
                                {viewingRole} menu
                            </p>
                        )}
                        {(links as any[]).map((link: any) => {
                            const isActive = pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/');
                            const Icon = link.icon;
                            return (
                                <Link key={link.name} href={link.href} title={collapsed ? link.name : undefined}>
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            'relative flex items-center rounded-xl transition-all duration-150 mb-0.5',
                                            collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5',
                                            isActive ? theme.activeText : theme.inactiveText
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div layoutId="sidebar-active-pill"
                                                className={cn("absolute inset-0 rounded-xl", theme.activeHighlight)}
                                                transition={{ type: 'spring', stiffness: 350, damping: 32 }} />
                                        )}
                                        <Icon className={cn("w-4 h-4 relative z-10 shrink-0", isActive ? theme.activeIcon : '')} />
                                        {!collapsed && <span className="relative z-10 font-semibold text-[13px]">{link.name}</span>}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* Bottom */}
            <div className={cn("px-2.5 shrink-0 border-t pt-3 space-y-1", theme.divider)}>
                {isAdmin && !collapsed && (
                    <div className="px-3 py-2 rounded-xl border border-[#3D2B1F]/40 bg-[#1A0F0E]/40 mb-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#A67C52]/40">Admin Access</p>
                        <p className="text-[10px] text-[#A67C52]/50 font-medium">Full control enabled</p>
                    </div>
                )}
                {!collapsed && !isAdmin && (
                    <div className={cn("p-3 rounded-xl border mb-1", theme.emergencyBg)}>
                        <p className="text-[10px] font-semibold text-slate-300 mb-0.5">Emergency Help</p>
                        <p className="text-[9px] text-slate-500 leading-tight">Call 988 or your local emergency number.</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className={cn(
                        'w-full flex items-center rounded-xl transition-all text-red-400/50 hover:text-red-400 hover:bg-red-500/10',
                        collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'
                    )}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="text-[13px] font-semibold">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

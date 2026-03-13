'use client';

import React from 'react';
import { AdminGuard } from '@/components/layout/AdminGuard';
import { usePathname } from 'next/navigation';
import { Shield, Users, ClipboardList, LayoutDashboard, User, UserCheck, MessageSquareHeart, Activity, BotMessageSquare, TrendingUp, Flag, Settings } from 'lucide-react';
import Link from 'next/link';

const BREADCRUMBS: Record<string, { label: string; icon: any }> = {
    '/admin': { label: 'Admin Dashboard', icon: LayoutDashboard },
    '/admin/users': { label: 'Manage Users', icon: Users },
    '/admin/helpers': { label: 'Manage Helpers', icon: UserCheck },
    '/admin/applications': { label: 'Helper Applications', icon: ClipboardList },
    '/admin/community': { label: 'Community Moderation', icon: MessageSquareHeart },
    '/admin/assessments': { label: 'Assessments Analytics', icon: Activity },
    '/admin/ai-analytics': { label: 'AI Analytics', icon: BotMessageSquare },
    '/admin/analytics': { label: 'Platform Analytics', icon: TrendingUp },
    '/admin/reports': { label: 'Reports & Moderation', icon: Flag },
    '/admin/settings': { label: 'System Settings', icon: Settings },
    '/admin/profile': { label: 'Admin Profile', icon: User },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminContent>{children}</AdminContent>
        </AdminGuard>
    );
}

function AdminContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const current = BREADCRUMBS[pathname];

    return (
        <div className="flex-1 w-full min-h-full bg-[#0F0A08]/60 backdrop-blur-3xl">
            {/* Admin Header Banner */}
            <div className="px-6 md:px-10 pt-7 pb-5 border-b border-[#3D2B1F]/25">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/admin" className="flex items-center gap-1.5 text-[#A67C52]/35 hover:text-[#A67C52] transition-colors text-[10px] font-black uppercase tracking-widest">
                        <Shield className="w-3 h-3" /> Admin
                    </Link>
                    {pathname !== '/admin' && current && (
                        <>
                            <span className="text-[#3D2B1F] text-xs">/</span>
                            <span className="text-[#A67C52]/60 text-[10px] font-black uppercase tracking-widest">{current.label}</span>
                        </>
                    )}
                </div>
                {/* Title row */}
                <div className="flex items-center gap-4">
                    {current?.icon && (
                        <div className="p-2.5 rounded-2xl bg-[#A67C52]/10 border border-[#A67C52]/20 shrink-0">
                            <current.icon className="w-5 h-5 text-[#A67C52]" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#EDE0D4] tracking-tight leading-tight">
                            {current?.label || 'Admin Control Center'}
                        </h1>
                        <p className="text-[#A67C52]/35 font-medium mt-0.5 text-[10px] tracking-[0.2em] uppercase">
                            MindCare Platform Management
                        </p>
                    </div>
                </div>
            </div>

            {/* Page content */}
            <div className="px-6 md:px-10 py-7">
                {children}
            </div>
        </div>
    );
}

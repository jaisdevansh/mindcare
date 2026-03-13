'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Bell, LogOut, Shield } from 'lucide-react';
import { getPublicUrl } from '@/lib/utils';
import { motion } from 'framer-motion';

export const Topbar = () => {
    const { user, viewingRole, setViewingRole, logout } = useAppStore();
    const router = useRouter();
    const pathname = usePathname();

    const isAdmin = viewingRole === 'admin';

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Page title from pathname
    const pageTitle: Record<string, string> = {
        '/admin': 'Dashboard',
        '/admin/users': 'Manage Users',
        '/admin/applications': 'Helper Requests',
        '/dashboard': 'Dashboard',
        '/assessment': 'New Assessment',
        '/history': 'History',
        '/ai-chat': 'AI Listener',
        '/helpers': 'Helpers',
        '/community': 'Community',
        '/profile': 'Profile',
    };
    const currentPage = pageTitle[pathname] || 'MindCare';

    return (
        <header className={`h-16 w-full backdrop-blur-md border-b flex items-center justify-between px-6 sticky top-0 z-10 transition-all duration-500 ${isAdmin
            ? 'bg-[#100806]/80 border-[#3D2B1F]/40'
            : 'bg-black/10 border-white/5'
            }`}>

            {/* Left: greeting or page context */}
            <div className="flex items-center gap-4">
                <div>
                    <h2 className={`text-base font-black tracking-tight ${isAdmin ? 'text-[#EDE0D4]' : 'text-white'}`}>
                        {isAdmin
                            ? <span className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-[#A67C52]" />
                                {currentPage}
                            </span>
                            : <>Good to see you, <span className="text-[#7C5CFF]">{user.name?.split(' ')[0]}</span></>
                        }
                    </h2>
                    {isAdmin && (
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#A67C52]/40 leading-none mt-0.5">
                            Admin Control Center
                        </p>
                    )}
                </div>

                {/* Role switcher */}
                {user.role === 'admin' && (
                    <div className={`flex items-center gap-1 p-1 rounded-xl border ml-2 ${isAdmin ? 'bg-[#1A0F0E]/60 border-[#3D2B1F]/40' : 'bg-white/5 border-white/10'}`}>
                        <button
                            onClick={() => setViewingRole('user')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewingRole === 'user'
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            User
                        </button>
                        <button
                            onClick={() => setViewingRole('admin')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewingRole === 'admin'
                                ? 'bg-[#A67C52] text-white shadow-lg shadow-[#A67C52]/20'
                                : isAdmin ? 'text-[#A67C52]/50 hover:text-[#A67C52]' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Admin
                        </button>
                    </div>
                )}
                {user.role === 'helper' && (
                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 ml-2">
                        <button
                            onClick={() => setViewingRole('user')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewingRole === 'user' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Patient View
                        </button>
                        <button
                            onClick={() => setViewingRole('helper')}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${viewingRole === 'helper' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            Helper View
                        </button>
                    </div>
                )}
            </div>

            {/* Right: notifications + user */}
            <div className="flex items-center gap-4">
                {/* Bell */}
                <button className={`relative p-2 rounded-full border transition-all ${isAdmin
                    ? 'bg-[#1A0F0E]/60 border-[#3D2B1F]/40 hover:bg-[#A67C52]/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}>
                    <Bell className={`w-4 h-4 ${isAdmin ? 'text-[#A67C52]' : 'text-slate-300'}`} />
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                </button>

                {/* User info */}
                <div className={`flex items-center gap-3 pl-4 border-l ${isAdmin ? 'border-[#3D2B1F]/40' : 'border-white/10'}`}>
                    <div className="hidden md:flex flex-col text-right">
                        <span className={`text-sm font-bold leading-none ${isAdmin ? 'text-[#EDE0D4]' : 'text-white'}`}>
                            {user.name}
                        </span>
                        <span className={`text-[10px] mt-0.5 font-black uppercase tracking-widest ${isAdmin ? 'text-[#A67C52]' : 'text-slate-400'}`}>
                            {user.role}
                        </span>
                    </div>
                    <div className="relative">
                        <img
                            src={getPublicUrl(user.profileImage) || user.avatar || '/images/avatar.png'}
                            alt={user.name}
                            className={`w-9 h-9 rounded-full object-cover border-2 ${isAdmin ? 'border-[#A67C52]/50 shadow-lg shadow-[#A67C52]/10' : 'border-indigo-500/50'}`}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/avatar.png';
                            }}
                        />
                        {isAdmin && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#A67C52] border-2 border-[#100806] flex items-center justify-center">
                                <Shield className="w-2 h-2 text-white" />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`p-2 rounded-full transition-all ${isAdmin
                            ? 'text-[#A67C52]/40 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                            }`}
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
};

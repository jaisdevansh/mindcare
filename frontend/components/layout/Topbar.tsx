'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Bell, LogOut, Shield } from 'lucide-react';
import { getPublicUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { requestNotificationPermission } from '@/lib/fcm';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { notificationService, Notification } from '@/lib/services/notification.service';
import { formatDistanceToNow } from 'date-fns';

export const Topbar = () => {
    const { user, viewingRole, setViewingRole, logout } = useAppStore();
    const router = useRouter();
    const pathname = usePathname();
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const isAdmin = viewingRole === 'admin';

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    React.useEffect(() => {
        if (user && user.id) {
            // Fetch backend notifications
            const fetchNotifications = async () => {
                try {
                    const res = await notificationService.getNotifications();
                    if (res.success) {
                        setNotifications(res.data.notifications);
                        setUnreadCount(res.data.unreadCount);
                    }
                } catch (e) {
                    console.error('Error fetching notifications:', e);
                }
            };
            fetchNotifications();

            // Request push notification permissions
            requestNotificationPermission().then(token => {
                if (token) {
                    console.log("Got FCM token for user", user.id);
                }
            });

            // Listen for foreground messages
            const setupForegroundListener = async () => {
                const msg = await messaging();
                if (msg) {
                    onMessage(msg, (payload) => {
                        console.log("Foreground notification received:", payload);
                        fetchNotifications(); // Refresh list
                        toast.custom((t) => (
                            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-[#1A0F0E] shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-[#3D2B1F]/40 cursor-pointer`}
                                onClick={() => {
                                    toast.dismiss(t.id);
                                    if(payload.data?.link) router.push(payload.data.link);
                                }}>
                                <div className="flex-1 w-0 p-4">
                                    <div className="flex items-start">
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-white">{payload.notification?.title}</p>
                                            <p className="mt-1 text-sm text-slate-400">{payload.notification?.body}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ), { duration: 5000, position: 'top-right' });
                    });
                }
            };
            setupForegroundListener();
        }
    }, [user, router]);

    // Close dropdown on outside click
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.read) {
            await notificationService.markAsRead(notif._id);
            setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        if (notif.link) {
            router.push(notif.link);
            setIsDropdownOpen(false);
        }
    };

    const markAllRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
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
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`relative p-2 rounded-full border transition-all ${isAdmin
                            ? 'bg-[#1A0F0E]/60 border-[#3D2B1F]/40 hover:bg-[#A67C52]/10'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}>
                        <Bell className={`w-4 h-4 ${isAdmin ? 'text-[#A67C52]' : 'text-slate-300'}`} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] border border-black" />
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-3 w-80 bg-[#1A0F0E] border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col"
                            >
                                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllRead} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                                            Mark all read
                                        </button>
                                    )}
                                </div>

                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">
                                            No new notifications
                                        </div>
                                    ) : (
                                        <div className="flex flex-col divide-y divide-white/5">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => handleNotificationClick(notif)}
                                                    className={`p-4 hover:bg-white/[0.04] transition-colors cursor-pointer relative ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                                                >
                                                    {!notif.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.5)]" />}
                                                    <div className={`pl-3 ${!notif.read ? 'opacity-100' : 'opacity-60'}`}>
                                                        <h4 className="text-sm font-bold text-white mb-0.5">{notif.title}</h4>
                                                        <p className="text-xs text-slate-300 leading-relaxed mb-1.5">{notif.message}</p>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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

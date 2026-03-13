'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BackgroundEffects } from '@/components/landing/BackgroundEffects';
import { NeuralBrain } from '@/components/landing/NeuralBrain';

import { authService } from '@/lib/services/auth.service';
import { useAppStore } from '@/lib/store';

const PUBLIC_NAV_ROUTES = ['/', '/about', '/support', '/plans', '/share-space', '/talk-to-helper'];
const AUTH_ROUTES = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password', '/choose-mode', '/apply-helper'];

export const MainLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { setUser } = useAppStore();

    useEffect(() => {
        // Fast hydration: load user from localStorage immediately (before API)
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
            try {
                const parsed = JSON.parse(cachedUser);
                if (parsed?.email) setUser(parsed);
            } catch { /* ignore */ }
        }

        const token = localStorage.getItem('token');
        if (token) {
            authService.getMe().then(res => {
                if (res.success) {
                    setUser(res.data);
                    // Keep localStorage in sync with latest server data
                    localStorage.setItem('user', JSON.stringify(res.data));
                }
            }).catch(err => {
                console.error("Failed to hydrate user state:", err);
            });
        }
    }, [setUser]);

    const isPublicNavRoute = PUBLIC_NAV_ROUTES.includes(pathname);
    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // Auth pages (like /login)
    if (isAuthRoute) {
        return (
            <div className="min-h-screen bg-[#02040A] flex flex-col items-center justify-center relative overflow-hidden">
                <BackgroundEffects />
                <div className="absolute inset-0 z-0 opacity-[0.2]">
                    <NeuralBrain />
                </div>
                <div className="relative z-10 w-full flex flex-col items-center justify-center p-4">
                    {children}
                </div>
            </div>
        );
    }

    // Public/Landing pages (with Navbar and Footer + Deep Background Effects)
    if (isPublicNavRoute) {
        return (
            <div className="min-h-screen flex flex-col w-full text-white overflow-clip relative">
                <BackgroundEffects />
                <Navbar />
                <main className="flex-1 w-full pt-20 relative z-10">
                    {children}
                </main>
                <Footer />
            </div>
        );
    }

    // Dashboard / App pages (with Sidebar and Topbar fixed, Main area scrollable)
    return (
        <div className="flex h-screen w-full bg-[#0D1117] text-[#E6EDF3] overflow-hidden">
            <Sidebar className="hidden md:flex flex-shrink-0" />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 w-full custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
};

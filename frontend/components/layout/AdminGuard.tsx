'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import toast from 'react-hot-toast';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        const cachedUser = localStorage.getItem('user');
        const parsedUser = cachedUser ? JSON.parse(cachedUser) : null;

        if (!parsedUser || parsedUser.role !== 'admin') {
            toast.error("Access Denied: Admin privileges required.");
            router.push('/dashboard');
        }
    }, [user, router]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#02040A]">
                <div className="animate-pulse text-[#7C5CFF] text-xl font-bold tracking-widest uppercase">
                    Authenticating Admin...
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

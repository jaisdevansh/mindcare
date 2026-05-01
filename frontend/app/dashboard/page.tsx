'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { UserDashboard } from '@/components/dashboard/UserDashboard';

export default function DashboardPage() {
    const { viewingRole } = useAppStore();
    const router = useRouter();

    React.useEffect(() => {
        if (viewingRole === 'admin') {
            router.replace('/admin');
        } else if (viewingRole === 'helper') {
            router.replace('/helper/dashboard');
        }
    }, [viewingRole, router]);

    if (viewingRole === 'admin' || viewingRole === 'helper') {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A67C52]"></div>
            </div>
        );
    }

    return <UserDashboard />;
}

'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { HelperDashboard } from '@/components/dashboard/HelperDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function DashboardPage() {
    const { viewingRole } = useAppStore();

    if (viewingRole === 'helper') {
        return <HelperDashboard />;
    }

    if (viewingRole === 'admin') {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
}

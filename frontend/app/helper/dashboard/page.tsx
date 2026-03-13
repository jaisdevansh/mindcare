'use client';

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Inbox, Star, MessageCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function HelperDashboardPage() {
    const { user } = useAppStore();
    const router = useRouter();

    // Auth Guard: Only accessible by helper
    useEffect(() => {
        if (user.role !== 'helper') {
            router.replace('/dashboard');
        }
    }, [user.role, router]);

    if (user.role !== 'helper') {
        return (
            <div className="flex w-full min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-[#ef4444] mb-4" />
                <h2 className="text-2xl font-bold text-[#E6EDF3] mb-2">Access Denied</h2>
                <p className="text-[#9DA7B3]">You do not have permission to view the Helper Dashboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-inter text-[#E6EDF3] leading-tight">
                    Helper Dashboard
                </h1>
                <p className="text-[#9DA7B3] mt-2">Manage your support requests and active conversations.</p>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-[#161B22] border-[#30363D]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#9DA7B3] font-medium text-sm text-center">Incoming Requests</span>
                            <Inbox className="w-4 h-4 text-[#9DA7B3]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold font-jetbrains text-[#E6EDF3]">12</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#161B22] border-[#30363D]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#9DA7B3] font-medium text-sm text-center">Active Conversations</span>
                            <MessageSquare className="w-4 h-4 text-[#9DA7B3]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold font-jetbrains text-[#E6EDF3]">3</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#161B22] border-[#30363D]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#9DA7B3] font-medium text-sm text-center">Helper Rating</span>
                            <Star className="w-4 h-4 text-[#9DA7B3]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold font-jetbrains text-[#E6EDF3]">
                                {user.helperStats?.rating ?? '4.9'}
                            </span>
                            <span className="text-[#2563EB] text-sm font-medium">Top 5%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#161B22] border-[#30363D]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[#9DA7B3] font-medium text-sm text-center">Total Sessions</span>
                            <MessageCircle className="w-4 h-4 text-[#9DA7B3]" />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold font-jetbrains text-[#E6EDF3]">
                                {user.helperStats?.sessions ?? 42}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Incoming Requests Feed */}
                <Card className="bg-[#161B22] border-[#30363D] flex flex-col h-[400px]">
                    <CardHeader className="border-b border-[#30363D]">
                        <CardTitle>Incoming Support Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Mock Items */}
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-[#0D1117] border border-[#30363D]">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded-full bg-[#ef4444]/10 text-[#ef4444] text-[10px] uppercase font-bold tracking-wider">High Priority</span>
                                        <span className="text-[#9DA7B3] text-xs">2 mins ago</span>
                                    </div>
                                    <p className="text-sm text-[#E6EDF3]">"I am dealing with overwhelming anxiety at work today and just need someone to listen..."</p>
                                </div>
                                <div className="flex shrink-0 items-center justify-center">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto">Accept Request</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* User Feedback */}
                <Card className="bg-[#161B22] border-[#30363D] flex flex-col h-[400px]">
                    <CardHeader className="border-b border-[#30363D]">
                        <CardTitle>Recent User Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Mock Items */}
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col gap-2 p-4 rounded-lg bg-[#0D1117] border border-[#30363D]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[#F59E0B]">
                                        {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-[#9DA7B3] text-xs">Yesterday</span>
                                </div>
                                <p className="text-sm text-[#E6EDF3] italic">"Really helped me ground myself during a panic attack. So patient and understanding."</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}

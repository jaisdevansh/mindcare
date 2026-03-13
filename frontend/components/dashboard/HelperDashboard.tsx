'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { Activity, Clock, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HelperDashboard = () => {
    const { user } = useAppStore();
    const stats = user.helperStats || { sessions: 0, rating: 0, hours: 0, earnings: 0 };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-8 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
                <h2 className="text-2xl font-bold text-white mb-2">Helper Dashboard</h2>
                <p className="text-slate-300">Thank you for supporting the community. You are currently visible and available for sessions.</p>
                <div className="mt-6 flex space-x-4">
                    <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700">Go Offline</Button>
                    <Button variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200">View Pending Requests</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Sessions</CardTitle>
                        <Users className="w-4 h-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.sessions}</div>
                        <p className="text-xs text-slate-500 mt-1">+2 this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Average Rating</CardTitle>
                        <Star className="w-4 h-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.rating.toFixed(1)}</div>
                        <p className="text-xs text-slate-500 mt-1">From 8 reviews</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Hours Supported</CardTitle>
                        <Clock className="w-4 h-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats.hours}</div>
                        <p className="text-xs text-slate-500 mt-1">Across all sessions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Earnings (Simulated)</CardTitle>
                        <Activity className="w-4 h-4 text-rose-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">${stats.earnings}</div>
                        <p className="text-xs text-slate-500 mt-1">Pending payout: $45</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

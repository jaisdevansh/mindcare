'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Inbox, Star, MessageCircle, AlertCircle, Loader2, UserCircle2, Clock, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { helperService } from '@/lib/services/helper.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface SupportRequest {
    _id: string;
    userId: { _id: string; name: string };
    subject: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
}

interface ActiveConversation {
    _id: string;
    userId: { _id: string; name: string };
    lastMessage?: string;
    updatedAt: string;
}

export default function HelperDashboardPage() {
    const { user } = useAppStore();
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ incomingCount: 0, activeCount: 0, rating: 5.0, totalSessions: 0 });
    const [incomingRequests, setIncomingRequests] = useState<SupportRequest[]>([]);
    const [activeConversations, setActiveConversations] = useState<ActiveConversation[]>([]);
    const [acceptingId, setAcceptingId] = useState<string | null>(null);

    // Auth Guard: Only accessible by helper
    useEffect(() => {
        if (user && user.role !== 'helper') {
            router.replace('/dashboard');
        }
    }, [user, router]);

    const fetchData = async () => {
        try {
            const res = await helperService.getDashboardStats();
            if (res.success) {
                setStats(res.data.stats);
                setIncomingRequests(res.data.incomingRequests);
                setActiveConversations(res.data.activeConversations);
            }
        } catch (err) {
            console.error("Failed to fetch helper dashboard stats:", err);
            toast.error("Could not load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'helper') {
            fetchData();
        }
    }, [user?.role]);

    const handleAccept = async (sessionId: string) => {
        setAcceptingId(sessionId);
        try {
            const res = await helperService.acceptSupportRequest(sessionId);
            if (res.success) {
                toast.success("Request accepted! Starting conversation...");
                // Redirect to chat with this user
                router.push(`/ai-chat?session=${sessionId}`);
            } else {
                toast.error(res.message || "Failed to accept request.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setAcceptingId(null);
            fetchData(); // Refresh list
        }
    };

    if (!user || user.role !== 'helper') {
        return (
            <div className="flex w-full min-h-[60vh] flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-[#ef4444] mb-4" />
                <h2 className="text-2xl font-bold text-[#E6EDF3] mb-2">Access Denied</h2>
                <p className="text-[#9DA7B3]">You do not have permission to view the Helper Dashboard.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex w-full min-h-[60vh] flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#7C5CFF] animate-spin mb-4" />
                <p className="text-[#9DA7B3] font-medium animate-pulse uppercase tracking-widest text-[10px]">Syncing Helper Portal...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#EDE0D4] tracking-tight">
                        Helper Dashboard
                    </h1>
                    <p className="text-[#A67C52]/60 mt-1 text-sm font-medium">Manage your support requests and active conversations.</p>
                </div>
                <Button onClick={fetchData} variant="outline" className="h-10 border-[#3D2B1F] bg-[#1A0F0E]/40 text-[#A67C52] hover:bg-[#A67C52]/10">
                    Refresh Data
                </Button>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Incoming Requests', value: stats.incomingCount, icon: Inbox, color: 'text-rose-400' },
                    { label: 'Active Conversations', value: stats.activeCount, icon: MessageSquare, color: 'text-emerald-400' },
                    { label: 'Helper Rating', value: stats.rating.toFixed(1), icon: Star, color: 'text-amber-400', sub: 'Top 5%' },
                    { label: 'Total Sessions', value: stats.totalSessions, icon: MessageCircle, color: 'text-indigo-400' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#1A0F0E]/40 border-[#3D2B1F]/40 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[#A67C52]/60 font-black uppercase tracking-widest text-[9px]">{stat.label}</span>
                                <stat.icon className={`w-4 h-4 ${stat.color} opacity-80`} />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-[#EDE0D4]">{stat.value}</span>
                                {stat.sub && <span className="text-[10px] font-bold text-emerald-500/80">{stat.sub}</span>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Incoming Requests Feed */}
                <Card className="bg-[#1A0F0E]/40 border-[#3D2B1F]/40 flex flex-col h-[500px] rounded-[2rem] overflow-hidden">
                    <CardHeader className="border-b border-[#3D2B1F]/40 py-5">
                        <CardTitle className="text-base font-black text-[#EDE0D4] flex items-center gap-2">
                            <Inbox className="w-4 h-4 text-[#A67C52]" /> Incoming Support Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {incomingRequests.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                                <div className="w-16 h-16 rounded-full bg-[#3D2B1F]/20 flex items-center justify-center mb-4">
                                    <Clock className="w-8 h-8 text-[#A67C52]/40" />
                                </div>
                                <h3 className="text-[#EDE0D4] font-bold">No Pending Requests</h3>
                                <p className="text-[#A67C52]/40 text-xs mt-1">Check back later or refresh for new incoming calls.</p>
                            </div>
                        ) : (
                            incomingRequests.map((req) => (
                                <div key={req._id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-[#0F0807] border border-[#3D2B1F]/30 hover:border-[#A67C52]/30 transition-all group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest ${
                                                req.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                                {req.priority || 'Medium'} Priority
                                            </span>
                                            <span className="text-[#A67C52]/40 text-[10px] font-bold">
                                                {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#EDE0D4]/80 italic leading-relaxed mb-1">
                                            "{req.subject || 'Seeking emotional support and someone to talk to.'}"
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-3">
                                            <UserCircle2 className="w-3 h-3 text-[#A67C52]/60" />
                                            <span className="text-[10px] font-black text-[#A67C52]/40 uppercase tracking-widest">
                                                Request by {req.userId?.name || 'Anonymous User'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center justify-center">
                                        <Button 
                                            onClick={() => handleAccept(req._id)}
                                            disabled={acceptingId === req._id}
                                            className="w-full sm:w-auto h-10 px-5 bg-[#A67C52] hover:bg-[#8B6544] text-white font-black text-xs rounded-xl shadow-lg shadow-[#A67C52]/10 transition-all uppercase tracking-widest"
                                        >
                                            {acceptingId === req._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept Call'}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Active Conversations */}
                <Card className="bg-[#1A0F0E]/40 border-[#3D2B1F]/40 flex flex-col h-[500px] rounded-[2rem] overflow-hidden">
                    <CardHeader className="border-b border-[#3D2B1F]/40 py-5">
                        <CardTitle className="text-base font-black text-[#EDE0D4] flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-emerald-500" /> Active Conversations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {activeConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-10">
                                <div className="w-16 h-16 rounded-full bg-[#3D2B1F]/20 flex items-center justify-center mb-4">
                                    <MessageSquare className="w-8 h-8 text-[#A67C52]/40" />
                                </div>
                                <h3 className="text-[#EDE0D4] font-bold">No Active Chats</h3>
                                <p className="text-[#A67C52]/40 text-xs mt-1">Accept a request to begin helping a community member.</p>
                            </div>
                        ) : (
                            activeConversations.map((conv) => (
                                <div 
                                    key={conv._id} 
                                    onClick={() => router.push(`/ai-chat?session=${conv._id}`)}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F0807]/60 border border-[#3D2B1F]/20 hover:border-[#A67C52]/40 hover:bg-[#A67C52]/5 transition-all cursor-pointer group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1A0F0E] to-[#3D2B1F] flex items-center justify-center border border-[#3D2B1F]/40 shrink-0">
                                        <UserCircle2 className="w-6 h-6 text-[#A67C52]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="text-sm font-black text-[#EDE0D4] group-hover:text-[#A67C52] transition-colors">
                                                {conv.userId?.name || 'User'}
                                            </h4>
                                            <span className="text-[9px] font-black text-[#A67C52]/40 uppercase tracking-widest">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#A67C52]/60 truncate font-medium">
                                            Continue your support session with this member.
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[#A67C52]/30 group-hover:text-[#A67C52] transition-all" />
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

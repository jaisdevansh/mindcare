'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BadgeCheck, Star, Users, MessageCircle } from 'lucide-react';
import { getPublicUrl } from '@/lib/utils';
import Link from 'next/link';

export const HelperCard = ({ helper }: { helper: any }) => {
    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                        <img
                            src={getPublicUrl(helper.profileImage) || helper.avatar || '/images/avatar.png'}
                            alt={helper.name}
                            className="w-16 h-16 rounded-full border-2 border-indigo-500/50 object-cover shadow-lg"
                        />
                        {helper.available && (
                            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#1e293b]" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 truncate">
                            {helper.name}
                            {helper.verified && <BadgeCheck className="w-4 h-4 text-indigo-400 shrink-0" />}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> {helper.rating}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3 text-indigo-400" /> {helper.sessions} sessions</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-slate-300 mb-6 flex-1 italic line-clamp-3">"{helper.bio}"</p>

                <Link href={`/helper-session/${helper.id}`} className="w-full mt-auto">
                    <Button
                        className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 flex items-center justify-center gap-2"
                        disabled={!helper.available}
                    >
                        <MessageCircle className="w-4 h-4" />
                        {helper.available ? 'Start Session' : 'Offline'}
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

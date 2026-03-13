'use client';

import React from 'react';
import { HelperChatUI } from '@/components/chat/HelperChatUI';
import { mockHelpers } from '@/lib/mockData';
import { useParams } from 'next/navigation';
import { HeartHandshake } from 'lucide-react';

export default function HelperSessionPage() {
    const params = useParams();
    const id = params?.id as string;

    const helper = mockHelpers.find(h => h.id === id) || {
        name: 'Peer Supporter',
        avatar: 'https://i.pravatar.cc/150'
    };

    return (
        <div className="max-w-5xl mx-auto h-full flex flex-col pt-2">
            <div className="flex items-center gap-3 mb-4 shrink-0">
                <HeartHandshake className="w-6 h-6 text-indigo-400" />
                <div>
                    <h1 className="text-xl font-bold text-white leading-tight">Support Session</h1>
                    <p className="text-xs text-slate-400">Connected peer-to-peer securely.</p>
                </div>
            </div>

            <HelperChatUI helperName={helper.name} avatar={helper.avatar} />
        </div>
    );
}

'use client';

import React from 'react';
import { AIChatUI } from '@/components/chat/AIChatUI';
import { BotMessageSquare } from 'lucide-react';

export default function AIChatPage() {
    return (
        <div className="max-w-4xl mx-auto h-full flex flex-col pt-4">
            <div className="flex items-center gap-3 mb-6">
                <BotMessageSquare className="w-8 h-8 text-emerald-400" />
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Listener</h1>
                    <p className="text-sm text-slate-400">A safe, non-judgmental space to share your thoughts.</p>
                </div>
            </div>

            <AIChatUI />
        </div>
    );
}

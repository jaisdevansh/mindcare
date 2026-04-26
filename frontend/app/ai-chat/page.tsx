'use client';

import React from 'react';
import { AIChatUI } from '@/components/chat/AIChatUI';

export default function AIChatPage() {
    return (
        <div className="max-w-3xl mx-auto h-full flex flex-col pt-2 px-2">
            <AIChatUI />
        </div>
    );
}

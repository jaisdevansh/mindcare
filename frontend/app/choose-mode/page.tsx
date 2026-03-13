'use client';

import React, { useState } from 'react';
import { BotMessageSquare, ShieldCheck } from 'lucide-react';
import { ModeCard } from '@/components/ModeCard';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useAppStore, Role } from '@/lib/store';

export default function ChooseModePage() {
    const [selected, setSelected] = useState<Role | null>(null);
    const router = useRouter();
    const { setViewingRole } = useAppStore();

    const handleContinue = () => {
        if (!selected) return;
        setViewingRole(selected);
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#161B22] via-[#0D1117] to-[#0D1117]">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold font-inter text-[#E6EDF3] mb-4">
                        Choose how you want to continue
                    </h1>
                    <p className="text-[#9DA7B3] text-lg max-w-xl mx-auto">
                        Helpers can access both the normal user experience and the helper support dashboard.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <ModeCard
                        title="User Mode"
                        description="Access community, mood tracker, and support features."
                        icon={BotMessageSquare}
                        bg="bg-[#2563EB]/10"
                        color="text-[#2563EB]"
                        isActive={selected === 'user'}
                        onClick={() => setSelected('user')}
                    />
                    <ModeCard
                        title="Helper Mode"
                        description="Help users, manage support requests, and chat with people who need help."
                        icon={ShieldCheck}
                        bg="bg-[#6366F1]/10"
                        color="text-[#6366F1]"
                        isActive={selected === 'helper'}
                        onClick={() => setSelected('helper')}
                    />
                </div>

                <div className="flex justify-center">
                    <Button
                        size="lg"
                        fullWidth
                        className="max-w-md h-14 text-lg font-semibold"
                        disabled={!selected}
                        onClick={handleContinue}
                    >
                        {selected === 'user' ? 'Enter User Dashboard' : selected === 'helper' ? 'Enter Helper Dashboard' : 'Select a Mode'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

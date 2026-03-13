import React from 'react';
import { Card } from '@/components/ui/Card';
import { BotMessageSquare } from 'lucide-react';

interface AuthCardProps {
    title: string;
    description: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    oauth?: React.ReactNode;
}

export function AuthCard({ title, description, children, footer, oauth }: AuthCardProps) {
    return (
        <div className="flex min-h-screen bg-[#0D1117] flex-col lg:flex-row font-inter">
            {/* Branding Section (Desktop only) */}
            <div className="lg:w-1/2 hidden lg:flex flex-col justify-center items-center p-12 relative border-r border-[#30363D] overflow-hidden">
                {/* Subtle abstract shapes for SaaS look */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#6366F1]/5 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-md text-left w-full">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-[#2563EB] flex items-center justify-center border border-[#1D4ED8] shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                            <BotMessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#E6EDF3]">MindCare</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight mb-4 text-[#E6EDF3]">
                        Your safe space for mental support.
                    </h1>
                    <p className="text-[#9DA7B3] text-lg leading-relaxed">
                        Connect with verified helpers, chat securely, and take control of your psychological well-being.
                    </p>
                </div>
            </div>

            {/* Auth Form Section */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 w-full">
                {/* Mobile Header (Logo and Title at the top) */}
                <div className="lg:hidden flex flex-col items-center mb-10 w-full mt-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center border border-[#1D4ED8] mb-4">
                        <BotMessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#E6EDF3]">MindCare</span>
                </div>

                <div className="w-full max-w-[400px]">
                    <div className="mb-8 lg:mb-6 lg:text-left text-center">
                        <h2 className="text-2xl font-bold text-[#E6EDF3]">{title}</h2>
                        <p className="text-[#9DA7B3] text-sm mt-2">{description}</p>
                    </div>

                    <Card className="p-7 w-full border-[#30363D] shadow-xl bg-[#161B22] mb-6 rounded-xl">
                        {children}
                    </Card>

                    {oauth && (
                        <div className="mb-6 w-full">
                            {oauth}
                        </div>
                    )}

                    {footer && (
                        <div className="mt-6 text-center text-sm w-full font-medium">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

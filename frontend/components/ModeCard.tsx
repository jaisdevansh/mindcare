import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface ModeCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bg: string;
    isActive?: boolean;
    onClick: () => void;
}

export const ModeCard = ({ title, description, icon: Icon, color, bg, isActive, onClick }: ModeCardProps) => {
    return (
        <Card
            onClick={onClick}
            className={`cursor-pointer transition-all border w-full flex-1 ${isActive ? 'border-[#2563EB] bg-[#1c222c]' : 'border-[#30363D] hover:border-[#2563EB]/50'}`}
        >
            <CardHeader className="flex flex-col items-center text-center p-8 gap-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${bg}`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <div>
                    <CardTitle className="text-xl mb-2">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
        </Card>
    );
};

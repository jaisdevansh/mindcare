import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardProps } from './Card';

export const GlassCard = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Card
                ref={ref}
                className={cn(
                    'bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative group transition-all duration-300',
                    className
                )}
                {...props}
            >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">{children}</div>
            </Card>
        );
    }
);
GlassCard.displayName = 'GlassCard';

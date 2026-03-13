import React from 'react';
import { Button, ButtonProps } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuthButtonProps extends ButtonProps {
    isLoading?: boolean;
}

export const AuthButton = ({ children, isLoading, className, variant = "default", fullWidth = true, ...props }: AuthButtonProps) => {
    return (
        <Button
            variant={variant}
            fullWidth={fullWidth}
            className={cn("h-11 font-semibold transition-transform active:scale-[0.98]", className)}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#6366F1]" /> : children}
        </Button>
    );
};

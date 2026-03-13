import React, { forwardRef } from 'react';
import { Input, InputProps } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export interface AuthInputProps extends InputProps {
    label: string;
    error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        return (
            <div className="flex flex-col space-y-1.5 w-full">
                <label htmlFor={id} className="text-sm font-medium text-[#E6EDF3]">
                    {label}
                </label>
                <Input
                    id={id}
                    ref={ref}
                    className={cn(
                        error && 'border-[#ef4444] focus-visible:ring-[#ef4444]',
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-[#ef4444] mt-1">{error}</span>}
            </div>
        );
    }
);
AuthInput.displayName = 'AuthInput';

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    disabled?: boolean;
}

export const OtpInput = ({ length = 6, onComplete, disabled }: OtpInputProps) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.nextSibling && element.value !== '') {
            (element.nextSibling as HTMLInputElement).focus();
        }

        if (newOtp.every(val => val !== '')) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    return (
        <div className="flex justify-between gap-2 max-w-sm mx-auto">
            {otp.map((data, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    disabled={disabled}
                    ref={(ref) => { inputRefs.current[index] = ref; }}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className={cn(
                        "w-12 h-14 md:w-14 md:h-16 text-center text-xl font-bold font-jetbrains rounded-xl border transition-all duration-200",
                        "bg-white/[0.05] border-white/10 text-white placeholder:text-white/20",
                        "focus:bg-white/[0.08] focus:border-[#7C5CFF] focus:ring-4 focus:ring-[#7C5CFF]/20 focus:outline-none",
                        disabled && "opacity-50 cursor-not-allowed bg-white/[0.02]"
                    )}
                />
            ))}
        </div>
    );
};

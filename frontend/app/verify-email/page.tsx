'use client';

import React, { useState } from 'react';
import { AuthCard } from '@/components/AuthCard';
import { AuthButton } from '@/components/AuthButton';
import { OtpInput } from '@/components/OtpInput';
import { MailCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleComplete = (otp: string) => {
        setIsLoading(true);
        // Simulate verification
        setTimeout(() => {
            setIsLoading(false);
            if (otp === '123456') {
                toast.success("Email verified successfully");
                router.push('/dashboard');
            } else {
                toast.error("Invalid OTP. Try 123456.");
            }
        }, 1500);
    };

    const handleResend = () => {
        toast.success("Verification link sent!");
    };

    return (
        <AuthCard
            title="Verify your email"
            description="We've sent a 6-digit verification code to your email address."
        >
            <div className="flex flex-col items-center justify-center space-y-5">
                <div className="w-14 h-14 bg-[#0D1117] border border-[#30363D] rounded-xl flex items-center justify-center mb-1">
                    <MailCheck className="w-7 h-7 text-[#2563EB]" />
                </div>

                <div className="w-full">
                    <OtpInput length={6} onComplete={handleComplete} />
                </div>

                <div className="w-full relative py-2 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#30363D]"></div>
                    </div>
                    <div className="relative flex justify-center text-xs font-semibold">
                        <span className="px-3 bg-[#161B22] text-[#6B7280]">OR</span>
                    </div>
                </div>

                <div className="w-full text-center space-y-4 pt-1">
                    <p className="text-[13px] text-[#9DA7B3] font-medium">
                        Check your email for a verification link.
                    </p>
                    <AuthButton variant="secondary" fullWidth onClick={handleResend} isLoading={isLoading}>
                        Resend OTP
                    </AuthButton>
                </div>
            </div>
        </AuthCard>
    );
}

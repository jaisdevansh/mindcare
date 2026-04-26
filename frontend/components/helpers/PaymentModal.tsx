'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Phone, Loader2, ShieldCheck, IndianRupee } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import toast from 'react-hot-toast';

interface Helper { _id: string; name: string; }
interface Props { helper: Helper; onClose: () => void; onSuccess: (type: 'chat' | 'call', sessionToken: string) => void; }

const PLANS = [
    { type: 'chat' as const, label: 'Text Chat', price: 10, duration: 'Unlimited messages', icon: MessageCircle, color: 'from-[#7C5CFF] to-[#5B6CFF]', glow: 'shadow-[#7C5CFF]/20' },
    { type: 'call' as const, label: 'Voice Call', price: 30, duration: '30 minutes session', icon: Phone, color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
];

declare global { interface Window { Razorpay: any; } }

export const PaymentModal = ({ helper, onClose, onSuccess }: Props) => {
    const [selected, setSelected] = useState<'chat' | 'call' | null>(null);
    const [loading, setLoading] = useState(false);

    const loadRazorpay = () =>
        new Promise<boolean>(resolve => {
            if (window.Razorpay) return resolve(true);
            const s = document.createElement('script');
            s.src = 'https://checkout.razorpay.com/v1/checkout.js';
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });

    const handlePay = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            const loaded = await loadRazorpay();
            if (!loaded) { toast.error('Payment gateway failed to load'); return; }

            const res = await apiFetch('/payment/create-order', {
                method: 'POST',
                body: JSON.stringify({ type: selected, helperId: helper._id }),
            });

            if (!res.success) { toast.error(res.message || 'Could not create order'); return; }

            const { orderId, amount, currency, keyId } = res.data;
            const plan = PLANS.find(p => p.type === selected)!;

            const options = {
                key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount,
                currency,
                name: 'MindCare',
                description: `${plan.label} with ${helper.name}`,
                order_id: orderId,
                theme: { color: '#7C5CFF' },
                handler: async (response: any) => {
                    const verifyRes = await apiFetch('/payment/verify', {
                        method: 'POST',
                        body: JSON.stringify({
                            ...response,
                            type: selected,
                            helperId: helper._id,
                        }),
                    });
                    if (verifyRes.success) {
                        toast.success('Payment successful! Starting session…');
                        onSuccess(selected, verifyRes.data.sessionToken);
                    } else {
                        toast.error('Payment verification failed');
                    }
                },
                modal: { ondismiss: () => setLoading(false) },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" />
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative w-full max-w-sm bg-[#080D1A] border border-white/[0.08] rounded-[2rem] p-6 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-black text-white">Connect with Helper</h2>
                        <p className="text-xs text-[#9DA7B3] mt-0.5">{helper.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-[#9DA7B3] transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Plan Cards */}
                <div className="space-y-3 mb-5">
                    {PLANS.map(plan => {
                        const Icon = plan.icon;
                        const isSelected = selected === plan.type;
                        return (
                            <button
                                key={plan.type}
                                onClick={() => setSelected(plan.type)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                                    isSelected
                                        ? 'border-[#7C5CFF]/60 bg-[#7C5CFF]/10'
                                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                                }`}
                            >
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg ${plan.glow} shrink-0`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-white text-sm">{plan.label}</p>
                                    <p className="text-[11px] text-[#9DA7B3]">{plan.duration}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-0.5 text-white font-black text-lg">
                                        <IndianRupee className="w-4 h-4" />
                                        {plan.price}
                                    </div>
                                    <p className="text-[10px] text-[#9DA7B3]">one time</p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${isSelected ? 'border-[#7C5CFF] bg-[#7C5CFF]' : 'border-white/20'}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-2 mb-4 px-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <p className="text-[10px] text-[#9DA7B3]">Secured by Razorpay · 100% encrypted payment</p>
                </div>

                {/* Pay Button */}
                <motion.button
                    whileHover={{ scale: selected ? 1.02 : 1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handlePay}
                    disabled={!selected || loading}
                    className="w-full h-12 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#7C5CFF]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                        : selected
                            ? <><IndianRupee className="w-4 h-4" />Pay ₹{PLANS.find(p => p.type === selected)!.price} & Start</>
                            : 'Select a session type'}
                </motion.button>
            </motion.div>
        </div>
    );
};

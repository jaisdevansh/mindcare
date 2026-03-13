'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Community', href: '/community' },
        { name: 'Helpers', href: '/helpers' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-[#0a0a1e]/60 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Left Side: Logo & Brand */}
                <Link href="/" className="flex items-center gap-3 relative z-[110] group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shadow-[0_0_20px_rgba(124,92,255,0.4)] transition-all group-hover:scale-105">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white font-inter">
                        MindCare
                    </span>
                </Link>

                {/* Center: Navigation */}
                <div className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`relative text-[15px] font-medium transition-all duration-300 ${isActive ? 'text-white' : 'text-[#9DA7B3] hover:text-white'} group`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-[#7C5CFF] rounded-full transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100'}`} />
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side: Auth */}
                <div className="hidden lg:flex items-center gap-8">
                    <Link href="/login" className="text-[15px] font-medium text-[#9DA7B3] hover:text-white hover:underline transition-all">
                        Login
                    </Link>
                    <Link href="/register">
                        <button className="h-11 px-7 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white text-[14px] font-bold rounded-full shadow-[0_0_20px_rgba(124,92,255,0.3)] hover:shadow-[0_0_30px_rgba(124,92,255,0.5)] transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]">
                            Get Started
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden relative z-[110] p-2 text-[#9DA7B3] hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="fixed inset-0 w-full h-screen bg-[#0a0a1e] z-[100] flex flex-col pt-32 px-8 space-y-6"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-bold text-[#9DA7B3] hover:text-white transition-colors border-b border-white/5 pb-4"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-6 pt-10">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium text-[#9DA7B3] hover:text-white hover:underline">
                                Login
                            </Link>
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full h-14 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-full text-lg font-bold shadow-[0_0_20px_rgba(124,92,255,0.3)]">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

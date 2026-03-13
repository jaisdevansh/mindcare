"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Community", href: "/share-space" },
        { name: "Helpers", href: "/talk-to-helper" },
        { name: "Pricing", href: "/plans" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/support" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-6 lg:px-12",
                scrolled
                    ? "bg-[rgba(10,10,30,0.6)] backdrop-blur-xl border-b border-white/5 py-4"
                    : "bg-transparent py-8"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#5B6CFF] flex items-center justify-center shadow-lg shadow-[#7C5CFF]/20 group-hover:scale-110 transition-transform duration-300">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight font-inter">MindCare</span>
                </Link>

                {/* Center: Navigation Links */}
                <div className="hidden lg:flex items-center gap-10 p-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-3xl shadow-2xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-[12px] px-5 py-2 rounded-full font-bold tracking-[0.1em] uppercase transition-all duration-300 relative group",
                                pathname === link.href ? "text-white bg-white/10" : "text-[#9DA7B3] hover:text-white"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="hidden lg:flex items-center gap-10">
                    <Link
                        href="/login"
                        className="text-[14px] font-medium text-[#9DA7B3] hover:text-white transition-all duration-300 hover:underline underline-offset-8 decoration-[#7C5CFF]/40"
                    >
                        Login
                    </Link>
                    <Link href="/signup">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(124, 92, 255, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            className="h-11 px-8 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white text-[14px] font-bold rounded-full shadow-lg shadow-[#7C5CFF]/20 transition-all duration-300"
                        >
                            Get Started
                        </motion.button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 top-0 left-0 w-full bg-[#0B0F2A] z-[99] flex flex-col pt-32 px-10 gap-8 overflow-hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "text-3xl font-black transition-colors",
                                    pathname === link.href ? "text-white" : "text-[#9DA7B3] hover:text-white"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="mt-auto pb-20 flex flex-col gap-6">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-xl font-bold text-[#9DA7B3] hover:text-white"
                            >
                                Login
                            </Link>
                            <Link href="/signup" onClick={() => setIsOpen(false)}>
                                <button className="w-full h-16 bg-gradient-to-r from-[#7C5CFF] to-[#5B6CFF] text-white rounded-2xl text-lg font-black shadow-2xl shadow-[#7C5CFF]/30">
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

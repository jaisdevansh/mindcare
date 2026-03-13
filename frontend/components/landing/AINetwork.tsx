'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AINetwork = () => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Slightly reduced node count for performance balance
    const nodes = [
        { id: 1, x: '15%', y: '20%' },
        { id: 2, x: '35%', y: '15%' },
        { id: 3, x: '55%', y: '18%' },
        { id: 4, x: '85%', y: '25%' },
        { id: 5, x: '10%', y: '50%' },
        { id: 6, x: '30%', y: '45%' },
        { id: 7, x: '50%', y: '55%' },
        { id: 8, x: '75%', y: '60%' },
        { id: 9, x: '90%', y: '45%' },
        { id: 10, x: '25%', y: '80%' },
        { id: 12, x: '65%', y: '75%' },
    ];

    const connections = [
        [1, 2], [2, 3], [3, 4], [4, 9], [9, 8], [8, 7], [7, 6], [6, 1],
        [1, 5], [5, 6], [5, 10], [10, 6], [7, 12], [12, 8], [6, 8], [2, 6], [3, 7]
    ];

    if (!mounted) return <div className="absolute inset-0 z-0" />;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 will-change-transform">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0" />
                        <stop offset="50%" stopColor="#5B6CFF" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#6A8DFF" stopOpacity="0" />
                    </linearGradient>
                    <filter id="fastGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="0.6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Connections */}
                {connections.map(([fromId, toId], idx) => {
                    const from = nodes.find(n => n.id === fromId);
                    const to = nodes.find(n => n.id === toId);
                    if (!from || !to) return null;
                    return (
                        <g key={`con-${idx}`} filter="url(#fastGlow)">
                            <line
                                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                                stroke="#7C5CFF" strokeWidth="0.03" opacity="0.1"
                            />
                            <motion.line
                                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                                stroke="url(#lineGrad)"
                                strokeWidth="0.15"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.4, 0.4, 0] }}
                                transition={{
                                    duration: 8 + Math.random() * 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: Math.random() * 8
                                }}
                            />
                        </g>
                    );
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                    <g key={`node-${node.id}`}>
                        <motion.circle
                            cx={node.x} cy={node.y} r="0.4"
                            fill="#7C5CFF"
                            animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <circle
                            cx={node.x} cy={node.y} r="1"
                            fill="#7C5CFF" opacity="0.05"
                        />
                    </g>
                ))}
            </svg>

            {/* Optimized Particles */}
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={`p-${i}`}
                    className="absolute w-[1px] h-[1px] bg-white rounded-full will-change-transform"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        boxShadow: '0 0 4px #7C5CFF'
                    }}
                    animate={{
                        y: [0, -150, 0],
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: 15 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 10
                    }}
                />
            ))}
        </div>
    );
};

"use client";

import React, { useMemo, useState, useEffect } from "react";

interface Node { id: number; x: number; y: number; size: number; color: string; delay: number; }
interface Connection { from: number; to: number; }

const BRAIN_COLORS = ["#7C5CFF", "#5B6CFF", "#8B5CF6", "#6366F1", "#A78BFA", "#4F7CFF"];

export const NeuralBrain = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const nodes = useMemo<Node[]>(() => [
        // ── Core cluster (center) ──
        { id: 0, x: 50, y: 45, size: 2.0, color: "#7C5CFF", delay: 0 },
        { id: 1, x: 50, y: 55, size: 1.5, color: "#5B6CFF", delay: 0.6 },
        { id: 2, x: 45, y: 50, size: 1.8, color: "#8B5CF6", delay: 1.2 },
        { id: 3, x: 55, y: 50, size: 1.6, color: "#6366F1", delay: 0.3 },

        // ── Left lobe ──
        { id: 10, x: 28, y: 38, size: 1.4, color: "#7C5CFF", delay: 0.8 },
        { id: 11, x: 22, y: 48, size: 1.2, color: "#5B6CFF", delay: 1.5 },
        { id: 12, x: 26, y: 57, size: 1.3, color: "#A78BFA", delay: 0.4 },
        { id: 13, x: 35, y: 62, size: 1.1, color: "#4F7CFF", delay: 2.0 },
        { id: 14, x: 33, y: 30, size: 1.4, color: "#7C5CFF", delay: 1.1 },
        { id: 15, x: 18, y: 35, size: 1.0, color: "#8B5CF6", delay: 0.7 },
        { id: 16, x: 15, y: 55, size: 1.1, color: "#5B6CFF", delay: 1.8 },
        { id: 17, x: 38, y: 42, size: 1.2, color: "#6366F1", delay: 0.2 },
        { id: 18, x: 32, y: 72, size: 0.9, color: "#A78BFA", delay: 2.2 },

        // ── Far left ──
        { id: 30, x: 8, y: 42, size: 0.8, color: "#7C5CFF", delay: 1.3 },
        { id: 31, x: 10, y: 62, size: 0.9, color: "#4F7CFF", delay: 0.9 },
        { id: 32, x: 12, y: 28, size: 0.8, color: "#8B5CF6", delay: 2.4 },

        // ── Right lobe ──
        { id: 20, x: 72, y: 38, size: 1.4, color: "#7C5CFF", delay: 0.5 },
        { id: 21, x: 78, y: 48, size: 1.2, color: "#5B6CFF", delay: 1.6 },
        { id: 22, x: 74, y: 57, size: 1.3, color: "#A78BFA", delay: 0.3 },
        { id: 23, x: 65, y: 62, size: 1.1, color: "#4F7CFF", delay: 2.1 },
        { id: 24, x: 67, y: 30, size: 1.4, color: "#7C5CFF", delay: 1.0 },
        { id: 25, x: 82, y: 35, size: 1.0, color: "#8B5CF6", delay: 0.6 },
        { id: 26, x: 85, y: 55, size: 1.1, color: "#5B6CFF", delay: 1.9 },
        { id: 27, x: 62, y: 42, size: 1.2, color: "#6366F1", delay: 0.1 },
        { id: 28, x: 68, y: 72, size: 0.9, color: "#A78BFA", delay: 2.3 },

        // ── Far right ──
        { id: 40, x: 92, y: 42, size: 0.8, color: "#7C5CFF", delay: 1.4 },
        { id: 41, x: 90, y: 62, size: 0.9, color: "#4F7CFF", delay: 0.8 },
        { id: 42, x: 88, y: 28, size: 0.8, color: "#8B5CF6", delay: 2.5 },

        // ── Top crown ──
        { id: 50, x: 50, y: 18, size: 1.3, color: "#7C5CFF", delay: 0.5 },
        { id: 51, x: 40, y: 22, size: 1.1, color: "#5B6CFF", delay: 1.2 },
        { id: 52, x: 60, y: 22, size: 1.1, color: "#8B5CF6", delay: 0.9 },
        { id: 53, x: 50, y: 10, size: 0.9, color: "#A78BFA", delay: 1.8 },

        // ── Stem & Extension ──
        { id: 60, x: 50, y: 85, size: 1.2, color: "#6366F1", delay: 0.4 },
        { id: 61, x: 44, y: 95, size: 0.7, color: "#7C5CFF", delay: 1.0 },
        { id: 62, x: 56, y: 95, size: 0.7, color: "#5B6CFF", delay: 1.6 },

        // ── Ultra-expansive periphery nodes (Spanning beyond screen edges) ──
        { id: 100, x: -30, y: -20, size: 0.5, color: "#7C5CFF", delay: 2.1 },
        { id: 101, x: 130, y: -20, size: 0.5, color: "#7C5CFF", delay: 2.5 },
        { id: 102, x: -30, y: 120, size: 0.5, color: "#5B6CFF", delay: 2.8 },
        { id: 103, x: 130, y: 120, size: 0.5, color: "#5B6CFF", delay: 3.1 },
        { id: 104, x: -25, y: 50, size: 0.6, color: "#8B5CF6", delay: 1.5 },
        { id: 105, x: 125, y: 50, size: 0.6, color: "#8B5CF6", delay: 1.8 },
        { id: 106, x: 50, y: -25, size: 0.6, color: "#7C5CFF", delay: 1.2 },
        { id: 107, x: 50, y: 125, size: 0.6, color: "#5B6CFF", delay: 1.9 },
        { id: 108, x: 10, y: -10, size: 0.4, color: "#6366F1", delay: 2.3 },
        { id: 109, x: 90, y: -10, size: 0.4, color: "#A78BFA", delay: 2.7 }
    ], []);

    const connections = useMemo<Connection[]>(() => [
        // Core
        { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
        { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 },

        // Left lobe internal
        { from: 10, to: 11 }, { from: 11, to: 12 }, { from: 12, to: 13 },
        { from: 10, to: 14 }, { from: 14, to: 15 }, { from: 15, to: 11 },
        { from: 11, to: 16 }, { from: 16, to: 12 }, { from: 10, to: 17 },
        { from: 17, to: 12 }, { from: 13, to: 18 }, { from: 12, to: 18 },

        // Far left
        { from: 30, to: 15 }, { from: 31, to: 16 }, { from: 32, to: 15 },
        { from: 30, to: 31 }, { from: 30, to: 32 },

        // Right lobe internal
        { from: 20, to: 21 }, { from: 21, to: 22 }, { from: 22, to: 23 },
        { from: 20, to: 24 }, { from: 24, to: 25 }, { from: 25, to: 21 },
        { from: 21, to: 26 }, { from: 26, to: 22 }, { from: 20, to: 27 },
        { from: 27, to: 22 }, { from: 23, to: 28 }, { from: 22, to: 28 },

        // Far right
        { from: 40, to: 25 }, { from: 41, to: 26 }, { from: 42, to: 25 },
        { from: 40, to: 41 }, { from: 40, to: 42 },

        // Core ↔ Left
        { from: 2, to: 17 }, { from: 2, to: 10 }, { from: 0, to: 14 },
        { from: 1, to: 13 }, { from: 1, to: 12 },

        // Core ↔ Right
        { from: 3, to: 27 }, { from: 3, to: 20 }, { from: 0, to: 24 },
        { from: 1, to: 23 }, { from: 1, to: 22 },

        // Top crown
        { from: 53, to: 50 }, { from: 50, to: 51 }, { from: 50, to: 52 },
        { from: 51, to: 14 }, { from: 52, to: 24 }, { from: 50, to: 0 },

        // Bottom stem
        { from: 60, to: 1 }, { from: 60, to: 18 }, { from: 60, to: 28 },
        { from: 60, to: 61 }, { from: 60, to: 62 },

        // Periphery connections
        { from: 100, to: 32 }, { from: 100, to: 15 },
        { from: 101, to: 42 }, { from: 101, to: 25 },
        { from: 102, to: 31 }, { from: 102, to: 18 },
        { from: 103, to: 41 }, { from: 103, to: 28 },
        { from: 104, to: 30 }, { from: 104, to: 12 },
        { from: 105, to: 40 }, { from: 105, to: 22 },
        { from: 106, to: 53 }, { from: 106, to: 51 },
        { from: 107, to: 61 }, { from: 107, to: 62 },
        { from: 108, to: 32 }, { from: 109, to: 42 }
    ], []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <style jsx>{`
                @keyframes pulseNode {
                    0%, 100% { opacity: 0.25; r: inherit; }
                    50% { opacity: 1; }
                }
                @keyframes flowLine {
                    from { stroke-dashoffset: 40; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes floatBrain {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    25% { transform: translateY(-15px) rotate(0.8deg) scale(1.02); }
                    50% { transform: translateY(0px) rotate(0deg) scale(1); }
                    75% { transform: translateY(15px) rotate(-0.8deg) scale(0.98); }
                }
                @keyframes glow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }
                @keyframes orbit {
                    from { transform: rotate(0deg) translateX(22px) rotate(0deg); }
                    to { transform: rotate(360deg) translateX(22px) rotate(-360deg); }
                }
                @keyframes orbit2 {
                    from { transform: rotate(180deg) translateX(34px) rotate(-180deg); }
                    to { transform: rotate(540deg) translateX(34px) rotate(-540deg); }
                }
                @keyframes fireTrail {
                    0% { stroke-dashoffset: 100; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                }
                @keyframes synapsePulse {
                    0% { stroke-width: 0.1; opacity: 0.1; }
                    50% { stroke-width: 0.4; opacity: 0.6; }
                    100% { stroke-width: 0.1; opacity: 0.1; }
                }
                .brain-float {
                    animation: floatBrain 22s cubic-bezier(0.45, 0, 0.55, 1) infinite;
                    transform-origin: 50% 50%;
                    will-change: transform;
                    backface-visibility: hidden;
                    perspective: 1000px;
                }
                .brain-node {
                    animation: pulseNode 4s ease-in-out infinite;
                }
                .brain-line {
                    stroke-dasharray: 5 18;
                    animation: flowLine 8s linear infinite;
                }
                .brain-trail {
                    stroke-dasharray: 100;
                    animation: fireTrail 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
                .sulcus-path {
                    animation: synapsePulse 6s ease-in-out infinite;
                    fill: none;
                    stroke: #7C5CFF;
                    stroke-width: 0.15;
                    opacity: 0.2;
                }
                .orbit-dot {
                    animation: orbit 12s linear infinite;
                    transform-origin: 50% 45%;
                }
                .orbit-dot-2 {
                    animation: orbit2 18s linear infinite;
                    transform-origin: 50% 45%;
                }
            `}</style>

            <svg
                viewBox="-35 -25 170 150"
                className="brain-float"
                style={{
                    position: "absolute",
                    top: "-15%",
                    left: "-15%",
                    width: "130%",
                    height: "130%",
                }}
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    {/* Radial glow */}
                    <radialGradient id="centerGlow" cx="50%" cy="45%" r="35%">
                        <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="leftGlow" cx="28%" cy="48%" r="22%">
                        <stop offset="0%" stopColor="#5B6CFF" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#5B6CFF" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="rightGlow" cx="72%" cy="48%" r="22%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </radialGradient>
                    <filter id="nodeBlur">
                        <feGaussianBlur stdDeviation="0.4" />
                    </filter>
                    <filter id="lineGlow">
                        <feGaussianBlur stdDeviation="0.2" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* ── Ambient glow blobs (Scaled up) ── */}
                <ellipse cx="50" cy="45" rx="55" ry="48" fill="url(#centerGlow)" />
                <ellipse cx="28" cy="48" rx="35" ry="32" fill="url(#leftGlow)" />
                <ellipse cx="72" cy="48" rx="35" ry="32" fill="url(#rightGlow)" />

                {/* ── Organic Brain Folds (Extra details) ── */}
                <path d="M10 20 Q 30 5, 50 20 T 90 20" className="sulcus-path" style={{ animationDelay: "1.5s" }} />
                <path d="M5 45 Q 25 35, 50 45 T 95 45" className="sulcus-path" style={{ animationDelay: "2.5s" }} />
                <path d="M15 70 Q 50 85, 85 70" className="sulcus-path" style={{ animationDelay: "3.5s" }} />
                <path d="M50 -10 Q 50 40, 50 110" className="sulcus-path" opacity="0.08" strokeDasharray="3 5" />
                <path d="M-10 50 Q 40 50, 110 50" className="sulcus-path" opacity="0.08" strokeDasharray="3 5" />

                {/* ── Connection lines ── */}
                {connections.map(({ from, to }, i) => {
                    const f = nodes.find(n => n.id === from);
                    const t = nodes.find(n => n.id === to);
                    if (!f || !t) return null;
                    const isCore = (from <= 3 || to <= 3);
                    return (
                        <g key={`conn-${i}`} filter={isCore ? "url(#lineGlow)" : undefined}>
                            {/* Base structure line */}
                            <line
                                x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                                stroke={isCore ? "#7C5CFF" : "#4F7CFF"}
                                strokeWidth={isCore ? "0.18" : "0.12"}
                                opacity={isCore ? "0.25" : "0.12"}
                            />
                            {/* Animated energy pulse */}
                            <line
                                x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                                stroke={BRAIN_COLORS[i % BRAIN_COLORS.length]}
                                strokeWidth={isCore ? "0.45" : "0.28"}
                                strokeLinecap="round"
                                className="brain-line"
                                opacity={isCore ? "0.7" : "0.45"}
                                style={{ animationDelay: `${(i * 0.18) % 6}s` }}
                            />
                        </g>
                    );
                })}

                {/* ── Neuron nodes ── */}
                {nodes.map((node) => (
                    <g key={`node-${node.id}`}>
                        {/* Outer glow ring */}
                        <circle
                            cx={node.x} cy={node.y} r={node.size * 2.5}
                            fill={node.color} opacity="0.06"
                            filter="url(#nodeBlur)"
                            className="brain-node"
                            style={{ animationDelay: `${node.delay}s` }}
                        />
                        {/* Inner solid dot */}
                        <circle
                            cx={node.x} cy={node.y} r={node.size}
                            fill={node.color}
                            className="brain-node"
                            style={{ animationDelay: `${node.delay}s` }}
                            opacity="0.9"
                        />
                        {/* Bright core */}
                        <circle
                            cx={node.x} cy={node.y} r={node.size * 0.45}
                            fill="white" opacity="0.6"
                            className="brain-node"
                            style={{ animationDelay: `${node.delay + 0.3}s` }}
                        />
                    </g>
                ))}

                {/* ── Orbiting particles ── */}
                <circle cx="0" cy="0" r="1.0" fill="#7C5CFF" opacity="0.6" className="orbit-dot" />
                <circle cx="0" cy="0" r="0.7" fill="#A78BFA" opacity="0.5" className="orbit-dot-2" />

                {/* ── Fire trails on key connections (core ↔ lobes) ── */}
                {[
                    { from: 0, to: 10, delay: "0s" },
                    { from: 0, to: 20, delay: "1s" },
                    { from: 0, to: 50, delay: "2s" },
                    { from: 1, to: 60, delay: "1.5s" },
                ].map(({ from, to, delay }, i) => {
                    const f = nodes.find(n => n.id === from);
                    const t = nodes.find(n => n.id === to);
                    if (!f || !t) return null;
                    return (
                        <line
                            key={`trail-${i}`}
                            x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                            stroke="#A78BFA"
                            strokeWidth="0.6"
                            strokeLinecap="round"
                            className="brain-trail"
                            style={{ animationDelay: delay }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

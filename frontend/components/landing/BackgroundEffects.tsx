'use client';
import { motion } from 'framer-motion';

export const BackgroundEffects = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#02040A]">
            {/* Deep Base Layer */}
            <div className="absolute inset-0 bg-[#02040A]" />

            {/* Subtle Noise texture */}
            <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-[0.03] z-10" />

            {/* Dynamic Moving Orbs for Depth */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#7C5CFF]/10 rounded-full blur-[200px] will-change-transform"
            />

            <motion.div
                animate={{
                    x: [0, -150, 50, 0],
                    y: [0, 100, -100, 0],
                    scale: [1, 0.8, 1.1, 1],
                }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-30%] right-[-5%] w-[1200px] h-[1200px] bg-[#5B6CFF]/10 rounded-full blur-[250px] will-change-transform"
            />

            <motion.div
                animate={{
                    x: [0, 80, -120, 0],
                    y: [0, 150, 0, 0],
                    opacity: [0.05, 0.1, 0.05],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[20%] left-[20%] w-[800px] h-[800px] bg-[#6A8DFF]/5 rounded-full blur-[180px] will-change-transform"
            />

            {/* Center Hero Spot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-[#7C5CFF]/5 via-transparent to-transparent opacity-60" />
        </div>
    );
};

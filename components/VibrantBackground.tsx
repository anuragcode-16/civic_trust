'use client';

import { motion } from 'framer-motion';

export default function VibrantBackground() {
    return (
        <div className="fixed inset-0 -z-30 overflow-hidden bg-black">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black opacity-100" />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, -100, 0],
                    y: [0, -100, 100, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen will-change-transform"
            />

            <motion.div
                animate={{
                    x: [0, -150, 50, 0],
                    y: [0, 100, -50, 0],
                    scale: [1, 1.3, 0.9, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen will-change-transform"
            />

            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, 50, -100, 0],
                    scale: [1, 1.5, 0.8, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] mix-blend-screen will-change-transform"
            />

            <motion.div
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, -50, 100, 0],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[20%] left-[20%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen will-change-transform"
            />

            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none mix-blend-overlay" />
        </div>
    );
}

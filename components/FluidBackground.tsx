'use client';

import { motion } from 'framer-motion';

const FluidBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-slate-950 overflow-hidden">
            {/* Ambient background gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 opacity-80" />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[100px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-[100px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 50, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-cyan-500/20 blur-[120px]"
            />

            {/* Granular noise texture overlay for extra depth */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none" />

        </div>
    );
};

export default FluidBackground;

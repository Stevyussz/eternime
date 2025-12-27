"use client";

import { motion } from "framer-motion";

export function AnimeLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
            {/* Background Abstract Shapes */}
            <motion.div
                className="absolute inset-0 opacity-10"
                initial={{ backgroundPosition: "0% 0%" }}
                animate={{ backgroundPosition: "100% 100%" }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    backgroundImage: "radial-gradient(circle at 50% 50%, #84cc16 1px, transparent 1px)",
                    backgroundSize: "50px 50px"
                }}
            />

            <div className="relative">
                {/* Main Text with Glitch Effect */}
                <motion.div
                    className="relative text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-blue"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    ETERNIME

                    {/* Glitch Overlay 1 */}
                    <motion.span
                        className="absolute inset-0 text-brand-lime opacity-50 mix-blend-screen"
                        animate={{
                            x: [-2, 2, -1, 0],
                            y: [1, -1, 0],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        ETERNIME
                    </motion.span>

                    {/* Glitch Overlay 2 */}
                    <motion.span
                        className="absolute inset-0 text-brand-blue opacity-50 mix-blend-screen"
                        animate={{
                            x: [2, -2, 1, 0],
                            y: [-1, 1, 0],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
                    >
                        ETERNIME
                    </motion.span>
                </motion.div>

                {/* Katana Slash Line */}
                <motion.div
                    className="absolute top-1/2 left-[-20%] w-[140%] h-[2px] bg-white shadow-[0_0_10px_#fff,0_0_20px_#84cc16]"
                    initial={{ scaleX: 0, rotate: -5, opacity: 0 }}
                    animate={{ scaleX: 1, rotate: -5, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                />

                {/* Secondary Slash */}
                <motion.div
                    className="absolute top-1/2 left-[-20%] w-[140%] h-[1px] bg-brand-blue shadow-[0_0_10px_#3b82f6]"
                    initial={{ scaleX: 0, rotate: 10, opacity: 0 }}
                    animate={{ scaleX: 1, rotate: 10, opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2, repeatDelay: 1 }}
                />
            </div>

            {/* Subtext loading */}
            <div className="mt-8 flex items-center gap-2">
                <motion.div
                    className="w-2 h-2 bg-brand-lime rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-brand-lime/80 font-mono text-sm tracking-[0.2em] uppercase">
                    Loading bentar ya sayang...
                </span>
                <motion.div
                    className="w-2 h-2 bg-brand-lime rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
            </div>

            <motion.p
                className="mt-2 text-xs text-white/20 font-light"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                読み込み中...
            </motion.p>
        </div>
    );
}

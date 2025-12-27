"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface GachaModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

export function GachaModal({ isOpen, onComplete }: GachaModalProps) {
    // Phases: summon (circle) -> charge (particles) -> beam (shoot up) -> drop (meteor) -> impact (flash) -> reveal
    const [step, setStep] = useState<'summon' | 'charge' | 'beam' | 'drop' | 'impact' | 'reveal'>('summon');

    useEffect(() => {
        let audio: HTMLAudioElement | null = null;

        if (isOpen) {
            setStep('summon');

            // Play Sound
            audio = new Audio('/sounds/gacha-summon.wav');
            audio.volume = 0.6;
            audio.play().catch(e => console.warn("Audio play failed:", e));

            // Timeline
            const t1 = setTimeout(() => setStep('charge'), 1000); // 1s: Start gathering particles
            const t2 = setTimeout(() => setStep('beam'), 2500);   // 2.5s: Beam shoots up
            const t3 = setTimeout(() => setStep('drop'), 3000);   // 3s: Meteor drops
            const t4 = setTimeout(() => setStep('impact'), 3500); // 3.5s: Impact/Flash
            const t5 = setTimeout(() => setStep('reveal'), 3700); // 3.7s: Reveal
            const t6 = setTimeout(() => {
                onComplete();
            }, 6000); // Give user time to see the result

            return () => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
                clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
                clearTimeout(t4); clearTimeout(t5); clearTimeout(t6);
            };
        }
    }, [isOpen, onComplete]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Background Ambience */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black" />

                    {/* PHASE 1: Summoning Circle */}
                    {(step === 'summon' || step === 'charge' || step === 'beam') && (
                        <div className="relative flex items-center justify-center perspective-[1000px]">
                            {/* Outer Ring */}
                            <motion.div
                                className="absolute w-[600px] h-[600px] border-[4px] border-brand-lime/30 rounded-full shadow-[0_0_50px_rgba(132,204,22,0.2)]"
                                style={{ transformStyle: "preserve-3d", rotateX: 60 }}
                                animate={{ rotateZ: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute inset-0 border-[2px] border-brand-lime/20 rounded-full scale-90" />
                                <div className="absolute inset-0 border-[1px] border-brand-lime/10 rounded-full scale-75" />
                            </motion.div>

                            {/* Inner Runes (Simulated) */}
                            <motion.div
                                className="absolute w-[300px] h-[300px] border-[2px] border-brand-blue/50 rounded-full"
                                style={{ transformStyle: "preserve-3d", rotateX: 60 }}
                                animate={{ rotateZ: -360 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-blue rounded-full shadow-[0_0_20px_#3b82f6]" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-blue rounded-full shadow-[0_0_20px_#3b82f6]" />
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-blue rounded-full shadow-[0_0_20px_#3b82f6]" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-brand-blue rounded-full shadow-[0_0_20px_#3b82f6]" />
                            </motion.div>
                        </div>
                    )}

                    {/* PHASE 2: Charge Particles */}
                    {(step === 'charge' || step === 'beam') && (
                        <>
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                                    initial={{ x: (Math.random() - 0.5) * 1000, y: (Math.random() - 0.5) * 1000, opacity: 0 }}
                                    animate={{
                                        x: 0,
                                        y: 0,
                                        opacity: [0, 1, 0.5],
                                        scale: [1, 2, 0]
                                    }}
                                    transition={{ duration: 1.5, ease: "easeIn", delay: Math.random() * 0.5 }}
                                />
                            ))}
                            {/* Core Glow */}
                            <motion.div
                                className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_100px_50px_rgba(255,255,255,0.8)]"
                                animate={{ scale: [1, 5, 2] }}
                                transition={{ duration: 1.5 }}
                            />
                        </>
                    )}

                    {/* PHASE 3: Beam Shoot Up */}
                    {step === 'beam' && (
                        <motion.div
                            className="absolute w-[200px] h-screen bg-gradient-to-t from-white via-brand-lime to-transparent opacity-80"
                            initial={{ scaleY: 0, originY: 1 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        />
                    )}

                    {/* PHASE 4: Drop from Sky */}
                    {step === 'drop' && (
                        <motion.div
                            className="absolute w-[4px] h-[300px] bg-gradient-to-b from-transparent via-yellow-400 to-white shadow-[0_0_50px_#facc15]"
                            initial={{ y: -1000, x: 100, rotate: 15 }}
                            animate={{ y: 0, x: 0 }}
                            transition={{ duration: 0.4, ease: "easeIn" }}
                        />
                    )}

                    {/* PHASE 5: Impact Flash */}
                    {step === 'impact' && (
                        <div className="absolute inset-0 bg-white animate-flash" /> // Needs custom animation or motion
                    )}
                    {step === 'impact' && (
                        <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        />
                    )}


                    {/* PHASE 6: Reveal */}
                    {(step === 'reveal' || step === 'impact') && (
                        <div className="flex flex-col items-center gap-8 z-20">
                            {/* SSR Glow Background */}
                            <motion.div
                                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.2),transparent_70%)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />

                            {/* Stars */}
                            <motion.div className="flex gap-3 relative z-30">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 3, opacity: 0, rotate: 180 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                                    >
                                        <Star className="w-10 h-10 fill-yellow-400 text-yellow-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.9)]" />
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Main Text */}
                            <motion.div
                                className="text-center"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.6 }}
                            >
                                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600 drop-shadow-[0_4px_0_rgba(180,83,9,0.5)]">
                                    LEGENDARY
                                </h1>
                                <motion.p
                                    className="text-white font-bold tracking-[0.5em] mt-2 text-xl shadow-black drop-shadow-md"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ANIME FOUND
                                </motion.p>
                            </motion.div>

                            <motion.div
                                className="mt-8 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <span className="text-sm font-mono text-yellow-200">Redirecting to your destiny...</span>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

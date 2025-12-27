"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, X, Sparkles } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { AnimeCard, OngoingResponse } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FortuenResult {
    date: string;
    fortune: string;
    luckyColor: string;
    luckyAnime: AnimeCard | null;
}

const FORTUNES = [
    { label: "Great Blessing", kanji: "大吉", color: "text-red-500", desc: "Everything will go your way today!" },
    { label: "Middle Blessing", kanji: "中吉", color: "text-orange-500", desc: "A good day for new anime." },
    { label: "Small Blessing", kanji: "小吉", color: "text-green-500", desc: "Unexpected filler episodes might be good." },
    { label: "Blessing", kanji: "吉", color: "text-blue-500", desc: "Standard isekai vibes today." },
    { label: "Future Blessing", kanji: "末吉", color: "text-purple-500", desc: "The plot twist is coming soon." },
    { label: "Curse", kanji: "凶", color: "text-gray-500", desc: "Beware of spoilers on social media." },
];

const COLORS = [
    "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Orange", "Black", "White", "Gold"
];

export function DailyOmikuji() {
    const [result, setResult] = useState<FortuenResult | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'shake' | 'revealing' | 'result'>('shake');
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem("eternime_omikuji");

        if (stored) {
            const parsed: FortuenResult = JSON.parse(stored);
            if (parsed.date === today) {
                setResult(parsed);
                // Don't auto-open if already done, just show updated minimal state
            } else {
                localStorage.removeItem("eternime_omikuji"); // Clear old
            }
        }
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
        if (result) {
            setStep('result');
        } else {
            setStep('shake');
        }
    };

    const handleShake = async () => {
        if (isShaking) return;
        setIsShaking(true);

        // Audio
        const audio = new Audio('/sounds/omikuji-shake.mp3');
        audio.volume = 0.5;
        audio.play().catch(console.warn);

        // Wait for shake duration
        setTimeout(async () => {
            const today = new Date().toISOString().split('T')[0];
            const randomFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
            const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

            // Re-fetch logic or mock
            let luckyAnime: AnimeCard | null = null;
            try {
                const page = Math.floor(Math.random() * 3) + 1;
                const res = await fetchAPI<OngoingResponse>(`/ongoing?page=${page}`);
                const list = res.data.animeList;
                if (list.length > 0) luckyAnime = list[Math.floor(Math.random() * list.length)];
            } catch (e) { console.error(e); }

            const newResult = {
                date: today,
                fortune: JSON.stringify(randomFortune),
                luckyColor: randomColor,
                luckyAnime
            };

            localStorage.setItem("eternime_omikuji", JSON.stringify(newResult));
            // @ts-ignore
            setResult(newResult);
            setIsShaking(false);
            setStep('revealing');

            setTimeout(() => setStep('result'), 1500); // Reveal animation time
        }, 2500); // Shake duration
    };

    const displayedFortune = result ? (() => {
        try {
            return JSON.parse(result.fortune) as typeof FORTUNES[0];
        } catch {
            return FORTUNES.find(f => f.label === result.fortune) || FORTUNES[3];
        }
    })() : null;

    return (
        <>
            {/* Minimalist Widget on Home */}
            <motion.div
                className={cn(
                    "relative overflow-hidden rounded-xl border p-6 flex items-center justify-between cursor-pointer transition-all hover:bg-secondary/20 group",
                    result ? "border-brand-lime/20 bg-brand-lime/5" : "border-white/5 bg-secondary/10"
                )}
                onClick={handleOpen}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                        <Scroll className="w-5 h-5 text-brand-lime" />
                        Daily Fortune
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {result ? "Tap to view your fortune" : "Reveal your destiny for today..."}
                    </p>
                </div>
                {result ? (
                    <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-brand-lime">{displayedFortune?.kanji}</span>
                        <span className="text-xs uppercase tracking-wider text-brand-lime/70">{displayedFortune?.label}</span>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-lime/20 flex items-center justify-center group-hover:bg-brand-lime/30 transition-colors">
                        <Sparkles className="w-5 h-5 text-brand-lime" />
                    </div>
                )}
            </motion.div>

            {/* Immersive Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-2xl p-8 relative overflow-hidden shadow-2xl"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Close Background Pattern */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none"
                                style={{ backgroundImage: "radial-gradient(#84cc16 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                            />

                            <div className="relative flex flex-col items-center min-h-[400px] justify-center text-center">

                                {/* Header */}
                                <h2 className="text-2xl font-bold mb-8 font-mono uppercase tracking-widest text-brand-lime/60">
                                    御神籤 (Omikuji)
                                </h2>

                                {/* Dynamic Content */}
                                <AnimatePresence mode="wait">
                                    {step === 'shake' && (
                                        <motion.div
                                            key="shake"
                                            className="flex flex-col items-center cursor-pointer"
                                            onClick={handleShake}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.div
                                                className="w-40 h-64 bg-gradient-to-br from-neutral-800 to-neutral-900 border-4 border-[#8B4513] rounded-lg shadow-2xl flex items-center justify-center relative mb-8"
                                                animate={isShaking ? {
                                                    x: [-5, 5, -5, 5, 0],
                                                    y: [-5, 5, -5, 5, 0],
                                                    rotate: [-2, 2, -2, 2, 0]
                                                } : {}}
                                                transition={isShaking ? { duration: 0.2, repeat: Infinity } : {}}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <div className="w-32 h-32 border-2 border-white/10 rounded-full flex items-center justify-center">
                                                    <span className="text-6xl text-white/10 font-serif">運</span>
                                                </div>
                                                {/* Hole */}
                                                <div className="absolute -top-2 w-12 h-4 bg-black rounded-b-xl" />
                                            </motion.div>
                                            <p className="text-brand-lime font-bold animate-pulse">
                                                {isShaking ? "Shaking..." : "Tap to Shake!"}
                                            </p>
                                        </motion.div>
                                    )}

                                    {step === 'revealing' && (
                                        <motion.div
                                            key="revealing"
                                            className="text-center"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 2, opacity: 0 }}
                                        >
                                            <div className="w-2 h-40 bg-yellow-100 mx-auto shadow-[0_0_20px_white] animate-pulse rounded-full" />
                                            <p className="mt-4 text-white text-lg">Revealing your destiny...</p>
                                        </motion.div>
                                    )}

                                    {step === 'result' && result && displayedFortune && (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="w-full flex flex-col items-center"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", bounce: 0.5 }}
                                                className="mb-2"
                                            >
                                                <span className={cn("text-8xl font-black drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]", displayedFortune.color)}>
                                                    {displayedFortune.kanji}
                                                </span>
                                            </motion.div>

                                            <h3 className={cn("text-2xl font-bold mb-2 uppercase tracking-wide", displayedFortune.color)}>
                                                {displayedFortune.label}
                                            </h3>

                                            <p className="text-muted-foreground italic mb-8 max-w-[80%]">
                                                "{displayedFortune.desc}"
                                            </p>

                                            <div className="w-full grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                                                    <span className="text-xs text-muted-foreground uppercase opacity-70">Lucky Color</span>
                                                    <div className="font-bold text-lg mt-1" style={{ color: result.luckyColor.toLowerCase() }}>
                                                        {result.luckyColor}
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md">
                                                    <span className="text-xs text-muted-foreground uppercase opacity-70">Lucky Number</span>
                                                    <div className="font-bold text-lg text-white mt-1">
                                                        {Math.floor(Math.random() * 100)} {/* Ideally store this too */}
                                                    </div>
                                                </div>
                                            </div>

                                            {result.luckyAnime && (
                                                <div className="w-full bg-gradient-to-r from-secondary/40 to-secondary/20 p-1 rounded-xl border border-brand-lime/20 group">
                                                    <div className="flex gap-4 items-center bg-black/40 p-3 rounded-lg h-full">
                                                        <img
                                                            src={result.luckyAnime.poster}
                                                            alt={result.luckyAnime.title}
                                                            className="w-12 h-16 object-cover rounded shadow-md"
                                                        />
                                                        <div className="flex-1 text-left min-w-0">
                                                            <div className="text-[10px] text-brand-lime uppercase tracking-widest font-bold mb-1">Today's Recommendation</div>
                                                            <h4 className="font-bold text-sm text-white truncate group-hover:text-brand-lime transition-colors">
                                                                {result.luckyAnime.title}
                                                            </h4>
                                                            <Link href={`/anime/${result.luckyAnime.animeId}`} className="text-xs text-muted-foreground hover:text-white underline mt-0.5 inline-block">
                                                                Watch Now
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

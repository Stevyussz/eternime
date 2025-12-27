"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton } from "@/components/ui/GradientButton";
import Link from "next/link";

interface Anime {
    title: string;
    poster: string;
    animeId: string;
    score?: string;
    synopsis?: string;
}

export function HeroCarousel({ animeList }: { animeList: Anime[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % animeList.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [animeList.length]);

    if (!animeList || animeList.length === 0) return null;

    const currentAnime = animeList[index];

    return (
        <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden rounded-2xl shadow-2xl mb-12 group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentAnime.animeId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-linear group-hover:scale-105"
                        style={{ backgroundImage: `url(${currentAnime.poster})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10 max-w-2xl text-white">
                <motion.div
                    key={currentAnime.animeId + "text"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="px-3 py-1 bg-brand-lime text-black text-xs font-bold rounded-full mb-4 inline-block shadow-lg">
                        TRENDING
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight drop-shadow-2xl text-white">
                        {currentAnime.title}
                    </h1>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-brand-lime font-bold drop-shadow-md">⭐ {currentAnime.score || "N/A"}</span>
                        <span className="text-gray-200">TV Series</span>
                    </div>
                    <Link href={`/anime/${currentAnime.animeId}`}>
                        <GradientButton size="lg" className="px-8 py-4 text-lg border-none">
                            Watch Now
                        </GradientButton>
                    </Link>
                </motion.div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 right-8 flex gap-2">
                {animeList.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all shadow-md ${i === index ? "bg-brand-lime w-8" : "bg-white/50 hover:bg-white"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PlayCircle, Clock, Calendar, Building2, Film, Star, Share2 } from "lucide-react";

import { AnimeDetail } from "@/types";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import { SocialShareModal } from "@/components/features/SocialShareModal";
import { Countdown } from "./Countdown";
import { ReminderButton } from "./ReminderButton";

interface AnimeHeaderProps {
    anime: AnimeDetail & { animeId: string };
    nextEpisodeDate?: Date | null;
}

export function AnimeHeader({ anime, nextEpisodeDate }: AnimeHeaderProps) {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const handleShare = () => {
        setIsShareModalOpen(true);
    };

    return (
        <div className="relative w-full mb-12">
            {/* Background Blur */}
            <div
                className="absolute inset-0 h-[500px] w-full bg-cover bg-center opacity-20 blur-3xl mask-gradient-to-b"
                style={{ backgroundImage: `url(${anime.poster})` }}
            />
            <div className="absolute inset-0 h-[500px] bg-gradient-to-b from-black/60 to-background" />

            {/* Content Container */}
            <div className="container mx-auto px-6 pt-10 relative z-10 flex flex-col md:flex-row gap-8 items-start">

                {/* Poster Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full md:w-[300px] shrink-0"
                >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                        <img
                            src={anime.poster}
                            alt={anime.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-fit shadow-lg ${anime.status.toLowerCase() === 'ongoing'
                                ? 'bg-brand-lime text-black'
                                : 'bg-brand-blue text-white'
                                }`}>
                                {anime.status}
                            </span>
                        </div>
                    </div>

                    {/* Countdown Section - Only if Ongoing and date exists */}
                    {nextEpisodeDate && anime.status.toLowerCase() === 'ongoing' && (
                        <div className="mt-4 flex items-center gap-3">
                            <Countdown targetDate={nextEpisodeDate} />
                            <ReminderButton
                                animeId={anime.animeId}
                                title={anime.title}
                                targetDate={nextEpisodeDate}
                            />
                        </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <BookmarkButton anime={anime as any} animeId={anime.animeId} />
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center gap-2 bg-secondary/20 hover:bg-secondary/40 text-foreground py-3 rounded-lg border border-white/10 transition-colors font-medium text-sm"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </motion.div>

                {/* Details */}
                <div className="flex-1 text-foreground">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 tracking-tight leading-none bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                            {anime.title}
                        </h1>
                        {anime.japanese && (
                            <h2 className="text-xl text-muted-foreground mb-6 font-medium italic">{anime.japanese}</h2>
                        )}

                        {/* Metadata Grid */}
                        <div className="flex flex-wrap gap-4 mb-8 text-sm">
                            {anime.score && (
                                <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-bold">{anime.score}</span>
                                </div>
                            )}
                            {anime.duration && (
                                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-white/5 text-muted-foreground">
                                    <Clock className="w-4 h-4" /> {anime.duration}
                                </div>
                            )}
                            {anime.aired && (
                                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-white/5 text-muted-foreground">
                                    <Calendar className="w-4 h-4" /> {anime.aired}
                                </div>
                            )}
                            {anime.studios && (
                                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-white/5 text-muted-foreground">
                                    <Building2 className="w-4 h-4" /> {anime.studios}
                                </div>
                            )}
                            {anime.type && (
                                <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-white/5 text-muted-foreground">
                                    <Film className="w-4 h-4" /> {anime.type}
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {anime.genreList && anime.genreList.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {anime.genreList.map(genre => (
                                    <Link key={genre.genreId} href={`/genres/${genre.genreId}`}>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 hover:bg-brand-lime/20 text-gray-300 hover:text-brand-lime border border-white/10 hover:border-brand-lime/30 transition-all cursor-pointer">
                                            {genre.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Synopsis */}
                        <div className="bg-secondary/10 border border-white/5 p-6 rounded-2xl mb-8 backdrop-blur-sm">
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                Synopsis
                            </h3>
                            <div className="text-gray-300 leading-relaxed space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar text-sm md:text-base">
                                {anime.synopsis?.paragraphList?.map((p, i) => <p key={i}>{p}</p>)}
                            </div>
                        </div>

                        {/* Call to Action (Latest Episode) */}
                        {anime.episodeList && anime.episodeList.length > 0 && (
                            <Link href={`/watch/${anime.episodeList[0].episodeId}`}>
                                <button className="flex items-center gap-3 bg-brand-lime text-black px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(132,204,22,0.4)] transition-all duration-300 w-full md:w-auto justify-center">
                                    <PlayCircle className="w-6 h-6 fill-current text-black" />
                                    Watch Latest Episode
                                </button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>

            <SocialShareModal
                anime={anime}
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />
        </div>
    );
}

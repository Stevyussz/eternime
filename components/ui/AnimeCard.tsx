"use client";

import { AnimeCard as AnimeCardType } from "@/types";
import { GlassCard } from "./GlassCard";
import Link from "next/link";
import { PlayCircle, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
    anime: AnimeCardType;
    className?: string;
    showScore?: boolean;
}

export function AnimeCard({ anime, className, showScore = true }: AnimeCardProps) {
    return (
        <Link href={`/anime/${anime.animeId}`} className={cn("block h-full", className)}>
            <GlassCard className="h-full group hover:border-brand-lime/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(132,204,22,0.1)] relative overflow-hidden">
                {/* Image Container */}
                <div className="aspect-[3/4] relative overflow-hidden rounded-t-xl bg-muted/20">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(${anime.poster})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Hover Overlay with Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <PlayCircle className="w-12 h-12 text-brand-lime drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] scale-75 group-hover:scale-100 transition-transform duration-300" />
                    </div>

                    {/* Top Right Badge (Score or Status) */}
                    <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                        {anime.score && showScore && (
                            <span className="bg-black/60 backdrop-blur-md text-brand-lime border border-brand-lime/20 px-2 py-0.5 rounded text-[10px] font-bold shadow flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> {anime.score}
                            </span>
                        )}
                        {anime.episodes && (
                            <span className="bg-brand-blue/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-bold shadow">
                                {anime.episodes} eps
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-3">
                    <h3 className="font-semibold text-sm md:text-base text-card-foreground line-clamp-2 mb-2 group-hover:text-brand-lime transition-colors leading-tight">
                        {anime.title}
                    </h3>

                    <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 truncate max-w-[70%]">
                            {anime.latestReleaseDate ? (
                                <>
                                    <Calendar className="w-3 h-3" />
                                    {anime.latestReleaseDate}
                                </>
                            ) : (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-[4px] capitalize",
                                    anime.status?.toLowerCase() === "ongoing" ? "bg-brand-lime/10 text-brand-lime" : "bg-brand-blue/10 text-brand-blue"
                                )}>
                                    {anime.status || "Anime"}
                                </span>
                            )}
                        </span>
                        {anime.status?.toLowerCase() === "ongoing" && (
                            <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" title="Ongoing" />
                        )}
                    </div>
                </div>
            </GlassCard>
        </Link>
    );
}

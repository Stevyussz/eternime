"use client";

import { Episode } from "@/types";
import Link from "next/link";
import { useState } from "react";
import { Search, SortAsc, SortDesc, Play } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";

interface EpisodeListProps {
    episodes: Episode[];
}

export function EpisodesList({ episodes }: EpisodeListProps) {
    const [search, setSearch] = useState("");
    const [isReversed, setIsReversed] = useState(false);

    const filtered = episodes
        .filter(ep => ep.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => isReversed
            ? a.title.localeCompare(b.title, undefined, { numeric: true })
            : b.title.localeCompare(a.title, undefined, { numeric: true }) // Default newest first usually
        );

    // If default list is typically newest first, then "sort asc" reverses it to oldest first (Episode 1)
    const displayEpisodes = isReversed ? [...filtered].reverse() : filtered;

    return (
        <div className="container mx-auto px-6 pb-20">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-1 h-8 bg-brand-lime rounded-full" />
                    Episodes <span className="text-muted-foreground text-sm font-normal">({episodes.length})</span>
                </h2>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search episode..."
                            className="w-full bg-secondary/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-lime/50 transition-colors"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsReversed(!isReversed)}
                        className="p-2 bg-secondary/30 border border-white/10 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                        title={isReversed ? "Oldest First" : "Newest First"}
                    >
                        {isReversed ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayEpisodes.length === 0 ? (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        No episodes found matching "{search}"
                    </div>
                ) : (
                    displayEpisodes.map((eps) => (
                        <Link href={`/watch/${eps.episodeId}`} key={eps.episodeId}>
                            <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-secondary/10 hover:bg-white/5 hover:border-brand-lime/30 group transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-brand-lime/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <Play className="w-4 h-4 text-brand-lime ml-0.5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-medium text-sm md:text-base text-gray-200 group-hover:text-brand-lime transition-colors truncate">
                                        {eps.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground group-hover:text-gray-400">
                                        Episode {eps.title.match(/Episode\s+(\d+)/i)?.[1] || "?"}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

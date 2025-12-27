"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useEffect, useRef } from "react";
import { Episode } from "@/types";

interface EpisodeStripProps {
    currentEpisodeId: string;
    episodeList: Episode[];
    title: string;
}

export function EpisodeStrip({ currentEpisodeId, episodeList }: EpisodeStripProps) {
    const activeRef = useRef<HTMLAnchorElement>(null);

    // Sort episodes: Ascending
    const sortedEpisodes = [...episodeList].sort((a, b) => {
        const numA = parseInt(a.title.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.title.match(/\d+/)?.[0] || "0");
        return numA - numB;
    });

    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [sortedEpisodes]);

    return (
        <div className="w-full space-y-2">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-brand-lime" />
                    Episodes
                </h3>
                <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                    {episodeList.length} Total
                </span>
            </div>

            <div className="flex overflow-x-auto gap-2 pb-2 px-1 snap-x scroll-smooth custom-scrollbar">
                {sortedEpisodes.map((episode) => {
                    const isActive = episode.episodeId === currentEpisodeId;
                    // Extract number, e.g. "1035" from "One Piece Episode 1035"
                    const epNumber = episode.title.match(/Episode\s+(\d+)/i)?.[1] || episode.title.match(/\d+/)?.[0] || "#";

                    return (
                        <Link
                            key={episode.episodeId}
                            href={`/watch/${episode.episodeId}`}
                            ref={isActive ? activeRef : null}
                            className={`
                                relative shrink-0 snap-center
                                min-w-[60px] md:min-w-[70px] h-[50px] md:h-[60px]
                                rounded-lg border transition-all duration-300 group
                                flex flex-col items-center justify-center
                                ${isActive
                                    ? 'bg-brand-lime text-black border-brand-lime shadow-[0_0_15px_rgba(132,204,22,0.3)] scale-105 z-10'
                                    : 'bg-card border-border hover:bg-secondary hover:border-foreground/20'
                                }
                            `}
                        >
                            <span className={`text-xs md:text-sm font-black ${isActive ? 'text-black' : 'text-foreground'}`}>
                                {epNumber}
                            </span>
                            <span className={`text-[8px] uppercase tracking-wider font-bold ${isActive ? 'text-black/70' : 'text-muted-foreground'}`}>
                                EP
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

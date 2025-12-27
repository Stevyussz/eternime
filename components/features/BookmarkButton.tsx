"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import { AnimeDetail } from "@/types";
import { Bookmark, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    anime: AnimeDetail;
    animeId: string;
}

export function BookmarkButton({ anime, animeId }: BookmarkButtonProps) {
    const { addBookmark, removeBookmark, isBookmarked, isLoaded } = useBookmarks();
    const active = isBookmarked(animeId);

    if (!isLoaded) return <div className="w-10 h-10 rounded-full bg-secondary/20 animate-pulse" />;

    const handleClick = () => {
        if (active) {
            removeBookmark(animeId);
        } else {
            addBookmark({ ...anime, animeId });
        }
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "p-3 rounded-full border transition-all duration-300 flex items-center justify-center group relative",
                active
                    ? "bg-brand-lime text-black border-brand-lime"
                    : "bg-secondary/10 border-white/10 text-white hover:bg-secondary/30 hover:border-brand-lime/50"
            )}
            title={active ? "Remove from My List" : "Add to My List"}
        >
            <Bookmark className={cn("w-6 h-6 transition-transform", active ? "fill-current" : "")} />
            {active && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-brand-lime font-bold ring-1 ring-brand-lime">
                    <Check className="w-2.5 h-2.5" />
                </span>
            )}
        </button>
    );
}

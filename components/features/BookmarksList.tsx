"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { Trash2 } from "lucide-react";

export function BookmarksList() {
    const { bookmarks, removeBookmark } = useBookmarks();

    if (bookmarks.length === 0) {
        return <div className="text-center py-10 text-muted-foreground italic bg-secondary/10 rounded-xl">Your list is empty. Add some anime!</div>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {bookmarks.map((anime) => (
                <div key={anime.animeId} className="relative group">
                    <AnimeCard anime={anime as any} /> {/* Cast as any because bookmarks type might differ slightly from AnimeCard type but props match physically */}

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeBookmark(anime.animeId);
                        }}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg backdrop-blur-sm"
                        title="Remove from list"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}

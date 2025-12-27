"use client";

import { useState } from "react";
import { fetchAPI } from "@/lib/api";
import { AnimeCard as AnimeCardType } from "@/types";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PagedAnimeGridProps {
    initialItems: AnimeCardType[];
    endpoint: string; // e.g., "/ongoing" or "/genre/action"
    initialPage?: number;
}

export function PagedAnimeGrid({ initialItems, endpoint, initialPage = 1 }: PagedAnimeGridProps) {
    const [items, setItems] = useState<AnimeCardType[]>(initialItems);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);

        const nextPage = page + 1;
        // Determine connector: if endpoint already has '?', use '&', else '?'
        const connector = endpoint.includes('?') ? '&' : '?';
        const url = `${endpoint}${connector}page=${nextPage}`;

        try {
            // Assume API response structure has { data: { animeList: [] } }
            // Adjust type based on generic response if needed, but for now we cast to any or define an interface
            const res = await fetchAPI<{ data: { animeList: AnimeCardType[] } }>(url);
            const newItems = res.data.animeList;

            if (newItems && newItems.length > 0) {
                setItems(prev => [...prev, ...newItems]);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to load more anime", error);
            // Optionally handle error UI
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {items.map((anime, index) => (
                    // Use index in key to avoid duplicate key issues if API returns duplicates, 
                    // though usually unique ID is better. Concatenating ID + index just in case.
                    <AnimeCard key={`${anime.animeId}-${index}`} anime={anime} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <Button
                        onClick={loadMore}
                        disabled={loading}
                        variant="outline"
                        className="group min-w-[200px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> Load More
                            </>
                        )}
                    </Button>
                </div>
            )}

            {!hasMore && items.length > 0 && (
                <div className="text-center text-muted-foreground pt-8">
                    You've reached the end of the list.
                </div>
            )}
        </div>
    );
}

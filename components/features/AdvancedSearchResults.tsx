"use client";

import { useState, useMemo } from "react";
import { AnimeCard as AnimeCardType } from "@/types";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Film, Package, Tags, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdvancedSearchResultsProps {
    initialResults: AnimeCardType[];
}

export function AdvancedSearchResults({ initialResults }: AdvancedSearchResultsProps) {
    const [filterType, setFilterType] = useState<'all' | 'series' | 'batch'>('all');
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

    // Extract all unique genres from the results
    const allGenres = useMemo(() => {
        const genres = new Set<string>();
        initialResults.forEach(anime => {
            if (Array.isArray(anime.genreList)) {
                anime.genreList.forEach((g: any) => {
                    if (g && g.title) genres.add(g.title);
                });
            }
        });
        return Array.from(genres).sort();
    }, [initialResults]);

    // Filter results based on type and genre
    const filteredResults = useMemo(() => {
        return initialResults.filter(anime => {
            // Type Filter
            const isBatch = anime.title.toLowerCase().includes("batch");
            if (filterType === 'series' && isBatch) return false;
            if (filterType === 'batch' && !isBatch) return false;

            // Genre Filter
            if (selectedGenre) {
                // Safe check for genreList
                const hasGenre = Array.isArray(anime.genreList) && anime.genreList.some((g: any) => g.title === selectedGenre);
                if (!hasGenre) return false;
            }

            return true;
        });
    }, [initialResults, filterType, selectedGenre]);

    return (
        <div className="space-y-6">
            {/* Filters Container */}
            <div className="bg-muted/30 backdrop-blur-sm border border-white/5 rounded-xl p-4 space-y-4">
                {/* Type Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <Button
                        variant={filterType === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('all')}
                        className="rounded-full"
                    >
                        All
                    </Button>
                    <Button
                        variant={filterType === 'series' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('series')}
                        className="rounded-full gap-2"
                    >
                        <Film className="w-3 h-3" /> Series
                    </Button>
                    <Button
                        variant={filterType === 'batch' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilterType('batch')}
                        className="rounded-full gap-2"
                    >
                        <Package className="w-3 h-3" /> Batch
                    </Button>

                    <div className="h-6 w-px bg-white/10 mx-2" />

                    {/* Genre Status */}
                    <div className="flex-1 flex items-center justify-end">
                        {selectedGenre && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedGenre(null)}
                                className="text-muted-foreground hover:text-foreground h-8"
                            >
                                Clear Genre <X className="w-3 h-3 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Genre Tags */}
                {allGenres.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Tags className="w-3 h-3" /> Filter by Genre
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allGenres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                                    className={cn(
                                        "text-xs px-3 py-1 rounded-full border transition-all duration-200",
                                        selectedGenre === genre
                                            ? "bg-brand-lime text-black border-brand-lime font-bold shadow-[0_0_10px_rgba(132,204,22,0.3)]"
                                            : "bg-black/20 border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground"
                                    )}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredResults.map((anime) => (
                        <motion.div
                            key={anime.animeId}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AnimeCard anime={anime} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredResults.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-white/10">
                    <p className="text-muted-foreground">No results found for this filter combination.</p>
                    <Button
                        variant="link"
                        onClick={() => { setFilterType('all'); setSelectedGenre(null); }}
                        className="mt-2"
                    >
                        Reset Filters
                    </Button>
                </div>
            )}
        </div>
    );
}

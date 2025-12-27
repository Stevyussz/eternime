"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { AnimeCard as AnimeCardType } from "@/types";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { Sparkles } from "lucide-react";

interface SmartRecommendationsProps {
    currentGenreId: string;
    currentAnimeId: string;
}

interface GenreResponse {
    data: {
        animeList: AnimeCardType[];
    };
}

export function SmartRecommendations({ currentGenreId, currentAnimeId }: SmartRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<AnimeCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            // Basic implementation: fetch from the same genre
            // In a real app, this would be a sophisticated AI or tag-based system
            try {
                const res = await fetchAPI<GenreResponse>(`/genre/${currentGenreId}`);
                if (res.data.animeList) {
                    // Filter out current anime and shuffle
                    const filtered = res.data.animeList
                        .filter(a => a.animeId !== currentAnimeId)
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 5);

                    setRecommendations(filtered);
                }
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentGenreId) {
            fetchRecommendations();
        } else {
            setLoading(false);
        }
    }, [currentGenreId, currentAnimeId]);

    if (loading) return null; // Or a skeleton
    if (recommendations.length === 0) return null;

    return (
        <section className="container mx-auto px-6 py-12 border-t border-white/5">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-brand-lime" />
                You Might Also Like
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {recommendations.map(anime => (
                    <AnimeCard key={anime.animeId} anime={anime} />
                ))}
            </div>
        </section>
    );
}
